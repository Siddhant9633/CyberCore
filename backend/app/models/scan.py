"""
CYBERCORE Backend — Pydantic Models for URL Scanning API
"""

from typing import Optional, Any
from pydantic import BaseModel, HttpUrl, field_validator
import re


class ScanRequest(BaseModel):
    url: str
    source: str = "web"  # 'web' | 'extension'

    @field_validator("url")
    @classmethod
    def validate_url_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("URL cannot be empty")
        if len(v) > 2048:
            raise ValueError("URL is too long")
        return v

    @field_validator("source")
    @classmethod
    def validate_source(cls, v: str) -> str:
        allowed = {"web", "extension"}
        if v not in allowed:
            raise ValueError(f"source must be one of: {allowed}")
        return v


class ComponentResult(BaseModel):
    score: Optional[int]
    confidence: str
    finding_type: str
    details: dict
    evidence: list


class ScanResponse(BaseModel):
    scan_id: str
    url: str
    domain: str
    risk_score: int
    risk_category: str
    confidence: str
    coverage_percent: int
    is_phishing: Optional[bool]
    is_malware: Optional[bool]
    ssl_valid: Optional[bool]
    components: dict[str, ComponentResult]
    unavailable_checks: list[str]
    dns_details: dict
    whois_details: dict
    source: str
    scanned_at: str
    scan_duration_ms: int
    recommended_actions: list[str]


class ThreatReportRequest(BaseModel):
    url: str
    threat_type: str
    description: Optional[str] = None

    @field_validator("threat_type")
    @classmethod
    def validate_threat_type(cls, v: str) -> str:
        allowed = {
            "phishing", "malware", "scam", "fraud",
            "fake_login", "brand_impersonation", "other"
        }
        if v not in allowed:
            raise ValueError(f"threat_type must be one of: {allowed}")
        return v
