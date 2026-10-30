"""
CYBERCORE Backend — IP & Domain Intelligence Router

Provides detailed inspection for IP addresses and domain names:
  - DNS resolution (A, AAAA, MX, NS, TXT)
  - RDAP registration data (age, registrar, status)
  - Reverse DNS (PTR)
  - Security reputation & risk assessment
"""

import logging
import socket
import ipaddress
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

from app.services.dns_analyzer import analyze_dns, get_domain_rdap, build_domain_reputation_score
from app.utils.validators import validate_domain, is_private_ip, ValidationError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ip-domain", tags=["IP & Domain Intelligence"])


class IpDomainRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=253, description="IP address or domain name")


def is_valid_ip(val: str) -> bool:
    try:
        ipaddress.ip_address(val)
        return True
    except ValueError:
        return False


@router.post("/analyze")
async def analyze_ip_or_domain(payload: IpDomainRequest):
    """Analyze an IP address or domain name."""
    query = payload.query.strip().lower()
    return await _process_query(query)


@router.get("/{query:path}")
async def get_ip_or_domain(query: str):
    """Retrieve intelligence for a given IP or domain."""
    return await _process_query(query.strip().lower())


async def _process_query(target: str) -> dict:
    if not target:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query target cannot be empty."
        )

    # Strip scheme if accidentally pasted (e.g. https://example.com/path -> example.com)
    if "://" in target:
        target = target.split("://", 1)[1]
    if "/" in target:
        target = target.split("/", 1)[0]
    if ":" in target and not is_valid_ip(target):
        target = target.split(":", 1)[0]

    if is_valid_ip(target):
        # Handle IP Address
        ip_obj = ipaddress.ip_address(target)
        if ip_obj.is_private or ip_obj.is_loopback or ip_obj.is_link_local or ip_obj.is_reserved:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Security restriction: {target} is a private, loopback, or reserved IP address."
            )

        # Reverse DNS lookup
        hostname = None
        try:
            hostname, _, _ = socket.gethostbyaddr(target)
        except (socket.herror, socket.gaierror, OSError):
            hostname = None

        return {
            "type": "ip",
            "target": target,
            "ip_version": ip_obj.version,
            "is_global": ip_obj.is_global,
            "reverse_dns": hostname,
            "dns": {
                "ptr": hostname or "No PTR record found",
            },
            "reputation": {
                "risk_score": 10 if hostname else 25,
                "verdict": "BENIGN" if hostname else "UNKNOWN_HOST",
                "notes": ["Public routable IP address", f"Reverse DNS: {hostname or 'Not configured'}"]
            }
        }
    else:
        # Handle Domain
        try:
            clean_domain = validate_domain(target)
        except ValidationError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

        # Run DNS and RDAP concurrently
        dns_data = await analyze_dns(clean_domain)
        rdap_data = await get_domain_rdap(clean_domain)
        reputation = await build_domain_reputation_score(clean_domain, rdap_data)

        # Calculate high-level domain score
        risk_score = reputation.score
        if not dns_data.get("a_records"):
            risk_score = max(risk_score, 45)  # Domain doesn't resolve to any IP

        return {
            "type": "domain",
            "target": clean_domain,
            "dns": dns_data,
            "registration": rdap_data,
            "reputation": {
                "score": risk_score,
                "confidence": reputation.confidence.value if hasattr(reputation.confidence, "value") else str(reputation.confidence),
                "findings": reputation.findings,
            }
        }
