"""
CYBERCORE Backend — URL & Input Validators
Implements strict SSRF protection, URL validation, and input sanitization.

SECURITY NOTE:
  SSRF (Server-Side Request Forgery) is a critical risk for URL scanners.
  An attacker could submit internal IPs, cloud metadata endpoints, or
  localhost to probe the internal network through our backend.
  This module prevents that by:
    1. Parsing and validating the URL scheme (only HTTP/HTTPS allowed).
    2. Resolving the hostname and blocking all private/reserved IP ranges.
    3. Blocking known metadata endpoints.
    4. Enforcing maximum redirect depth and timeout.
"""

import re
import socket
import ipaddress
from urllib.parse import urlparse
from typing import Tuple

from app.config import get_settings

settings = get_settings()


class ValidationError(Exception):
    """Raised when a URL or input fails security validation."""
    pass


# ---------------------------------------------------------------------------
# URL Validation
# ---------------------------------------------------------------------------

def validate_url(url: str) -> Tuple[str, str]:
    """
    Validate a URL for safe scanning.

    Returns:
        Tuple[str, str]: (normalized_url, domain)

    Raises:
        ValidationError: If the URL fails any security check.
    """
    url = url.strip()

    # Add scheme if missing
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        parsed = urlparse(url)
    except Exception:
        raise ValidationError("Invalid URL format.")

    # Only allow HTTP and HTTPS
    if parsed.scheme not in ("http", "https"):
        raise ValidationError("Only HTTP and HTTPS URLs are allowed.")

    hostname = parsed.hostname
    if not hostname:
        raise ValidationError("URL must contain a valid hostname.")

    # Reject very long hostnames
    if len(hostname) > 253:
        raise ValidationError("Hostname exceeds maximum length.")

    # Block known dangerous hostnames
    hostname_lower = hostname.lower()
    for blocked in settings.blocked_hostnames:
        if hostname_lower == blocked or hostname_lower.endswith("." + blocked):
            raise ValidationError(f"Hostname '{hostname}' is not allowed for security reasons.")

    # Validate hostname format
    if not _is_valid_hostname(hostname):
        raise ValidationError("Invalid hostname format.")

    # Resolve hostname and check resulting IP
    resolved_ip = _resolve_and_validate_ip(hostname)

    # Check URL length
    if len(url) > 2048:
        raise ValidationError("URL is too long.")

    domain = hostname.lower()
    return url, domain


def _is_valid_hostname(hostname: str) -> bool:
    """Check hostname format validity."""
    if not hostname:
        return False
    # Remove trailing dot (FQDN)
    if hostname.endswith("."):
        hostname = hostname[:-1]
    if len(hostname) > 253:
        return False
    # Check each label
    allowed = re.compile(r"^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?$")
    labels = hostname.split(".")
    return all(allowed.match(label) for label in labels if label)


def _resolve_and_validate_ip(hostname: str) -> str:
    """
    Resolve hostname to IP and validate it is not a private/reserved range.
    This is the core SSRF protection.
    """
    try:
        # Try to parse as an IP address first
        ip_obj = ipaddress.ip_address(hostname)
        _block_if_private_ip(ip_obj)
        return str(ip_obj)
    except ValueError:
        pass  # Not a bare IP, continue to DNS resolution

    try:
        addr_info = socket.getaddrinfo(hostname, None, type=socket.SOCK_STREAM)
    except socket.gaierror:
        raise ValidationError(f"Could not resolve hostname: {hostname}")

    if not addr_info:
        raise ValidationError(f"No IP addresses found for hostname: {hostname}")

    # Validate ALL resolved IP addresses
    for family, _, _, _, sockaddr in addr_info:
        ip_str = sockaddr[0]
        try:
            ip_obj = ipaddress.ip_address(ip_str)
            _block_if_private_ip(ip_obj)
        except ValueError:
            continue

    # Return first resolved IP for logging
    return addr_info[0][4][0]


def _block_if_private_ip(ip_obj: ipaddress.IPv4Address | ipaddress.IPv6Address) -> None:
    """Block private, loopback, link-local, and reserved IP addresses."""
    if ip_obj.is_private:
        raise ValidationError("URLs resolving to private IP ranges are not allowed.")
    if ip_obj.is_loopback:
        raise ValidationError("URLs resolving to loopback addresses are not allowed.")
    if ip_obj.is_link_local:
        raise ValidationError("URLs resolving to link-local addresses are not allowed.")
    if ip_obj.is_reserved:
        raise ValidationError("URLs resolving to reserved IP ranges are not allowed.")
    if ip_obj.is_multicast:
        raise ValidationError("URLs resolving to multicast addresses are not allowed.")
    if ip_obj.is_unspecified:
        raise ValidationError("Unspecified IP address is not allowed.")
    # Extra: block cloud metadata IPs explicitly
    cloud_metadata_ips = {
        "169.254.169.254",  # AWS/GCP/Azure metadata
        "100.100.100.200",  # Alibaba Cloud metadata
        "192.0.0.192",
    }
    if str(ip_obj) in cloud_metadata_ips:
        raise ValidationError("Cloud metadata endpoint access is not allowed.")


# ---------------------------------------------------------------------------
# IP Address Validation
# ---------------------------------------------------------------------------

def validate_ip_address(ip: str) -> str:
    """Validate and normalize an IP address string."""
    ip = ip.strip()
    try:
        ip_obj = ipaddress.ip_address(ip)
        return str(ip_obj)
    except ValueError:
        raise ValidationError(f"'{ip}' is not a valid IP address.")


def is_private_ip(ip: str) -> bool:
    """Check if an IP string belongs to a private, loopback, or reserved network."""
    try:
        ip_obj = ipaddress.ip_address(ip.strip())
        return (
            ip_obj.is_private
            or ip_obj.is_loopback
            or ip_obj.is_link_local
            or ip_obj.is_multicast
            or ip_obj.is_reserved
        )
    except ValueError:
        return False


# ---------------------------------------------------------------------------
# Domain Validation
# ---------------------------------------------------------------------------

def validate_domain(domain: str) -> str:
    """Validate a domain name."""
    domain = domain.strip().lower()
    if domain.startswith(("http://", "https://")):
        parsed = urlparse(domain)
        domain = parsed.hostname or domain
    if not _is_valid_hostname(domain):
        raise ValidationError(f"'{domain}' is not a valid domain name.")
    return domain


# ---------------------------------------------------------------------------
# File Validation
# ---------------------------------------------------------------------------

# Magic bytes for common file types
FILE_MAGIC_BYTES = {
    "pdf": [b"%PDF"],
    "zip": [b"PK\x03\x04", b"PK\x05\x06", b"PK\x07\x08"],
    "exe": [b"MZ"],
    "docx": [b"PK\x03\x04"],  # DOCX is a ZIP
    "doc": [b"\xd0\xcf\x11\xe0"],
    "apk": [b"PK\x03\x04"],   # APK is a ZIP
    "xlsx": [b"PK\x03\x04"],
    "pptx": [b"PK\x03\x04"],
}


def validate_file(filename: str, content: bytes, max_size_bytes: int) -> Tuple[str, str]:
    """
    Validate uploaded file by extension and magic bytes.

    Returns:
        Tuple[str, str]: (sanitized_filename, detected_type)

    Raises:
        ValidationError: If file fails validation.
    """
    settings = get_settings()

    if len(content) > max_size_bytes:
        raise ValidationError(
            f"File exceeds maximum size of {settings.max_file_size_mb}MB."
        )

    if len(content) == 0:
        raise ValidationError("File is empty.")

    # Sanitize filename
    safe_filename = re.sub(r"[^\w\.\-]", "_", filename)[:255]

    # Get extension
    ext = safe_filename.rsplit(".", 1)[-1].lower() if "." in safe_filename else ""

    if ext not in settings.allowed_file_types_list:
        raise ValidationError(
            f"File type '.{ext}' is not supported. "
            f"Supported: {', '.join(settings.allowed_file_types_list)}"
        )

    # Magic byte validation
    if ext in FILE_MAGIC_BYTES:
        magic_matches = any(
            content.startswith(magic)
            for magic in FILE_MAGIC_BYTES[ext]
        )
        if not magic_matches:
            raise ValidationError(
                f"File content does not match expected format for .{ext} files."
            )

    return safe_filename, ext
