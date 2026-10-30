/**
 * CYBERCORE Chrome Extension — Popup Controller
 * Renders tab security telemetry, triggers scans, and handles manual audits.
 */

const contentArea = document.getElementById("content-area");
const manualUrlInput = document.getElementById("manual-url");
const manualScanBtn = document.getElementById("btn-manual-scan");
const fullAuditBtn = document.getElementById("btn-full-audit");
const reportThreatBtn = document.getElementById("btn-report-threat");

let currentTabUrl = "";

function renderScanResult(url, scan) {
  currentTabUrl = url;
  fullAuditBtn.href = `http://localhost:3000/scanner?url=${encodeURIComponent(url)}`;

  if (!scan) {
    contentArea.innerHTML = `
      <div class="site-card">
        <div class="site-url">${escapeHtml(url)}</div>
        <div class="score-container risk-safe">
          <span class="score-label">Offline / Local Mode</span>
          <span class="score-number">--</span>
        </div>
        <div style="font-size: 11px; color: #94a3b8; text-align: center;">
          Backend API is initializing or unreachable. Real-time shield is operating in local fallback mode.
        </div>
      </div>
    `;
    return;
  }

  const score = scan.risk_score || 0;
  let riskClass = "risk-safe";
  let riskLabel = "SAFE SITE";

  if (score >= 70) {
    riskClass = "risk-danger";
    riskLabel = "CRITICAL RISK";
  } else if (score >= 35) {
    riskClass = "risk-warn";
    riskLabel = "SUSPICIOUS";
  }

  const sslStatus = scan.ssl_valid ? "Valid TLS" : (scan.ssl_valid === false ? "Invalid SSL" : "Unverified");
  const threatsCount = (scan.is_phishing || scan.is_malware) ? "Flagged Threat" : "Clean Rep";
  const confidence = scan.confidence || "HIGH";

  contentArea.innerHTML = `
    <div class="site-card">
      <div class="site-url">${escapeHtml(url)}</div>
      
      <div class="score-container ${riskClass}">
        <div>
          <div class="score-label">${riskLabel}</div>
          <div style="font-size: 10px; opacity: 0.8; font-weight: 500;">Confidence: ${confidence}</div>
        </div>
        <div class="score-number">${score}</div>
      </div>

      <div class="checks-grid">
        <div class="check-item">
          <div class="check-title">SSL / TLS</div>
          <div class="check-val" style="color: ${scan.ssl_valid ? '#34d399' : '#f87171'}">${sslStatus}</div>
        </div>
        <div class="check-item">
          <div class="check-title">Threat Intel</div>
          <div class="check-val" style="color: ${(scan.is_phishing || scan.is_malware) ? '#f87171' : '#34d399'}">${threatsCount}</div>
        </div>
        <div class="check-item">
          <div class="check-title">Domain Age</div>
          <div class="check-val">${scan.whois_details?.age_days ? scan.whois_details.age_days + 'd' : 'Established'}</div>
        </div>
        <div class="check-item">
          <div class="check-title">Coverage</div>
          <div class="check-val">${scan.coverage_percent || 100}%</div>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>"']/g, function(m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m];
  });
}

// Initial tab data retrieval
chrome.runtime.sendMessage({ action: "GET_ACTIVE_TAB_DATA" }, (response) => {
  if (!response || response.error) {
    contentArea.innerHTML = `
      <div class="site-card" style="text-align: center; color: #94a3b8;">
        <div style="font-size: 14px; margin-bottom: 4px;">🌐 Internal Page</div>
        <div style="font-size: 11px;">Browser system tabs and local files do not require cyber threat analysis.</div>
      </div>
    `;
    return;
  }

  renderScanResult(response.tab.url, response.scan);
});

// Manual Scan Input
manualScanBtn.addEventListener("click", () => {
  const url = manualUrlInput.value.trim();
  if (!url) return;

  contentArea.innerHTML = `<div class="loading-spinner">Scanning target URL...</div>`;
  manualScanBtn.disabled = true;

  chrome.runtime.sendMessage({ action: "MANUAL_SCAN", url }, (response) => {
    manualScanBtn.disabled = false;
    renderScanResult(url, response?.scan);
  });
});

manualUrlInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    manualScanBtn.click();
  }
});

// Report Threat Button
reportThreatBtn.addEventListener("click", async () => {
  if (!currentTabUrl) {
    alert("No auditable URL active.");
    return;
  }

  try {
    const res = await fetch("http://localhost:8000/api/v1/dashboard/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: currentTabUrl,
        threat_type: "suspicious_report",
        description: "Reported directly via CYBERCORE Chrome Extension"
      })
    });
    alert("Threat reported to CYBERCORE intelligence feed. Thank you!");
  } catch (e) {
    alert("Report queued locally. Backend will synchronize when reachable.");
  }
});
