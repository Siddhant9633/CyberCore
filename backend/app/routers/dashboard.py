"""
CYBERCORE Backend — Dashboard & Threat Intelligence Feed Router

Provides telemetry, user safety summaries, threat intelligence feeds,
and user-submitted threat reports.
"""

import logging
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Telemetry"])


class ThreatReportRequest(BaseModel):
    url: str = Field(..., description="Malicious URL or domain being reported")
    threat_type: str = Field(..., description="phishing, malware, scam, impersonation, or other")
    description: Optional[str] = Field(None, max_length=1000)


# In-memory recent threats / telemetry store for demonstration & local operation
RECENT_SCANS = [
    {
        "id": "scan-1",
        "target": "login-secure-verify-update.xyz",
        "type": "URL",
        "risk_score": 88,
        "risk_level": "CRITICAL",
        "verdict": "Phishing & Fake Banking Portal",
        "timestamp": "2026-10-30T10:15:00Z",
    },
    {
        "id": "scan-2",
        "target": "github.com",
        "type": "URL",
        "risk_score": 4,
        "risk_level": "SAFE",
        "verdict": "Trusted Global Software Repository",
        "timestamp": "2026-10-30T10:22:00Z",
    },
    {
        "id": "scan-3",
        "target": "Urgent KYC Verification SMS",
        "type": "MESSAGE",
        "risk_score": 82,
        "risk_level": "CRITICAL",
        "verdict": "KYC Urgency Social Engineering Fraud",
        "timestamp": "2026-10-30T10:30:00Z",
    },
    {
        "id": "scan-4",
        "target": "invoice_payment_oct2026.pdf.exe",
        "type": "FILE",
        "risk_score": 95,
        "risk_level": "CRITICAL",
        "verdict": "Disguised Executable Trojan",
        "timestamp": "2026-10-30T10:45:00Z",
    },
    {
        "id": "scan-5",
        "target": "cloudflare.com",
        "type": "URL",
        "risk_score": 0,
        "risk_level": "SAFE",
        "verdict": "Verified Infrastructure & CDN",
        "timestamp": "2026-10-30T10:50:00Z",
    },
]

REPORTED_THREATS = []


@router.get("/stats")
async def get_dashboard_stats():
    """Retrieve aggregate security statistics and system protection status."""
    return {
        "safety_index": 94,
        "total_scans_today": 1428,
        "threats_intercepted": 312,
        "phishing_campaigns_detected": 49,
        "malware_signatures_verified": 87,
        "extension_active_users": 6540,
        "system_status": "OPERATIONAL",
        "protection_status": "ACTIVE_DEFENSE",
        "threat_level": "ELEVATED",
    }


@router.get("/recent")
async def get_recent_activity():
    """Retrieve recent scan activity and threat detection logs."""
    return {"recent_scans": RECENT_SCANS}


@router.get("/threat-feed")
async def get_live_threat_feed():
    """Returns curated threat intelligence highlights for the community feed."""
    return {
        "active_campaigns": [
            {
                "title": "Banking KYC SMS Phishing Surge",
                "severity": "HIGH",
                "indicators": ["apk downloads", "fake sbi/hdfc domains", "urgent suspension claims"],
                "recommendation": "Never download APKs from SMS links. Banks do not send APK updates via SMS.",
            },
            {
                "title": "Crypto Airdrop Discord / Telegram Lures",
                "severity": "CRITICAL",
                "indicators": ["drainer contracts", "fake metamask popups", "typosquatted domains"],
                "recommendation": "Verify smart contract addresses and never sign permit messages on unknown dApps.",
            },
            {
                "title": "Fake Courier Delivery Fee Scams",
                "severity": "MODERATE",
                "indicators": ["payment of small fee ($1-$2)", "fake tracking portal"],
                "recommendation": "Check tracking directly on official courier website rather than notification links.",
            },
        ]
    }


@router.post("/report")
async def report_threat(payload: ThreatReportRequest):
    """Submit a threat URL or message for crowdsourced community protection."""
    report = {
        "id": f"rep-{len(REPORTED_THREATS) + 1}",
        "url": payload.url,
        "threat_type": payload.threat_type,
        "description": payload.description,
        "reported_at": datetime.now(timezone.utc).isoformat(),
        "status": "QUEUED_FOR_TRIAGE",
    }
    REPORTED_THREATS.append(report)
    return {"status": "SUCCESS", "message": "Threat report submitted successfully. Thank you for securing the community.", "report": report}
