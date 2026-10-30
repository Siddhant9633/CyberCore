"""
CYBERCORE Backend — URL Scanner (Core Engine)

Orchestrates the full URL security analysis pipeline:
  1. URL Validation + SSRF Protection
  2. SSL/TLS Check
  3. DNS Analysis + Domain Reputation (RDAP)
  4. Threat Intelligence (VirusTotal + GSB + URLhaus)
  5. URL Pattern Analysis
  6. Redirect Analysis
  7. Risk Score Calculation

All checks run concurrently where safe to do so.
Results are structured and cached.
"""

import asyncio
import logging
import hashlib
import uuid
from datetime import datetime, timezone
from typing import Optional
import httpx

from app.config import get_settings
from app.utils.validators import validate_url, ValidationError
from app.services.threat_intel import (
    check_virustotal_url,
    check_google_safe_browsing,
    check_urlhaus,
    aggregate_threat_intel,
)
from app.services.ssl_checker import check_ssl_tls
from app.services.dns_analyzer import analyze_dns, get_domain_rdap, build_domain_reputation_score
from app.services.risk_scorer import (
    calculate_risk_score,
    analyze_url_patterns,
    ComponentScore,
    Confidence,
    FindingType,
)

settings = get_settings()
logger = logging.getLogger(__name__)

MAX_REDIRECTS = 5
REDIRECT_TIMEOUT = httpx.Timeout(10.0, connect=5.0)


async def scan_url(url: str, source: str = "web") -> dict:
    """
    Main URL scanning function — runs full security analysis.

    Args:
        url: The URL to scan (will be validated and normalized)
        source: 'web' or 'extension'

    Returns:
        Structured scan result dict ready for API response and DB storage

    Raises:
        ValidationError: If URL fails security validation
    """
    # Step 1: Validate URL (SSRF protection happens here)
    normalized_url, domain = validate_url(url)
    scan_id = str(uuid.uuid4())
    started_at = datetime.now(timezone.utc)

    logger.info("Starting scan [%s] for domain: %s", scan_id, domain)

    # Step 2: Run independent checks concurrently
    (
        vt_result,
        gsb_result,
        urlhaus_result,
        ssl_result,
        dns_data,
        rdap_data,
    ) = await asyncio.gather(
        check_virustotal_url(normalized_url),
        check_google_safe_browsing(normalized_url),
        check_urlhaus(normalized_url),
        check_ssl_tls(domain),
        analyze_dns(domain),
        get_domain_rdap(domain),
        return_exceptions=True,
    )

    # Handle exceptions from gather (shouldn't happen but be safe)
    vt_result = _ensure_component(vt_result, "VirusTotal URL")
    gsb_result = _ensure_component(gsb_result, "Google Safe Browsing")
    urlhaus_result = _ensure_component(urlhaus_result, "URLhaus")
    ssl_result = _ensure_component(ssl_result, "SSL/TLS")
    dns_data = dns_data if isinstance(dns_data, dict) else {}
    rdap_data = rdap_data if isinstance(rdap_data, dict) else {}

    # Step 3: Aggregate threat intelligence
    threat_intel_score = aggregate_threat_intel(vt_result, gsb_result, urlhaus_result)

    # Step 4: Domain reputation from RDAP
    domain_reputation_score = await build_domain_reputation_score(domain, rdap_data)

    # Step 5: URL pattern analysis (synchronous, deterministic)
    url_pattern_score = analyze_url_patterns(normalized_url, domain)

    # Step 6: Redirect analysis
    redirect_score = await analyze_redirects(normalized_url)

    # Step 7: Phishing/Malware indicator score
    phishing_malware_score = _build_phishing_malware_score(
        vt_result, gsb_result, urlhaus_result, url_pattern_score
    )

    # Step 8: Calculate weighted risk score
    components = {
        "threat_intelligence": threat_intel_score,
        "phishing_malware": phishing_malware_score,
        "domain_reputation": domain_reputation_score,
        "url_patterns": url_pattern_score,
        "ssl_tls": ssl_result,
        "redirect_analysis": redirect_score,
    }

    risk_result = calculate_risk_score(components)
    completed_at = datetime.now(timezone.utc)

    return {
        "scan_id": scan_id,
        "url": normalized_url,
        "domain": domain,
        "risk_score": risk_result["score"],
        "risk_category": risk_result["category"],
        "confidence": risk_result["confidence"],
        "coverage_percent": risk_result["coverage"],
        "is_phishing": _is_phishing(vt_result, gsb_result, url_pattern_score),
        "is_malware": _is_malware(vt_result, urlhaus_result),
        "ssl_valid": ssl_result.details.get("valid") if ssl_result.is_available else None,
        "components": risk_result["components"],
        "unavailable_checks": risk_result["unavailable_checks"],
        "dns_details": dns_data,
        "whois_details": rdap_data,
        "source": source,
        "scanned_at": completed_at.isoformat(),
        "scan_duration_ms": int((completed_at - started_at).total_seconds() * 1000),
        "recommended_actions": _get_recommendations(risk_result["score"], risk_result["category"]),
    }


def _ensure_component(result, name: str) -> ComponentScore:
    """Convert exceptions to UNAVAILABLE ComponentScore."""
    if isinstance(result, ComponentScore):
        return result
    if isinstance(result, Exception):
        logger.error("Component %s failed: %s", name, str(result))
    return ComponentScore(
        name=name,
        score=None,
        confidence=Confidence.UNAVAILABLE,
        finding_type=FindingType.UNABLE_TO_VERIFY,
        details={"reason": "Check failed unexpectedly"},
    )


async def analyze_redirects(url: str) -> ComponentScore:
    """
    Follow redirects and analyze the redirect chain for suspicious patterns.
    """
    redirect_chain = []
    issues = []
    suspicious = False

    try:
        async with httpx.AsyncClient(
            timeout=REDIRECT_TIMEOUT,
            follow_redirects=False,
            verify=True,
        ) as client:
            current_url = url
            for i in range(MAX_REDIRECTS + 1):
                try:
                    resp = await client.get(current_url, headers={"User-Agent": "CYBERCORE-Scanner/1.0"})
                except httpx.ConnectError:
                    break
                except Exception:
                    break

                redirect_chain.append({
                    "url": current_url,
                    "status_code": resp.status_code,
                })

                if resp.status_code in (301, 302, 303, 307, 308):
                    next_url = resp.headers.get("location", "")
                    if not next_url:
                        break
                    # Resolve relative redirects
                    if next_url.startswith("/"):
                        from urllib.parse import urlparse
                        parsed = urlparse(current_url)
                        next_url = f"{parsed.scheme}://{parsed.netloc}{next_url}"

                    # Validate redirect target
                    try:
                        from app.utils.validators import validate_url
                        _, redirect_domain = validate_url(next_url)
                    except ValidationError as e:
                        issues.append(f"Redirect to blocked destination: {str(e)}")
                        suspicious = True
                        break

                    current_url = next_url
                else:
                    break

    except Exception as e:
        return ComponentScore(
            name="Redirect Analysis",
            score=None,
            confidence=Confidence.UNAVAILABLE,
            finding_type=FindingType.UNABLE_TO_VERIFY,
            details={"reason": f"Could not follow redirects: {type(e).__name__}"},
        )

    redirect_count = len(redirect_chain) - 1 if len(redirect_chain) > 1 else 0

    if suspicious:
        score = 80.0
        finding_type = FindingType.SUSPICIOUS_INDICATOR
    elif redirect_count > 3:
        score = 40.0
        issues.append(f"Excessive redirect chain: {redirect_count} redirects")
        finding_type = FindingType.SUSPICIOUS_INDICATOR
    elif redirect_count > 1:
        score = 15.0
        finding_type = FindingType.HEURISTIC_ASSESSMENT
    else:
        score = 0.0
        finding_type = FindingType.NO_KNOWN_DETECTION

    return ComponentScore(
        name="Redirect Analysis",
        score=score,
        confidence=Confidence.MEDIUM,
        finding_type=finding_type,
        details={
            "redirect_count": redirect_count,
            "redirect_chain": redirect_chain,
        },
        evidence=issues if issues else [
            f"{redirect_count} redirect(s) detected" if redirect_count > 0
            else "No suspicious redirects detected"
        ],
    )


def _build_phishing_malware_score(
    vt: ComponentScore,
    gsb: ComponentScore,
    urlhaus: ComponentScore,
    url_patterns: ComponentScore,
) -> ComponentScore:
    """
    Synthesize a phishing & malware indicator score.
    Combines positive signals from all sources.
    """
    indicators = []
    max_score = 0

    if gsb.is_available and gsb.score and gsb.score >= 70:
        indicators.append("Google Safe Browsing phishing/malware detection")
        max_score = max(max_score, gsb.score)

    if urlhaus.is_available and urlhaus.score and urlhaus.score >= 70:
        indicators.append("URLhaus confirmed malware distribution")
        max_score = max(max_score, urlhaus.score)

    if vt.is_available and vt.score and vt.score >= 60:
        if vt.finding_type == FindingType.CONFIRMED_THREAT:
            indicators.append(f"VirusTotal detection: score {vt.score:.0f}/100")
            max_score = max(max_score, vt.score)

    if url_patterns.is_available and url_patterns.score and url_patterns.score >= 50:
        indicators.extend(url_patterns.evidence[:2])
        max_score = max(max_score, url_patterns.score * 0.7)

    if not indicators:
        return ComponentScore(
            name="Phishing & Malware",
            score=5.0,
            confidence=Confidence.MEDIUM,
            finding_type=FindingType.NO_KNOWN_DETECTION,
            details={},
            evidence=["No phishing or malware indicators detected"],
        )

    return ComponentScore(
        name="Phishing & Malware",
        score=min(max_score, 95.0),
        confidence=Confidence.HIGH,
        finding_type=(
            FindingType.CONFIRMED_THREAT
            if max_score >= 70
            else FindingType.SUSPICIOUS_INDICATOR
        ),
        details={"indicator_count": len(indicators)},
        evidence=indicators,
    )


def _is_phishing(vt: ComponentScore, gsb: ComponentScore, patterns: ComponentScore) -> Optional[bool]:
    """Determine phishing status from available evidence."""
    if gsb.is_available and gsb.finding_type == FindingType.CONFIRMED_THREAT:
        gsb_threats = gsb.details.get("threat_types", [])
        if "SOCIAL_ENGINEERING" in gsb_threats:
            return True
    if vt.is_available and vt.finding_type == FindingType.CONFIRMED_THREAT:
        categories = vt.details.get("categories", {})
        if any("phish" in str(v).lower() for v in categories.values()):
            return True
    if not gsb.is_available and not vt.is_available:
        return None  # Cannot determine
    return False


def _is_malware(vt: ComponentScore, urlhaus: ComponentScore) -> Optional[bool]:
    """Determine malware status from available evidence."""
    if urlhaus.is_available and urlhaus.finding_type == FindingType.CONFIRMED_THREAT:
        return True
    if vt.is_available and vt.finding_type == FindingType.CONFIRMED_THREAT:
        categories = vt.details.get("categories", {})
        if any("malware" in str(v).lower() for v in categories.values()):
            return True
    if not vt.is_available and not urlhaus.is_available:
        return None  # Cannot determine
    return False


def _get_recommendations(score: int, category: str) -> list:
    """Generate actionable recommendations based on risk score."""
    if category == "CRITICAL":
        return [
            "Do not visit this website.",
            "If you have already visited it, do not enter any personal information.",
            "Run a malware scan on your device if you clicked any links.",
            "Report this website to your browser vendor and local cybercrime authority.",
        ]
    elif category == "HIGH":
        return [
            "Exercise extreme caution before proceeding.",
            "Do not enter personal, financial, or login credentials.",
            "Verify the website's legitimacy through official channels.",
            "Consider using a secondary device if you must visit.",
        ]
    elif category == "MODERATE":
        return [
            "Proceed with caution.",
            "Verify the website identity before entering any information.",
            "Look for HTTPS and valid SSL certificate.",
            "Check if the domain matches the expected organization.",
        ]
    elif category == "MODERATE_LOW":
        return [
            "No major threats detected, but stay alert.",
            "Verify the site is who it claims to be.",
            "Avoid entering sensitive data if unsure.",
        ]
    else:
        return [
            "No significant threats detected by available checks.",
            "Always verify website authenticity for sensitive transactions.",
            "Keep your browser and security software updated.",
        ]
