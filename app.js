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
const cashOfficerName = document.getElementById("cashOfficerName");
const cashOfficerPfid = document.getElementById("cashOfficerPfid");
const jointOfficerName = document.getElementById("jointOfficerName");
const jointOfficerPfid = document.getElementById("jointOfficerPfid");
const inputRate18 = document.getElementById("inputRate18");
const inputRate20 = document.getElementById("inputRate20");
const inputRate22 = document.getElementById("inputRate22");
const addItemButton = document.getElementById("addItemButton");
const itemEditorList = document.getElementById("itemEditorList");
const collapsibleSections = document.querySelectorAll("[data-collapsible]");
const previewPrintButton = document.getElementById("previewPrintButton");
const previewPdfButton = document.getElementById("previewPdfButton");
const fullscreenButton = document.getElementById("fullscreenButton");
const panelResizer = document.getElementById("panelResizer");
const workspace = document.getElementById("appWorkspace");
const certificateSheet = document.querySelector(".certificate-sheet");
const entryForm = document.querySelector(".entry-form");
const controlPanel = document.querySelector(".control-panel");

const AUTH_STORAGE_KEY = "gold-loan-authenticated";
const RATES_STORAGE_KEY = "gold-loan-rates";
const OFFICERS_STORAGE_KEY = "gold-loan-officers";
const BRANCH_STORAGE_KEY = "gold-loan-branch";
const AUTH_USER = "admin";
const AUTH_PASSWORD = "gold123";
const MOBILE_BREAKPOINT = 760;
const ITEM_FIELD_NAV_ORDER = [
  "description",
  "quantity",
  "grossWeight",
  "stoneWeight",
  "purity",
];
let currentMobileView = "form";

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
const previewCashOfficerName = document.getElementById("previewCashOfficerName");
const previewCashOfficerPfid = document.getElementById("previewCashOfficerPfid");
const previewJointOfficerName = document.getElementById("previewJointOfficerName");
const previewJointOfficerPfid = document.getElementById("previewJointOfficerPfid");
const previewCashOfficerInline = document.getElementById("previewCashOfficerInline");
const previewJointOfficerInline = document.getElementById("previewJointOfficerInline");
const rate18 = document.getElementById("rate18");
const rate20 = document.getElementById("rate20");
const rate22 = document.getElementById("rate22");
const valuationTableBody = document.getElementById("valuationTableBody");
const totalQuantity = document.getElementById("totalQuantity");
const totalGrossWeight = document.getElementById("totalGrossWeight");
const totalStoneWeight = document.getElementById("totalStoneWeight");
const totalNetWeight = document.getElementById("totalNetWeight");
const totalMarketValue = document.getElementById("totalMarketValue");

const today = new Date();
const isoToday = today.toISOString().split("T")[0];

certificateDate.value = isoToday;
appraiserCertDate.value = "";

let items = [];

function loadPersistedRates() {
  try {
    const raw = localStorage.getItem(RATES_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") {
      return;
    }

    if (data.rate18 != null && String(data.rate18) !== "") {
      inputRate18.value = String(data.rate18);
    }

    if (data.rate20 != null && String(data.rate20) !== "") {
      inputRate20.value = String(data.rate20);
    }

    if (data.rate22 != null && String(data.rate22) !== "") {
      inputRate22.value = String(data.rate22);
    }
  } catch {
    localStorage.removeItem(RATES_STORAGE_KEY);
  }
}

function savePersistedRates() {
  localStorage.setItem(
    RATES_STORAGE_KEY,
    JSON.stringify({
      rate18: inputRate18.value,
      rate20: inputRate20.value,
      rate22: inputRate22.value,
    })
  );
}

function clearPersistedRates() {
  localStorage.removeItem(RATES_STORAGE_KEY);
  inputRate18.value = "";
  inputRate20.value = "";
  inputRate22.value = "";
}

function loadPersistedOfficers() {
  try {
    const raw = localStorage.getItem(OFFICERS_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") {
      return;
    }

    if (data.cashOfficerName != null) {
      cashOfficerName.value = String(data.cashOfficerName);
    }

    if (data.cashOfficerPfid != null) {
      cashOfficerPfid.value = String(data.cashOfficerPfid);
    }

    if (data.jointOfficerName != null) {
      jointOfficerName.value = String(data.jointOfficerName);
    }

    if (data.jointOfficerPfid != null) {
      jointOfficerPfid.value = String(data.jointOfficerPfid);
    }
  } catch {
    localStorage.removeItem(OFFICERS_STORAGE_KEY);
  }
}

function savePersistedOfficers() {
  localStorage.setItem(
    OFFICERS_STORAGE_KEY,
    JSON.stringify({
      cashOfficerName: cashOfficerName.value,
      cashOfficerPfid: cashOfficerPfid.value,
      jointOfficerName: jointOfficerName.value,
      jointOfficerPfid: jointOfficerPfid.value,
    })
  );
}

function clearPersistedOfficers() {
  localStorage.removeItem(OFFICERS_STORAGE_KEY);
  cashOfficerName.value = "";
  cashOfficerPfid.value = "";
  jointOfficerName.value = "";
  jointOfficerPfid.value = "";
}

function loadPersistedBranch() {
  try {
    const raw = localStorage.getItem(BRANCH_STORAGE_KEY);
    if (!raw) {
      return;
    }

    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") {
      return;
    }

    if (data.branchName != null) {
      branchName.value = String(data.branchName);
    }
  } catch {
    localStorage.removeItem(BRANCH_STORAGE_KEY);
  }
}

function savePersistedBranch() {
  localStorage.setItem(
    BRANCH_STORAGE_KEY,
    JSON.stringify({ branchName: branchName.value })
  );
}

function clearPersistedBranch() {
  localStorage.removeItem(BRANCH_STORAGE_KEY);
  branchName.value = "";
}

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

function capitalizeWords(value) {
  const text = String(value || "");

  if (!text) {
    return "";
  }

  return text
    .split(/(\s+)/)
    .map((part) => {
      if (/^\s+$/.test(part) || part === "") {
        return part;
      }

      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}

function shouldCapitalizeField(fieldName) {
  return [
    "bankName",
    "branchName",
    "appraiserAddress",
    "cashOfficerName",
    "jointOfficerName",
    "description",
    "customerName",
  ].includes(fieldName);
}

function getRateByPurity(purity) {
  if (!purity) {
    return 0;
  }

  if (purity === "18K") {
    return Number(inputRate18.value || 0);
  }

  if (purity === "20K") {
    return Number(inputRate20.value || 0);
  }

  if (purity === "22K") {
    return Number(inputRate22.value || 0);
  }

  return 0;
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
  previewBankName.textContent = bankName.value || "";
  previewBranchName.textContent = branchName.value || "";
  previewLoanAccount.textContent = loanAccount.value || "";
  previewLedgerFolio.textContent = ledgerFolio.value || "";
  previewAppraiserAddress.textContent = appraiserAddress.value || "";
  // Place appears only on the certificate; always Aligarh for this template.
  previewPlace.textContent = "Aligarh";
  previewCashOfficerName.textContent = capitalizeWords(cashOfficerName.value);
  previewCashOfficerPfid.textContent = cashOfficerPfid.value || "";
  previewJointOfficerName.textContent = capitalizeWords(jointOfficerName.value);
  previewJointOfficerPfid.textContent = jointOfficerPfid.value || "";
  previewCashOfficerInline.textContent =
    capitalizeWords(cashOfficerName.value) || "................";
  previewJointOfficerInline.textContent =
    capitalizeWords(jointOfficerName.value) || "................";
  rate18.innerHTML = `<strong>18K</strong> - ${formatRate(inputRate18.value)}`;
  rate20.innerHTML = `<strong>20K</strong> - ${formatRate(inputRate20.value)}`;
  rate22.innerHTML = `<strong>22K</strong> - ${formatRate(inputRate22.value)}`;
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
  currentMobileView = mode;
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

function getFocusableFields() {
  return Array.from(
    controlPanel.querySelectorAll(
      'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'
    )
  ).filter((element) => {
    if (element.closest(".is-hidden")) {
      return false;
    }

    const parentSection = element.closest(".section-content.is-collapsed");
    if (parentSection) {
      return false;
    }

    if (element.classList.contains("row-delete")) {
      return false;
    }

    return true;
  });
}

function focusNextField(currentElement) {
  const applyFocus = (el) => {
    if (!el) {
      return;
    }

    requestAnimationFrame(() => {
      el.focus();

      if (typeof el.select === "function" && el.tagName !== "SELECT") {
        el.select();
      }
    });
  };

  for (let guard = 0; guard < 30; guard += 1) {
    const fields = getFocusableFields();
    const idx = fields.indexOf(currentElement);

    if (idx === -1) {
      return;
    }

    let expandedSomething = false;

    for (let j = idx + 1; j < fields.length; j += 1) {
      const el = fields[j];

      if (el.classList.contains("section-toggle")) {
        if (el.getAttribute("aria-expanded") === "false") {
          el.click();
          expandedSomething = true;
          break;
        }

        continue;
      }

      applyFocus(el);
      return;
    }

    if (!expandedSomething) {
      return;
    }
  }
}

function focusNextItemField(currentElement) {
  const applyFocus = (el) => {
    if (!el) {
      return;
    }

    requestAnimationFrame(() => {
      el.focus();

      if (typeof el.select === "function" && el.tagName !== "SELECT") {
        el.select();
      }
    });
  };

  const rawId = currentElement.dataset?.id;
  const field = currentElement.dataset?.field;

  if (rawId == null || !field) {
    return;
  }

  const idSelector =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(String(rawId))
      : String(rawId);

  const orderIdx = ITEM_FIELD_NAV_ORDER.indexOf(field);

  if (orderIdx === -1) {
    return;
  }

  if (orderIdx < ITEM_FIELD_NAV_ORDER.length - 1) {
    const nextName = ITEM_FIELD_NAV_ORDER[orderIdx + 1];
    const next = itemEditorList.querySelector(
      `[data-id="${idSelector}"][data-field="${nextName}"]`
    );
    applyFocus(next);
    return;
  }

  const card = currentElement.closest(".item-editor-card");
  if (!card) {
    return;
  }

  let sibling = card.nextElementSibling;
  while (sibling) {
    const nextDesc = sibling.querySelector('[data-field="description"]');
    if (nextDesc) {
      applyFocus(nextDesc);
      return;
    }
    sibling = sibling.nextElementSibling;
  }

  applyFocus(addItemButton);
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
              <input class="item-form-input" data-field="description" data-id="${item.id}" type="text" value="${capitalizeWords(item.description)}" placeholder="Enter ornament description" />
            </label>
            <label>
              Qty
              <input class="item-form-input" data-field="quantity" data-id="${item.id}" type="number" step="1" min="1" value="${item.quantity === 0 ? "" : item.quantity}" placeholder="1" />
            </label>
            <label>
              Gross Weight
              <input class="item-form-input" data-field="grossWeight" data-id="${item.id}" type="number" step="0.001" value="${item.grossWeight === 0 ? "" : formatWeight(item.grossWeight)}" placeholder="0.000" />
            </label>
            <label>
              Stone Weight
              <input class="item-form-input" data-field="stoneWeight" data-id="${item.id}" type="number" step="0.001" value="${item.stoneWeight === 0 ? "" : formatWeight(item.stoneWeight)}" placeholder="0.000" />
            </label>
            <label>
              Purity
              <select class="item-form-input" data-field="purity" data-id="${item.id}">
                <option value="" ${item.purity === "" ? "selected" : ""}>Select purity</option>
                <option value="18K" ${item.purity === "18K" ? "selected" : ""}>18K</option>
                <option value="20K" ${item.purity === "20K" ? "selected" : ""}>20K</option>
                <option value="22K" ${item.purity === "22K" ? "selected" : ""}>22K</option>
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
          <td>${capitalizeWords(item.description)}</td>
          <td>${item.quantity || ""}</td>
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
      accumulator.quantity += Number(item.quantity || 0);
      accumulator.grossWeight += Number(item.grossWeight || 0);
      accumulator.stoneWeight += Number(item.stoneWeight || 0);
      accumulator.netWeight += Number(item.netWeight || 0);
      accumulator.marketValue += Number(item.marketValue || 0);
      return accumulator;
    },
    { quantity: 0, grossWeight: 0, stoneWeight: 0, netWeight: 0, marketValue: 0 }
  );

  totalQuantity.textContent = totals.quantity;
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
      field === "description"
        ? capitalizeWords(value)
        : field === "purity"
          ? value
          : Number(value || 0);

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
  const newId = Date.now();

  items.push({
    id: newId,
    description: "",
    quantity: 1,
    grossWeight: 0,
    stoneWeight: 0,
    purity: "",
    netWeight: 0,
    marketValue: 0,
  });

  items = items.map(normalizeItem);
  renderItems();

  requestAnimationFrame(() => {
    const itemCard = itemEditorList
      .querySelector(`[data-id="${newId}"][data-field="description"]`)
      ?.closest(".item-editor-card");
    const descriptionField = itemEditorList.querySelector(
      `[data-id="${newId}"][data-field="description"]`
    );

    if (itemCard) {
      itemCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (descriptionField) {
      descriptionField.focus();
    }
  });
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
  cashOfficerName,
  cashOfficerPfid,
  jointOfficerName,
  jointOfficerPfid,
  inputRate18,
  inputRate20,
  inputRate22,
].forEach((field) => {
  field.addEventListener("input", syncPreview);
});

[inputRate18, inputRate20, inputRate22].forEach((field) => {
  field.addEventListener("input", () => {
    items = items.map(normalizeItem);
    syncPreview();
    renderItems();
    savePersistedRates();
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

  if (shouldCapitalizeField(field)) {
    target.value = capitalizeWords(target.value);
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

[
  bankName,
  branchName,
  appraiserAddress,
  cashOfficerName,
  jointOfficerName,
].forEach((field) => {
  field.addEventListener("input", () => {
    field.value = capitalizeWords(field.value);
    syncPreview();
  });
});

[cashOfficerName, cashOfficerPfid, jointOfficerName, jointOfficerPfid].forEach(
  (field) => {
    field.addEventListener("input", savePersistedOfficers);
  }
);

branchName.addEventListener("input", savePersistedBranch);

itemEditorList.addEventListener("change", (event) => {
  const target = event.target;
  const itemId = Number(target.dataset.id);
  const field = target.dataset.field;

  event.stopPropagation();

  if (!itemId || !field) {
    return;
  }

  updateItem(itemId, field, target.value, false);

  const item = items.find((entry) => entry.id === itemId);
  const card = target.closest(".item-editor-card");

  if (item && card) {
    const readonlyFields = card.querySelectorAll(".readonly-field");

    if (readonlyFields[0]) {
      readonlyFields[0].textContent = formatWeight(item.netWeight);
    }

    if (readonlyFields[1]) {
      readonlyFields[1].textContent = formatMoney(item.marketValue);
    }
  }

  if (target.tagName === "SELECT" && target.dataset.enterPressed === "true") {
    delete target.dataset.enterPressed;
    requestAnimationFrame(() => {
      focusNextItemField(target);
    });
  }
});

itemEditorList.addEventListener(
  "keydown",
  (event) => {
    if (event.key !== "Enter" || event.isComposing) {
      return;
    }

    const target = event.target;

    if (target.tagName === "TEXTAREA") {
      return;
    }

    if (!itemEditorList.contains(target)) {
      return;
    }

    if (target.tagName === "BUTTON") {
      event.preventDefault();
      event.stopPropagation();
      target.click();
      return;
    }

    if (!target.classList.contains("item-form-input")) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (target.tagName === "SELECT") {
      target.dataset.enterPressed = "true";
      return;
    }

    focusNextItemField(target);
  },
  true
);

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
  clearPersistedRates();
  clearPersistedOfficers();
  clearPersistedBranch();
  items = items.map(normalizeItem);
  syncPreview();
  renderItems();
  setAuthenticated(false);
  loginForm.reset();
  loginError.hidden = true;
});

entryForm.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  if (event.target.closest("#itemEditorList")) {
    return;
  }

  if (event.isComposing) {
    return;
  }

  const target = event.target;

  if (target.tagName === "TEXTAREA") {
    if (event.shiftKey) {
      return;
    }

    event.preventDefault();
    focusNextField(target);
    return;
  }

  if (target.tagName === "SELECT") {
    target.dataset.enterPressed = "true";
    return;
  }

  if (target.tagName === "BUTTON") {
    event.preventDefault();
    target.click();
    return;
  }

  event.preventDefault();
  focusNextField(target);
});

entryForm.addEventListener("change", (event) => {
  const target = event.target;

  if (target.tagName !== "SELECT" || target.dataset.enterPressed !== "true") {
    return;
  }

  delete target.dataset.enterPressed;
  focusNextField(target);
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
  setMobileView(currentMobileView);
});

loadPersistedRates();
loadPersistedOfficers();
loadPersistedBranch();
syncPreview();
items = items.map(normalizeItem);
renderItems();

if (localStorage.getItem(AUTH_STORAGE_KEY) === "true") {
  showWorkspace();
} else {
  showLogin();
}

setMobileView(currentMobileView);
