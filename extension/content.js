/**
 * CYBERCORE Chrome Extension — Content Script
 * Injects security warning overlays and alerts on dangerous websites.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SHOW_THREAT_WARNING" && request.data) {
    showThreatBanner(request.data);
  }
});

function showThreatBanner(scanData) {
  // Prevent duplicate banners
  if (document.getElementById("cybercore-threat-banner")) return;

  const banner = document.createElement("div");
  banner.id = "cybercore-threat-banner";
  banner.style.cssText = `
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2147483647;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid rgba(239, 68, 68, 0.6);
    border-radius: 16px;
    padding: 14px 20px;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(239, 68, 68, 0.3);
    backdrop-filter: blur(12px);
    max-width: 650px;
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    animation: cybercoreSlideDown 0.3s ease-out;
  `;

  const keyframes = document.createElement("style");
  keyframes.innerHTML = `
    @keyframes cybercoreSlideDown {
      from { opacity: 0; transform: translate(-50%, -20px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
  `;
  document.head.appendChild(keyframes);

  const leftSection = document.createElement("div");
  leftSection.style.cssText = "display: flex; align-items: center; gap: 12px; flex: 1;";

  const icon = document.createElement("div");
  icon.innerHTML = "🚨";
  icon.style.cssText = "font-size: 20px; line-height: 1;";

  const textContainer = document.createElement("div");
  textContainer.innerHTML = `
    <div style="font-weight: 700; color: #f87171; margin-bottom: 2px;">
      CYBERCORE Warning: High Risk Website (Score: ${scanData.risk_score}/100)
    </div>
    <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
      This domain matches patterns for phishing, malware, or suspicious certificates. Do NOT enter passwords or financial information.
    </div>
  `;

  leftSection.appendChild(icon);
  leftSection.appendChild(textContainer);

  const actions = document.createElement("div");
  actions.style.cssText = "display: flex; align-items: center; gap: 8px; shrink: 0;";

  const leaveBtn = document.createElement("button");
  leaveBtn.textContent = "Leave Site";
  leaveBtn.style.cssText = `
    background: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  `;
  leaveBtn.onclick = () => {
    window.location.href = "about:blank";
  };

  const dismissBtn = document.createElement("button");
  dismissBtn.textContent = "✕";
  dismissBtn.style.cssText = `
    background: transparent;
    color: #64748b;
    border: none;
    font-size: 14px;
    padding: 4px 8px;
    cursor: pointer;
  `;
  dismissBtn.onclick = () => {
    banner.remove();
  };

  actions.appendChild(leaveBtn);
  actions.appendChild(dismissBtn);

  banner.appendChild(leftSection);
  banner.appendChild(actions);

  document.body.appendChild(banner);
}
