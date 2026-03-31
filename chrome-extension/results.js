let tableData = null;

// Load result from storage
chrome.storage.local.get("conversionResult", (result) => {
  const data = result.conversionResult;
  if (!data) return;
  handleResult(data);
});

// Listen for updates (result arrives after page opens)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.conversionResult) {
    handleResult(changes.conversionResult.newValue);
  }
});

function handleResult(result) {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const results = document.getElementById("results");

  if (result.status === "pending") {
    loading.classList.remove("hidden");
    error.classList.add("hidden");
    results.classList.add("hidden");
    return;
  }

  if (result.status === "error") {
    loading.classList.add("hidden");
    error.classList.remove("hidden");
    results.classList.add("hidden");
    document.getElementById("error-message").textContent = result.error;
    return;
  }

  if (result.status === "done" && result.data) {
    loading.classList.add("hidden");
    error.classList.add("hidden");
    results.classList.remove("hidden");
    tableData = result.data;
    renderTable(result.data);
  }
}

function renderTable(data) {
  const container = document.getElementById("table-container");

  let html = "<table><thead><tr>";
  data.headers.forEach((h) => {
    html += `<th>${escapeHtml(h)}</th>`;
  });
  html += "</tr></thead><tbody>";

  data.rows.forEach((row) => {
    html += "<tr>";
    row.forEach((cell) => {
      html += `<td>${escapeHtml(cell)}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// --- Export ---

document.getElementById("btn-copy").addEventListener("click", () => {
  if (!tableData) return;
  const tsv = [
    tableData.headers.join("\t"),
    ...tableData.rows.map((r) => r.join("\t")),
  ].join("\n");
  navigator.clipboard.writeText(tsv).then(() => showToast("Copied to clipboard"));
});

document.getElementById("btn-csv").addEventListener("click", () => {
  if (!tableData) return;
  const header = tableData.headers.map(escapeCsv).join(",");
  const rows = tableData.rows.map((r) => r.map(escapeCsv).join(","));
  const csv = [header, ...rows].join("\n");
  downloadBlob(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    "imgtosheet-export.csv"
  );
});

document.getElementById("btn-xlsx").addEventListener("click", () => {
  if (!tableData || typeof XLSX === "undefined") return;
  const ws = XLSX.utils.aoa_to_sheet([tableData.headers, ...tableData.rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "imgtosheet-export.xlsx"
  );
});

function escapeCsv(cell) {
  if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
    return '"' + cell.replace(/"/g, '""') + '"';
  }
  return cell;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}
