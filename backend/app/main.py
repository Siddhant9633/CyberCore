"""
CYBERCORE Backend — Main Application Entry Point

Sets up FastAPI with:
  - CORS middleware
  - Rate limiting (slowapi)
  - Security headers middleware
  - All routers
  - Global error handlers
"""

import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.config import get_settings
from app.routers import scan, password, messages, ip_domain, files, ai_chat, dashboard

settings = get_settings()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────
# Rate Limiter
# ─────────────────────────────────────────────────────────────
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{settings.rate_limit_per_minute}/minute"],
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("CYBERCORE backend starting up...")
    logger.info("Environment: %s", settings.app_env)
    logger.info("VirusTotal: %s", "configured" if settings.virustotal_api_key else "NOT configured")
    logger.info("Google Safe Browsing: %s", "configured" if settings.google_safe_browsing_api_key else "NOT configured")
    logger.info("AI Provider: %s (%s)", settings.ai_provider, settings.ai_model)
    yield
    logger.info("CYBERCORE backend shutting down...")


# ─────────────────────────────────────────────────────────────
# FastAPI Application
# ─────────────────────────────────────────────────────────────
app = FastAPI(
    title="CYBERCORE API",
    description="AI-Powered Cybersecurity Platform — Backend API",
    version="1.0.0",
    docs_url="/api/docs" if settings.app_env == "development" else None,
    redoc_url="/api/redoc" if settings.app_env == "development" else None,
    lifespan=lifespan,
)

# ─────────────────────────────────────────────────────────────
# Middleware
# ─────────────────────────────────────────────────────────────

# CORS — allow web app, local dev ports, and Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^(https?://(localhost|127\.0\.0\.1)(:\d+)?|chrome-extension://.*)$",
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Rate limiting middleware
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses."""
    start_time = time.time()
    response = await call_next(request)

    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

    # Remove server identification
    if "server" in response.headers:
        del response.headers["server"]

    # Request timing
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.3f}"

    return response


# ─────────────────────────────────────────────────────────────
# Routers
# ─────────────────────────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(scan.router, prefix=API_PREFIX)
app.include_router(password.router, prefix=API_PREFIX)
app.include_router(messages.router, prefix=API_PREFIX)
app.include_router(ip_domain.router, prefix=API_PREFIX)
app.include_router(files.router, prefix=API_PREFIX)
app.include_router(ai_chat.router, prefix=API_PREFIX)
app.include_router(dashboard.router, prefix=API_PREFIX)


# ─────────────────────────────────────────────────────────────
# Global Exception Handler
# ─────────────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s %s — %s", request.method, request.url, str(exc), exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal error occurred. Please try again."},
    )


# ─────────────────────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": "CYBERCORE API",
        "version": "1.0.0",
        "environment": settings.app_env,
        "api_keys": {
            "virustotal": bool(settings.virustotal_api_key),
            "google_safe_browsing": bool(settings.google_safe_browsing_api_key),
            "ai": bool(settings.openai_api_key or settings.gemini_api_key),
        },
    }


@app.get("/", tags=["Root"])
async def root():
    return {"message": "CYBERCORE API — see /api/docs for documentation"}
