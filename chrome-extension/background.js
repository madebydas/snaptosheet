const API_URL = "https://imgtosheet.com/.netlify/functions/convert";

// Register context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convert-image",
    title: "Convert to spreadsheet with imgtosheet",
    contexts: ["image"],
  });
});

// Right-click image handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "convert-image" || !info.srcUrl || !tab?.id) return;

  await showResults({ status: "pending" });

  try {
    // Inject content script and fetch image
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    const base64 = await sendToContentScript(tab.id, {
      action: "fetchImage",
      url: info.srcUrl,
    });

    if (!base64) {
      // Fallback: fetch from service worker (no CORS restrictions)
      const response = await fetch(info.srcUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      const imageBase64 = dataUrl.split(",")[1];
      const data = await callConvertApi(imageBase64, "image.png");
      await showResults({ status: "done", data });
      return;
    }

    const data = await callConvertApi(base64, "image.png");
    await showResults({ status: "done", data });
  } catch (err) {
    await showResults({ status: "error", error: err.message || "Conversion failed" });
  }
});

// Click extension icon → screenshot selection
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    });

    chrome.tabs.sendMessage(tab.id, { action: "startSelection" });
  } catch (err) {
    console.error("Failed to inject content script:", err);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "areaSelected" && sender.tab?.id) {
    handleAreaCapture(sender.tab, msg.rect, msg.devicePixelRatio);
    sendResponse({ ok: true });
  }
  return true;
});

async function handleAreaCapture(tab, rect, dpr) {
  try {
    // Capture BEFORE opening results tab
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: "png",
    });

    // Crop BEFORE opening results tab
    const croppedBase64 = await sendToContentScript(tab.id, {
      action: "cropImage",
      dataUrl,
      rect,
      devicePixelRatio: dpr,
    });

    // Now open results tab with pending state
    await showResults({ status: "pending" });

    const data = await callConvertApi(croppedBase64, "screenshot.png");
    await showResults({ status: "done", data });
  } catch (err) {
    await showResults({
      status: "error",
      error: err.message || "Screenshot failed",
    });
  }
}

async function callConvertApi(imageBase64, fileName) {
  const base64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  // Check size before sending
  const sizeBytes = Math.ceil(base64.length * 3 / 4);
  if (sizeBytes > 4 * 1024 * 1024) {
    throw new Error("Image too large (max 4MB). Try selecting a smaller area.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64: base64, fileName }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Conversion failed");
  }
  return result.data;
}

function sendToContentScript(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (response?.error) {
        reject(new Error(response.error));
        return;
      }
      resolve(response?.data);
    });
  });
}

async function showResults(result) {
  await chrome.storage.local.set({
    conversionResult: { ...result, timestamp: Date.now() },
  });

  // Only open new tab if status is pending (first call) or if no results tab exists
  if (result.status === "pending") {
    chrome.tabs.create({ url: chrome.runtime.getURL("results.html") });
  }
}
