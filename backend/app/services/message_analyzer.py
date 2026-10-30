"""
CYBERCORE Backend — Message Scam Analyzer Service

Analyzes suspicious emails, SMS, and other messages for scam indicators.

Detection approach:
  1. Rule-based pattern matching (primary, fast, deterministic)
  2. Keyword and phrase analysis
  3. URL extraction and flagging
  4. Urgency and manipulation tactic detection
  5. Impersonation indicator detection

NOTE: AI can be used to EXPLAIN findings but is NOT the primary detection mechanism.
Detection results must have evidence — never classify based on AI guess alone.
"""

import re
import hashlib
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class MessageAnalysisResult:
    risk_score: int
    scam_type: Optional[str]
    indicators: list[dict]
    urls_found: list[str]
    manipulation_tactics: list[str]
    impersonation_targets: list[str]
    recommended_actions: list[str]
    message_hash: str  # Store hash, never raw message


# ─────────────────────────────────────────────────────────────
# SCAM PATTERN LIBRARY
# Each entry: (regex_pattern, description, scam_type, severity 0-100)
# ─────────────────────────────────────────────────────────────

SCAM_PATTERNS = [
    # OTP / Account Verification Scams
    (r"otp.*expire|your\s+otp\s+is|share.*otp|send.*otp|verify.*otp", "OTP sharing request", "OTP_FRAUD", 85),
    (r"never\s+share.*otp|do\s+not\s+share.*otp", None, None, 0),  # Legitimate warning — negative signal

    # KYC Scams (common in India)
    (r"kyc.*expire|complete.*kyc|kyc.*update|verify.*kyc|kyc.*pending", "KYC urgency scam", "KYC_SCAM", 80),
    (r"your\s+account\s+will\s+be\s+(blocked|suspended|deactivated|frozen)", "Account suspension threat", "ACCOUNT_THREAT", 75),

    # Lottery / Prize Scams
    (r"you\s+have\s+(won|win|been\s+selected|been\s+chosen)", "Prize/Lottery claim", "LOTTERY_SCAM", 85),
    (r"congratulations.*winner|prize.*claim|lottery.*winner|lucky\s+draw", "Lottery/prize scam", "LOTTERY_SCAM", 85),
    (r"claim\s+your\s+(prize|reward|gift|cash|money)", "Prize claim prompt", "LOTTERY_SCAM", 80),

    # Job / Internship Scams
    (r"work\s+from\s+home.*earn|earn.*per\s+(day|week|hour).*from\s+home", "Work-from-home income scam", "JOB_SCAM", 75),
    (r"job\s+offer.*no\s+experience|easy\s+(job|money|income|earning)", "Fake job offer", "JOB_SCAM", 70),
    (r"whatsapp.*job|telegram.*task.*earn|youtube.*like.*earn", "Social media task scam", "TASK_SCAM", 85),
    (r"part.?time.*earn|internship.*fee|training\s+fee.*job", "Fake internship/job fee", "JOB_SCAM", 80),

    # Investment / Trading Scams
    (r"guaranteed.*return|100%.*profit|risk.?free.*invest|double.*money", "Guaranteed returns scam", "INVESTMENT_SCAM", 90),
    (r"crypto.*profit.*guaranteed|forex.*guaranteed|trading.*signal.*profit", "Fake trading signal", "INVESTMENT_SCAM", 85),
    (r"pay\s+(first|now|today)\s+to\s+(unlock|start|begin|access)", "Advance fee fraud", "ADVANCE_FEE", 85),

    # Courier / Delivery Scams
    (r"parcel.*detained|package.*held|customs.*fee.*release|delivery.*fee.*pending", "Courier delivery scam", "COURIER_SCAM", 80),
    (r"fedex.*package|dhl.*parcel.*customs|courier.*clearance.*pay", "Fake courier notification", "COURIER_SCAM", 75),

    # Phishing Patterns
    (r"click.*link.*verify|tap.*link.*confirm|follow.*link.*update", "Suspicious link click request", "PHISHING", 70),
    (r"your\s+password.*expire|reset.*password.*immediately", "Password urgency phishing", "PHISHING", 75),
    (r"bank.*account.*suspend|credit\s+card.*block|upi.*suspend", "Banking threat phishing", "PHISHING", 80),

    # Impersonation
    (r"income\s+tax|it\s+department.*notice|income\s+tax.*refund", "Tax authority impersonation", "IMPERSONATION", 80),
    (r"police|cyber\s+crime.*notice|cbi.*notice|enforcement.*directorate", "Law enforcement impersonation", "IMPERSONATION", 85),
    (r"rbi.*guidelines|reserve\s+bank.*india.*notice", "RBI impersonation", "IMPERSONATION", 85),
    (r"amazon.*gift|flipkart.*winner|google.*reward|microsoft.*winner", "Tech brand impersonation", "IMPERSONATION", 80),

    # Generic Urgency
    (r"urgent|immediate\s+action|act\s+now|limited\s+time|expires?\s+in\s+\d+\s+hour", "Urgency pressure tactic", "URGENCY", 40),
    (r"final\s+(notice|warning|reminder)|last\s+(chance|opportunity)", "Final warning pressure", "URGENCY", 50),
]

MANIPULATION_TACTICS = [
    (r"urgent|immediately|right\s+now|don'?t\s+wait", "Urgency"),
    (r"secret|confidential|private.*opportunity|exclusive", "False exclusivity"),
    (r"fear|warning|danger|serious|consequence", "Fear induction"),
    (r"limited\s+(time|offer|seats?|spots?)", "Artificial scarcity"),
    (r"trust\s+me|i\s+promise|guaranteed|100%\s+safe", "False reassurance"),
    (r"don'?t\s+tell|keep\s+this\s+between|don'?t\s+share\s+this", "Secrecy request"),
]

KNOWN_IMPERSONATION_TARGETS = {
    r"amazon": "Amazon",
    r"flipkart": "Flipkart",
    r"google": "Google",
    r"microsoft": "Microsoft",
    r"apple": "Apple",
    r"paypal": "PayPal",
    r"paytm": "Paytm",
    r"phonepe": "PhonePe",
    r"gpay|google\s+pay": "Google Pay",
    r"state\s+bank|sbi": "State Bank of India",
    r"hdfc": "HDFC Bank",
    r"icici": "ICICI Bank",
    r"axis\s+bank": "Axis Bank",
    r"income\s+tax|it\s+department": "Income Tax Department",
    r"reserve\s+bank|rbi": "Reserve Bank of India",
    r"police|cbi|ed\s+": "Law Enforcement Agency",
    r"fedex|dhl|bluedart": "Courier Company",
    r"irdai": "IRDAI",
    r"trai": "TRAI",
    r"sebi": "SEBI",
}

URL_PATTERN = re.compile(
    r"https?://[^\s<>\"{}|\\^`\[\]]+|www\.[^\s<>\"{}|\\^`\[\]]+"
)


def analyze_message(message_text: str) -> MessageAnalysisResult:
    """
    Analyze a suspicious message for scam indicators.

    Args:
        message_text: The message text (email body, SMS, etc.)

    Returns:
        MessageAnalysisResult with risk score and evidence
    """
    if not message_text or not message_text.strip():
        return MessageAnalysisResult(
            risk_score=0,
            scam_type=None,
            indicators=[],
            urls_found=[],
            manipulation_tactics=[],
            impersonation_targets=[],
            recommended_actions=["No message content to analyze."],
            message_hash="",
        )

    # Hash the message for storage (never store raw message)
    message_hash = hashlib.sha256(message_text.encode("utf-8")).hexdigest()

    text_lower = message_text.lower()
    indicators = []
    max_score = 0
    detected_scam_type = None

    # ── Pattern matching ──────────────────────────────────────
    for pattern, description, scam_type, severity in SCAM_PATTERNS:
        if description is None:
            continue  # Skip negative signals (legitimate warnings)
        if re.search(pattern, text_lower):
            indicators.append({
                "type": "pattern_match",
                "description": description,
                "scam_type": scam_type,
                "severity": severity,
            })
            if severity > max_score:
                max_score = severity
                detected_scam_type = scam_type

    # ── URL extraction ────────────────────────────────────────
    urls_found = URL_PATTERN.findall(message_text)
    if urls_found:
        indicators.append({
            "type": "urls_detected",
            "description": f"{len(urls_found)} URL(s) found in message",
            "severity": min(30 + len(urls_found) * 10, 60),
        })
        max_score = max(max_score, 30)

    # ── Manipulation tactics ──────────────────────────────────
    tactics_found = []
    for pattern, tactic_name in MANIPULATION_TACTICS:
        if re.search(pattern, text_lower):
            tactics_found.append(tactic_name)

    # ── Impersonation detection ───────────────────────────────
    impersonation_targets = []
    for pattern, target_name in KNOWN_IMPERSONATION_TARGETS.items():
        if re.search(pattern, text_lower):
            impersonation_targets.append(target_name)
            indicators.append({
                "type": "impersonation",
                "description": f"Possible impersonation of: {target_name}",
                "severity": 65,
            })
            max_score = max(max_score, 65)

    # ── Score adjustments ─────────────────────────────────────
    # Multiple strong indicators amplify the score
    strong_indicators = [i for i in indicators if i.get("severity", 0) >= 70]
    if len(strong_indicators) >= 3:
        max_score = min(max_score + 15, 98)
    elif len(strong_indicators) >= 2:
        max_score = min(max_score + 8, 98)

    # Add urgency tactics to score
    if len(tactics_found) >= 2:
        max_score = min(max_score + 10, 98)

    final_score = max_score

    return MessageAnalysisResult(
        risk_score=final_score,
        scam_type=_normalize_scam_type(detected_scam_type),
        indicators=sorted(indicators, key=lambda x: x.get("severity", 0), reverse=True),
        urls_found=urls_found[:20],  # Limit to first 20 URLs
        manipulation_tactics=list(set(tactics_found)),
        impersonation_targets=list(set(impersonation_targets)),
        recommended_actions=_get_message_recommendations(final_score, detected_scam_type),
        message_hash=message_hash,
    )


def _normalize_scam_type(scam_type: Optional[str]) -> Optional[str]:
    """Convert internal scam type to human-readable label."""
    labels = {
        "OTP_FRAUD": "OTP Fraud Attempt",
        "KYC_SCAM": "KYC Verification Scam",
        "ACCOUNT_THREAT": "Account Suspension Threat",
        "LOTTERY_SCAM": "Lottery / Prize Scam",
        "JOB_SCAM": "Fake Job / Internship Offer",
        "TASK_SCAM": "Social Media Task Scam",
        "INVESTMENT_SCAM": "Investment / Trading Scam",
        "ADVANCE_FEE": "Advance Fee Fraud",
        "COURIER_SCAM": "Fake Courier / Delivery Scam",
        "PHISHING": "Phishing Attempt",
        "IMPERSONATION": "Brand / Authority Impersonation",
        "URGENCY": "Urgency-based Manipulation",
    }
    return labels.get(scam_type, scam_type)


def _get_message_recommendations(score: int, scam_type: Optional[str]) -> list:
    """Generate recommendations based on message analysis."""
    base = []

    if score >= 75:
        base = [
            "This message shows strong indicators of a scam. Do not respond.",
            "Do not click any links in this message.",
            "Do not share any personal information, OTP, or passwords.",
            "Block and report the sender.",
        ]
    elif score >= 50:
        base = [
            "This message has suspicious characteristics.",
            "Do not share OTP, passwords, or financial information.",
            "Verify the sender's identity through official channels.",
            "Do not click unknown links.",
        ]
    elif score >= 25:
        base = [
            "Some caution is advised with this message.",
            "Verify the sender before responding.",
        ]
    else:
        base = [
            "No strong scam indicators detected.",
            "Always remain cautious with unexpected messages.",
        ]

    # Type-specific advice
    if scam_type == "OTP_FRAUD":
        base.append("Your bank or any legitimate service will NEVER ask for your OTP.")
    elif scam_type in ("KYC_SCAM", "ACCOUNT_THREAT"):
        base.append("Visit your bank's official website or call their official helpline to verify.")
    elif scam_type == "INVESTMENT_SCAM":
        base.append("Legitimate investments are never guaranteed. Report to SEBI if investment-related.")
    elif scam_type == "IMPERSONATION":
        base.append("Contact the impersonated organization directly using contact info from their official website.")

    return base
