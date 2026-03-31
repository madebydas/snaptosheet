// Prevent multiple injections
if (!window.__imgtosheet_injected) {
  window.__imgtosheet_injected = true;

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === "fetchImage") {
      fetchImageAsBase64(msg.url).then(
        (data) => sendResponse({ data }),
        (err) => sendResponse({ error: err.message })
      );
      return true; // async response
    }

    if (msg.action === "startSelection") {
      startAreaSelection();
      sendResponse({ ok: true });
    }

    if (msg.action === "cropImage") {
      cropImage(msg.dataUrl, msg.rect, msg.devicePixelRatio).then(
        (data) => sendResponse({ data }),
        (err) => sendResponse({ error: err.message })
      );
      return true; // async response
    }
  });
}

// --- Image fetching ---

async function fetchImageAsBase64(url) {
  try {
    // Try fetching from page context (has cookies/origin)
    const response = await fetch(url);
    const blob = await response.blob();
    return await blobToBase64(blob);
  } catch {
    // Return null — background.js will retry from service worker
    return null;
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      resolve(dataUrl.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// --- Area selection ---

function startAreaSelection() {
  // Remove any existing overlay
  cleanup();

  const overlay = document.createElement("div");
  overlay.id = "__imgtosheet_overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "2147483647",
    cursor: "crosshair",
    background: "rgba(0, 0, 0, 0.15)",
  });

  const selectionBox = document.createElement("div");
  selectionBox.id = "__imgtosheet_selection";
  Object.assign(selectionBox.style, {
    position: "fixed",
    border: "2px dashed #16A34A",
    background: "rgba(22, 163, 74, 0.08)",
    zIndex: "2147483647",
    pointerEvents: "none",
    display: "none",
  });

  const hint = document.createElement("div");
  hint.id = "__imgtosheet_hint";
  Object.assign(hint.style, {
    position: "fixed",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "2147483647",
    background: "#111",
    color: "#fff",
    padding: "8px 16px",
    fontSize: "13px",
    fontFamily: "system-ui, sans-serif",
    borderRadius: "4px",
  });
  hint.textContent = "Draw a rectangle around the table — press Esc to cancel";

  document.body.appendChild(overlay);
  document.body.appendChild(selectionBox);
  document.body.appendChild(hint);

  let startX = 0, startY = 0, drawing = false;

  function onMouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;
    drawing = true;
    selectionBox.style.display = "block";
    selectionBox.style.left = startX + "px";
    selectionBox.style.top = startY + "px";
    selectionBox.style.width = "0px";
    selectionBox.style.height = "0px";
  }

  function onMouseMove(e) {
    if (!drawing) return;
    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);
    selectionBox.style.left = x + "px";
    selectionBox.style.top = y + "px";
    selectionBox.style.width = w + "px";
    selectionBox.style.height = h + "px";
  }

  function onMouseUp(e) {
    if (!drawing) return;
    drawing = false;

    const x = Math.min(e.clientX, startX);
    const y = Math.min(e.clientY, startY);
    const w = Math.abs(e.clientX - startX);
    const h = Math.abs(e.clientY - startY);

    cleanup();

    // Minimum selection size
    if (w < 20 || h < 20) return;

    // Wait one frame for overlay to be removed before capture
    requestAnimationFrame(() => {
      chrome.runtime.sendMessage({
        action: "areaSelected",
        rect: { x, y, width: w, height: h },
        devicePixelRatio: window.devicePixelRatio || 1,
      });
    });
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      cleanup();
    }
  }

  overlay.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("keydown", onKeyDown);

  // Store cleanup refs
  window.__imgtosheet_cleanup = () => {
    overlay.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("keydown", onKeyDown);
    overlay.remove();
    selectionBox.remove();
    hint.remove();
  };
}

function cleanup() {
  if (window.__imgtosheet_cleanup) {
    window.__imgtosheet_cleanup();
    window.__imgtosheet_cleanup = null;
  }
  // Safety cleanup
  ["__imgtosheet_overlay", "__imgtosheet_selection", "__imgtosheet_hint"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

// --- Image cropping ---

async function cropImage(dataUrl, rect, dpr) {
  const img = new Image();
  img.src = dataUrl;
  await new Promise((resolve) => { img.onload = resolve; });

  const canvas = document.createElement("canvas");
  const sx = Math.round(rect.x * dpr);
  const sy = Math.round(rect.y * dpr);
  const sw = Math.round(rect.width * dpr);
  const sh = Math.round(rect.height * dpr);

  canvas.width = sw;
  canvas.height = sh;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

  const croppedDataUrl = canvas.toDataURL("image/png");
  return croppedDataUrl.split(",")[1];
}
