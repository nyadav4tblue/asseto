const loginScreen = document.getElementById("loginScreen");
const appWorkspace = document.getElementById("appWorkspace");
const loginForm = document.getElementById("loginForm");
const loginUser = document.getElementById("loginUser");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const logoutButton = document.getElementById("logoutButton");
const showFormView = document.getElementById("showFormView");
const showPreviewView = document.getElementById("showPreviewView");

const certificateDate = document.getElementById("certificateDate");
const appraiserCertDate = document.getElementById("appraiserCertDate");
const bankName = document.getElementById("bankName");
const branchName = document.getElementById("branchName");
const loanAccount = document.getElementById("loanAccount");
const ledgerFolio = document.getElementById("ledgerFolio");
const appraiserAddress = document.getElementById("appraiserAddress");
const placeName = document.getElementById("placeName");
const customerName = document.getElementById("customerName");
const customerAddress = document.getElementById("customerAddress");
const inputRate18 = document.getElementById("inputRate18");
const inputRate22 = document.getElementById("inputRate22");
const inputRate24 = document.getElementById("inputRate24");
const addItemButton = document.getElementById("addItemButton");
const itemEditorList = document.getElementById("itemEditorList");
const collapsibleSections = document.querySelectorAll("[data-collapsible]");
const previewPrintButton = document.getElementById("previewPrintButton");
const previewPdfButton = document.getElementById("previewPdfButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const panelResizer = document.getElementById("panelResizer");
const workspace = document.getElementById("appWorkspace");
const certificateSheet = document.querySelector(".certificate-sheet");

const AUTH_STORAGE_KEY = "gold-loan-authenticated";
const AUTH_USER = "admin";
const AUTH_PASSWORD = "gold123";
const MOBILE_BREAKPOINT = 760;

const documentDate = document.getElementById("documentDate");
const previewLoanAccount = document.getElementById("previewLoanAccount");
const previewLedgerFolio = document.getElementById("previewLedgerFolio");
const previewAppraiserAddress = document.getElementById("previewAppraiserAddress");
const previewAppraiserCertDate = document.getElementById("previewAppraiserCertDate");
const previewBankName = document.getElementById("previewBankName");
const previewBranchName = document.getElementById("previewBranchName");
const previewCertificateInlineDate = document.getElementById(
  "previewCertificateInlineDate"
);
const previewPlace = document.getElementById("previewPlace");
const previewBottomDate = document.getElementById("previewBottomDate");
const previewCustomerName = document.getElementById("previewCustomerName");
const previewCustomerAddress = document.getElementById("previewCustomerAddress");
const rate18 = document.getElementById("rate18");
const rate22 = document.getElementById("rate22");
const rate24 = document.getElementById("rate24");
const valuationTableBody = document.getElementById("valuationTableBody");
const totalGrossWeight = document.getElementById("totalGrossWeight");
const totalStoneWeight = document.getElementById("totalStoneWeight");
const totalNetWeight = document.getElementById("totalNetWeight");
const totalMarketValue = document.getElementById("totalMarketValue");

const today = new Date();
const isoToday = today.toISOString().split("T")[0];

certificateDate.value = isoToday;
appraiserCertDate.value = "";

let items = [];

function formatDate(value) {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function formatRate(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatWeight(value) {
  return Number(value || 0).toFixed(3);
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function getRateByPurity(purity) {
  if (purity === "18K") {
    return Number(inputRate18.value || 0);
  }

  if (purity === "22K") {
    return Number(inputRate22.value || 0);
  }

  return Number(inputRate24.value || 0);
}

function normalizeItem(item) {
  const grossWeight = Number(item.grossWeight || 0);
  const stoneWeight = Number(item.stoneWeight || 0);
  const netWeight = Math.max(grossWeight - stoneWeight, 0);
  const marketValue = Math.round(netWeight * getRateByPurity(item.purity));

  return {
    ...item,
    grossWeight,
    stoneWeight,
    netWeight,
    marketValue,
  };
}

function syncPreview() {
  const formattedCertificateDate = formatDate(certificateDate.value);

  documentDate.textContent = formattedCertificateDate;
  previewCertificateInlineDate.textContent = formattedCertificateDate;
  previewBottomDate.textContent = formattedCertificateDate;
  previewAppraiserCertDate.textContent = formatDate(appraiserCertDate.value);
  previewBankName.textContent = bankName.value || "Bank Name";
  previewBranchName.textContent = branchName.value || "Branch";
  previewLoanAccount.textContent = loanAccount.value || "Loan Account";
  previewLedgerFolio.textContent = ledgerFolio.value || "Ledger Folio";
  previewAppraiserAddress.textContent =
    appraiserAddress.value || "Appraiser address";
  previewPlace.textContent = placeName.value || "Place";
  previewCustomerName.textContent = customerName.value || "Customer Name";
  previewCustomerAddress.textContent =
    customerAddress.value || "Customer Address";
  rate18.innerHTML = `<strong>18K</strong> - ${formatRate(inputRate18.value)}`;
  rate22.innerHTML = `<strong>22K</strong> - ${formatRate(inputRate22.value)}`;
  rate24.innerHTML = `<strong>24K</strong> - ${formatRate(inputRate24.value)}`;
}

function showWorkspace() {
  loginScreen.classList.add("is-hidden");
  appWorkspace.classList.remove("is-hidden");
}

function showLogin() {
  appWorkspace.classList.add("is-hidden");
  loginScreen.classList.remove("is-hidden");
}

function setAuthenticated(value) {
  if (value) {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    showWorkspace();
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  showLogin();
}

function setMobileView(mode) {
  workspace.classList.remove("mobile-form-only", "mobile-preview-only");

  if (window.innerWidth > MOBILE_BREAKPOINT) {
    showFormView.classList.remove("is-active");
    showPreviewView.classList.remove("is-active");
    return;
  }

  if (mode === "preview") {
    workspace.classList.add("mobile-preview-only");
    showPreviewView.classList.add("is-active");
    showFormView.classList.remove("is-active");
    return;
  }

  workspace.classList.add("mobile-form-only");
  showFormView.classList.add("is-active");
  showPreviewView.classList.remove("is-active");
}

function isMobileView() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function renderItems() {
  renderItemEditors();
  renderCertificateRows();
  syncTotals();
}

function renderItemEditors() {
  itemEditorList.innerHTML = items
    .map((item, index) => {
      return `
        <div class="item-editor-card">
          <div class="item-card-head">
            <strong>Item ${index + 1}</strong>
            <button class="row-delete" data-id="${item.id}" type="button">Delete</button>
          </div>
          <div class="item-card-grid">
            <label class="wide">
              Description
              <input class="item-form-input" data-field="description" data-id="${item.id}" type="text" value="${item.description}" />
            </label>
            <label>
              Gross Weight
              <input class="item-form-input" data-field="grossWeight" data-id="${item.id}" type="number" step="0.001" value="${formatWeight(item.grossWeight)}" />
            </label>
            <label>
              Stone Weight
              <input class="item-form-input" data-field="stoneWeight" data-id="${item.id}" type="number" step="0.001" value="${formatWeight(item.stoneWeight)}" />
            </label>
            <label>
              Purity
              <select class="item-form-input" data-field="purity" data-id="${item.id}">
                <option value="18K" ${item.purity === "18K" ? "selected" : ""}>18K</option>
                <option value="22K" ${item.purity === "22K" ? "selected" : ""}>22K</option>
                <option value="24K" ${item.purity === "24K" ? "selected" : ""}>24K</option>
              </select>
            </label>
            <label>
              Net Weight
              <div class="readonly-field">${formatWeight(item.netWeight)}</div>
            </label>
            <label>
              Market Value
              <div class="readonly-field">${formatMoney(item.marketValue)}</div>
            </label>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderCertificateRows() {
  const rowsMarkup = items
    .map((item, index) => {
      return `
        <tr data-id="${item.id}">
          <td>${index + 1}</td>
          <td>${item.description}</td>
          <td>${formatWeight(item.grossWeight)}</td>
          <td>${formatWeight(item.stoneWeight)}</td>
          <td>${item.purity}</td>
          <td>${formatWeight(item.netWeight)}</td>
          <td class="market-value-cell">${formatMoney(item.marketValue)}</td>
        </tr>
      `;
    })
    .join("");

  const totalRow = valuationTableBody.querySelector(".total-row");
  valuationTableBody.innerHTML = rowsMarkup;
  valuationTableBody.appendChild(totalRow);
}

function syncTotals() {
  const totals = items.reduce(
    (accumulator, item) => {
      accumulator.grossWeight += Number(item.grossWeight || 0);
      accumulator.stoneWeight += Number(item.stoneWeight || 0);
      accumulator.netWeight += Number(item.netWeight || 0);
      accumulator.marketValue += Number(item.marketValue || 0);
      return accumulator;
    },
    { grossWeight: 0, stoneWeight: 0, netWeight: 0, marketValue: 0 }
  );

  totalGrossWeight.textContent = formatWeight(totals.grossWeight);
  totalStoneWeight.textContent = formatWeight(totals.stoneWeight);
  totalNetWeight.textContent = formatWeight(totals.netWeight);
  totalMarketValue.textContent = formatMoney(totals.marketValue);
}

function updateItem(itemId, field, value, shouldRerenderEditors = false) {
  items = items.map((item) => {
    if (item.id !== itemId) {
      return item;
    }

    const nextValue =
      field === "description" || field === "purity" ? value : Number(value || 0);

    return normalizeItem({
      ...item,
      [field]: nextValue,
    });
  });

  if (shouldRerenderEditors) {
    renderItemEditors();
  }

  renderCertificateRows();
  syncTotals();
}

function addItem() {
  items.push({
    id: Date.now(),
    description: "New Item",
    grossWeight: 0,
    stoneWeight: 0,
    purity: "22K",
    netWeight: 0,
    marketValue: 0,
  });

  items = items.map(normalizeItem);
  renderItems();
}

function deleteItem(itemId) {
  items = items.filter((item) => item.id !== itemId);
  renderItems();
}

[
  certificateDate,
  appraiserCertDate,
  bankName,
  branchName,
  loanAccount,
  ledgerFolio,
  appraiserAddress,
  placeName,
  customerName,
  customerAddress,
  inputRate18,
  inputRate22,
  inputRate24,
].forEach((field) => {
  field.addEventListener("input", syncPreview);
});

[inputRate18, inputRate22, inputRate24].forEach((field) => {
  field.addEventListener("input", () => {
    items = items.map(normalizeItem);
    syncPreview();
    renderItems();
  });
});

addItemButton.addEventListener("click", addItem);

itemEditorList.addEventListener("input", (event) => {
  const target = event.target;
  const itemId = Number(target.dataset.id);
  const field = target.dataset.field;

  if (!itemId || !field) {
    return;
  }

  updateItem(itemId, field, target.value);

  const item = items.find((entry) => entry.id === itemId);
  const card = target.closest(".item-editor-card");

  if (!item || !card) {
    return;
  }

  const readonlyFields = card.querySelectorAll(".readonly-field");

  if (readonlyFields[0]) {
    readonlyFields[0].textContent = formatWeight(item.netWeight);
  }

  if (readonlyFields[1]) {
    readonlyFields[1].textContent = formatMoney(item.marketValue);
  }
});

itemEditorList.addEventListener("change", (event) => {
  const target = event.target;
  const itemId = Number(target.dataset.id);
  const field = target.dataset.field;

  if (!itemId || !field) {
    return;
  }

  updateItem(itemId, field, target.value, true);
});

itemEditorList.addEventListener("click", (event) => {
  const target = event.target;

  if (!target.classList.contains("row-delete")) {
    return;
  }

  deleteItem(Number(target.dataset.id));
});

collapsibleSections.forEach((section) => {
  const toggle = section.querySelector(".section-toggle");
  const content = section.querySelector(".section-content");

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    content.classList.toggle("is-collapsed", expanded);
  });
});

previewPrintButton.addEventListener("click", () => {
  window.print();
});

previewPdfButton.addEventListener("click", () => {
  window.print();
});

fullscreenButton.addEventListener("click", async () => {
  const isFullscreen =
    document.fullscreenElement === certificateSheet ||
    certificateSheet.classList.contains("is-fullscreen");

  if (isFullscreen) {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    certificateSheet.classList.remove("is-fullscreen");
    return;
  }

  certificateSheet.classList.add("is-fullscreen");

  if (isMobileView()) {
    return;
  }

  if (certificateSheet.requestFullscreen) {
    try {
      await certificateSheet.requestFullscreen();
    } catch (error) {
      // Fall back to CSS-only fullscreen if the browser blocks the API.
    }
  }
});

document.addEventListener("fullscreenchange", () => {
  const isFullscreen = document.fullscreenElement === certificateSheet;

  if (!isFullscreen) {
    certificateSheet.classList.remove("is-fullscreen");
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isValid =
    loginUser.value.trim() === AUTH_USER &&
    loginPassword.value === AUTH_PASSWORD;

  if (!isValid) {
    loginError.hidden = false;
    loginPassword.select();
    return;
  }

  loginError.hidden = true;
  loginForm.reset();
  setAuthenticated(true);
});

[loginUser, loginPassword].forEach((field) => {
  field.addEventListener("input", () => {
    loginError.hidden = true;
  });
});

logoutButton.addEventListener("click", () => {
  setAuthenticated(false);
  loginForm.reset();
  loginError.hidden = true;
});

showFormView.addEventListener("click", () => {
  setMobileView("form");
});

showPreviewView.addEventListener("click", () => {
  setMobileView("preview");
});

let isResizing = false;

panelResizer.addEventListener("mousedown", () => {
  isResizing = true;
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
});

document.addEventListener("mousemove", (event) => {
  if (!isResizing) {
    return;
  }

  const workspaceBounds = workspace.getBoundingClientRect();
  const nextWidth = event.clientX - workspaceBounds.left;
  const constrainedWidth = Math.min(
    Math.max(nextWidth, 280),
    workspaceBounds.width - 440
  );

  workspace.style.setProperty("--left-panel-width", `${constrainedWidth}px`);
});

document.addEventListener("mouseup", () => {
  if (!isResizing) {
    return;
  }

  isResizing = false;
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
});

window.addEventListener("resize", () => {
  setMobileView("form");
});

syncPreview();
items = items.map(normalizeItem);
renderItems();

if (localStorage.getItem(AUTH_STORAGE_KEY) === "true") {
  showWorkspace();
} else {
  showLogin();
}

setMobileView("form");
