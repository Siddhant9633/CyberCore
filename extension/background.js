/**
 * CYBERCORE Chrome Extension — Background Service Worker (Manifest V3)
 * Handles tab navigation, real-time threat analysis, toolbar badge state, and caching.
 */

const API_BASE = "http://localhost:8000/api/v1";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

function isAuditableUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return "";
  }
}

// ─────────────────────────────────────────────────────────────
// Badge Management
// ─────────────────────────────────────────────────────────────

function updateBadge(tabId, score) {
  if (score === null || score === undefined) {
    chrome.action.setBadgeText({ tabId, text: "" });
    return;
  }

  let text = "";
  let color = "#10b981"; // Emerald safe

  if (score >= 70) {
    text = "!";
    color = "#ef4444"; // Red critical
  } else if (score >= 35) {
    text = String(score);
    color = "#f59e0b"; // Amber warning
  } else {
    text = "OK";
    color = "#10b981"; // Green safe
  }

  chrome.action.setBadgeText({ tabId, text });
  chrome.action.setBadgeBackgroundColor({ tabId, color });
}

// ─────────────────────────────────────────────────────────────
// Scan & Cache Engine
// ─────────────────────────────────────────────────────────────

async function getCachedScan(domain) {
  const key = `scan_${domain}`;
  const data = await chrome.storage.local.get([key]);
  const cached = data[key];

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.result;
  }
  return null;
}

async function setCachedScan(domain, result) {
  const key = `scan_${domain}`;
  await chrome.storage.local.set({
    [key]: {
      timestamp: Date.now(),
      result: result
    }
  });
}

async function scanUrlWithBackend(url) {
  try {
    const response = await fetch(`${API_BASE}/scan/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url, source: "extension" })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn("CYBERCORE backend scan error:", err);
    return null;
  }
}

async function analyzeTab(tabId, url) {
  if (!isAuditableUrl(url)) {
    updateBadge(tabId, null);
    return;
  }

  const domain = getDomain(url);
  if (!domain) return;

  // Check cache first
  let scanResult = await getCachedScan(domain);

  if (!scanResult) {
    // Show scanning state
    chrome.action.setBadgeText({ tabId, text: "..." });
    chrome.action.setBadgeBackgroundColor({ tabId, color: "#64748b" });

    scanResult = await scanUrlWithBackend(url);
    if (scanResult) {
      await setCachedScan(domain, scanResult);
    }
  }

  if (scanResult) {
    updateBadge(tabId, scanResult.risk_score);

    // If critical threat, notify content script to show banner
    if (scanResult.risk_score >= 70) {
      try {
        chrome.tabs.sendMessage(tabId, {
          action: "SHOW_THREAT_WARNING",
          data: scanResult
        });
      } catch (e) {
        // Tab may not have script injected yet
      }
    }
  } else {
    // Backend offline or unreachable
    updateBadge(tabId, null);
  }
}

// ─────────────────────────────────────────────────────────────
// Chrome Event Listeners
// ─────────────────────────────────────────────────────────────

// Navigation event
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    analyzeTab(tabId, tab.url);
  }
});

// Tab switch event
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url) {
      analyzeTab(activeInfo.tabId, tab.url);
    }
  } catch (e) {}
});

// Message listener from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_ACTIVE_TAB_DATA") {
    (async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.url || !isAuditableUrl(tab.url)) {
        sendResponse({ error: "Non-auditable page" });
        return;
      }

      const domain = getDomain(tab.url);
      let scanResult = await getCachedScan(domain);
      if (!scanResult) {
        scanResult = await scanUrlWithBackend(tab.url);
        if (scanResult) {
          await setCachedScan(domain, scanResult);
        }
      }

      sendResponse({ tab, scan: scanResult });
    })();
    return true; // Keep channel open for async response
  }

  if (request.action === "MANUAL_SCAN") {
    (async () => {
      const scanResult = await scanUrlWithBackend(request.url);
      sendResponse({ scan: scanResult });
    })();
    return true;
  }
});

console.log("CYBERCORE Background Agent initialized.");
