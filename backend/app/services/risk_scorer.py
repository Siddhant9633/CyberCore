"""
CYBERCORE Backend — Risk Scoring Engine

Implements the weighted risk scoring model described in the spec:

  Component                          Weight
  ─────────────────────────────────────────
  Threat Intelligence (VT/GSB/URLh)   30%
  Phishing & Malware Indicators        20%
  Domain Reputation                    15%
  Suspicious URL Patterns              15%
  SSL/TLS Security                     10%
  Redirect Analysis                    10%

Each component returns a ComponentScore (0–100 + confidence).
The final risk score is the weighted sum.

IMPORTANT: Scores are never fabricated or randomized.
If a component cannot be evaluated, its contribution is
marked as UNAVAILABLE and excluded from the weighted average.
"""

from dataclasses import dataclass, field
from typing import Optional
from enum import Enum


class RiskCategory(str, Enum):
    LOW = "LOW"
    MODERATE_LOW = "MODERATE_LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Confidence(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    UNAVAILABLE = "UNAVAILABLE"


class FindingType(str, Enum):
    """Distinguish between types of security findings."""
    CONFIRMED_THREAT = "CONFIRMED_THREAT"
    SUSPICIOUS_INDICATOR = "SUSPICIOUS_INDICATOR"
    HEURISTIC_ASSESSMENT = "HEURISTIC_ASSESSMENT"
    NO_KNOWN_DETECTION = "NO_KNOWN_DETECTION"
    UNABLE_TO_VERIFY = "UNABLE_TO_VERIFY"


@dataclass
class ComponentScore:
    name: str
    score: Optional[float]           # 0–100, None if unavailable
    confidence: Confidence
    finding_type: FindingType
    details: dict = field(default_factory=dict)
    evidence: list = field(default_factory=list)

    @property
    def is_available(self) -> bool:
        return self.score is not None


# Weights must sum to 1.0
COMPONENT_WEIGHTS = {
    "threat_intelligence": 0.30,
    "phishing_malware":    0.20,
    "domain_reputation":   0.15,
    "url_patterns":        0.15,
    "ssl_tls":             0.10,
    "redirect_analysis":   0.10,
}


def calculate_risk_score(components: dict[str, ComponentScore]) -> dict:
    """
    Calculate the weighted risk score from component scores.

    Only available components contribute to the score.
    Weights are re-normalized when some components are unavailable.

    Returns:
        dict with keys: score, category, confidence, components, unavailable
    """
    available_weight_total = 0.0
    weighted_sum = 0.0
    component_details = {}
    unavailable = []

    for key, weight in COMPONENT_WEIGHTS.items():
        comp = components.get(key)
        if comp and comp.is_available:
            available_weight_total += weight
            weighted_sum += comp.score * weight
            component_details[key] = {
                "score": round(comp.score),
                "confidence": comp.confidence.value,
                "finding_type": comp.finding_type.value,
                "details": comp.details,
                "evidence": comp.evidence,
            }
        else:
            unavailable.append(key)
            component_details[key] = {
                "score": None,
                "confidence": Confidence.UNAVAILABLE.value,
                "finding_type": FindingType.UNABLE_TO_VERIFY.value,
                "details": {},
                "evidence": [],
            }

    # Normalize to available weight
    if available_weight_total == 0:
        final_score = 0
        overall_confidence = Confidence.UNAVAILABLE
    else:
        final_score = round(weighted_sum / available_weight_total)
        # Overall confidence based on available data coverage
        coverage = available_weight_total
        if coverage >= 0.80:
            overall_confidence = Confidence.HIGH
        elif coverage >= 0.50:
            overall_confidence = Confidence.MEDIUM
        else:
            overall_confidence = Confidence.LOW

    category = score_to_category(final_score)

    return {
        "score": final_score,
        "category": category.value,
        "confidence": overall_confidence.value,
        "components": component_details,
        "unavailable_checks": unavailable,
        "coverage": round(available_weight_total * 100),
    }


def score_to_category(score: int) -> RiskCategory:
    """Convert numeric score to risk category."""
    if score <= 20:
        return RiskCategory.LOW
    elif score <= 40:
        return RiskCategory.MODERATE_LOW
    elif score <= 60:
        return RiskCategory.MODERATE
    elif score <= 80:
        return RiskCategory.HIGH
    else:
        return RiskCategory.CRITICAL


# ---------------------------------------------------------------------------
# URL Pattern Analysis
# ---------------------------------------------------------------------------

import re
import tldextract


SUSPICIOUS_URL_PATTERNS = [
    # Typosquatting indicators
    (r"paypa[l1]|pay-pal|paypa1", "Possible PayPal typosquatting", 70),
    (r"googl[e3]|g[o0]{2}gle|g00gle", "Possible Google typosquatting", 70),
    (r"amaz[o0]n|amaz[o0]n-", "Possible Amazon typosquatting", 65),
    (r"micros[o0]ft|micr[o0]soft", "Possible Microsoft typosquatting", 70),
    (r"faceb[o0]{2}k|faceb[0o]ok", "Possible Facebook typosquatting", 70),
    (r"app[l1]e-|appl[e3]\.support", "Possible Apple typosquatting", 65),

    # Suspicious keywords in domain
    (r"secure-|security-|safe-", "Security keyword in domain (phishing tactic)", 30),
    (r"login-|signin-|account-|verify-|update-", "Action keyword in domain (phishing tactic)", 35),
    (r"-bank|-banking|-pay|-payment|-wallet", "Financial keyword in domain", 30),
    (r"free-|win-|prize-|reward-|lucky-", "Reward lure keyword in domain", 40),
    (r"urgent-|alert-|warning-|notice-", "Urgency keyword in domain", 35),
    (r"\.tk$|\.ml$|\.ga$|\.cf$|\.gq$", "High-risk free TLD", 45),
    (r"\.xyz$|\.top$|\.click$|\.link$", "Commonly abused TLD", 20),

    # Suspicious structure
    (r"\d{4,}", "Multiple consecutive digits in domain", 15),
    (r"-{2,}", "Multiple consecutive hyphens", 20),
    (r"https?://.{100,}", "Excessively long URL", 20),
    (r"@", "URL contains @ symbol (credential bypass attempt)", 60),
    (r"//.*//", "Multiple double-slashes in path", 30),
    (r"base64|%[0-9a-fA-F]{2}.*%[0-9a-fA-F]{2}.*%[0-9a-fA-F]{2}", "Heavy URL encoding (obfuscation)", 35),
]


def analyze_url_patterns(url: str, domain: str) -> ComponentScore:
    """Analyze URL and domain for suspicious patterns."""
    matches = []
    max_score = 0

    for pattern, description, severity in SUSPICIOUS_URL_PATTERNS:
        if re.search(pattern, url, re.IGNORECASE):
            matches.append({"pattern": description, "severity": severity})
            max_score = max(max_score, severity)

    # Check subdomain depth
    ext = tldextract.extract(url)
    subdomain_count = len(ext.subdomain.split(".")) if ext.subdomain else 0
    if subdomain_count >= 3:
        matches.append({"pattern": f"Deep subdomain nesting ({subdomain_count} levels)", "severity": 25})
        max_score = max(max_score, 25)

    # Check domain length
    if ext.domain and len(ext.domain) > 30:
        matches.append({"pattern": "Unusually long domain name", "severity": 20})
        max_score = max(max_score, 20)

    # Calculate score as combination of max severity + spread
    if not matches:
        score = 0
        finding_type = FindingType.NO_KNOWN_DETECTION
    elif max_score >= 60:
        score = min(90, max_score + len(matches) * 5)
        finding_type = FindingType.SUSPICIOUS_INDICATOR
    else:
        score = min(70, max_score + len(matches) * 3)
        finding_type = (
            FindingType.SUSPICIOUS_INDICATOR if max_score >= 30
            else FindingType.HEURISTIC_ASSESSMENT
        )

    return ComponentScore(
        name="URL Pattern Analysis",
        score=float(score),
        confidence=Confidence.HIGH,  # Pattern matching is deterministic
        finding_type=finding_type,
        details={"patterns_matched": len(matches)},
        evidence=[m["pattern"] for m in matches],
    )
