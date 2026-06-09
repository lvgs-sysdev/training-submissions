const categoriesByKind = {
  expense: ["Food", "Transport", "Housing", "Utilities", "Leisure"],
  income: ["Salary", "Bonus", "Freelance", "Refund", "Other"],
};

class Entry {
  constructor({ id, kind, category, description, amount, date }) {
    this.id = id;
    this.kind = kind;
    this.category = category;
    this.description = description;
    this.amount = amount;
    this.date = date;
  }
}

class HouseholdLedger {
  constructor(entries = []) {
    this.entries = entries;
  }

  addEntry(entry) {
    this.entries = [entry, ...this.entries];
  }

  removeEntry(entryId) {
    this.entries = this.entries.filter((entry) => entry.id !== entryId);
  }

  listEntries(monthKey) {
    return this.entries.filter((entry) => entry.date.startsWith(monthKey));
  }

  summarize(monthKey) {
    return this.listEntries(monthKey).reduce(
      (summary, entry) => {
        if (entry.kind === "income") {
          summary.income += entry.amount;
        } else {
          summary.expense += entry.amount;
        }

        return summary;
      },
      { income: 0, expense: 0 }
    );
  }
}

const currency = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const storageKey = "activity-console-entries-v2";

const today = new Date();
const defaultMonth = today.toISOString().slice(0, 7);
const defaultDate = today.toISOString().slice(0, 10);

const defaultEntries = [
  new Entry({
    id: crypto.randomUUID(),
    kind: "income",
    category: "Salary",
    description: "Seed-Alpha",
    amount: 280000,
    date: `${defaultMonth}-01`,
  }),
  new Entry({
    id: crypto.randomUUID(),
    kind: "expense",
    category: "Food",
    description: "Seed-Beta",
    amount: 12800,
    date: `${defaultMonth}-03`,
  }),
  new Entry({
    id: crypto.randomUUID(),
    kind: "expense",
    category: "Transport",
    description: "Seed-Gamma",
    amount: 9200,
    date: `${defaultMonth}-05`,
  }),
];

function loadEntries() {
  const storedEntries = localStorage.getItem(storageKey);

  if (!storedEntries) {
    return defaultEntries;
  }

  try {
    const parsedEntries = JSON.parse(storedEntries);

    if (!Array.isArray(parsedEntries)) {
      return defaultEntries;
    }

    return parsedEntries.map((entry) => new Entry(entry));
  } catch {
    return defaultEntries;
  }
}

function persistEntries() {
  localStorage.setItem(storageKey, JSON.stringify(ledger.entries));
}

const ledger = new HouseholdLedger(loadEntries());

const elements = {
  form: document.querySelector("#entry-form"),
  kind: document.querySelector("#entry-kind"),
  category: document.querySelector("#category"),
  description: document.querySelector("#description"),
  amount: document.querySelector("#amount"),
  date: document.querySelector("#entry-date"),
  monthFilter: document.querySelector("#month-filter"),
  incomeTotal: document.querySelector("#income-total"),
  expenseTotal: document.querySelector("#expense-total"),
  balanceTotal: document.querySelector("#balance-total"),
  entryList: document.querySelector("#entry-list"),
  entryCount: document.querySelector("#entry-count"),
  message: document.querySelector("#form-message"),
};

elements.monthFilter.value = defaultMonth;
elements.date.value = defaultDate;

function populateCategories(kind) {
  elements.category.innerHTML = categoriesByKind[kind]
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
}

function buildEntry() {
  const kind = elements.kind.value;
  const description = elements.description.value.trim();
  const amount = Number(elements.amount.value);
  const category = elements.category.value;
  const date = elements.date.value;

  if (!description) {
    throw new Error("ラベルを入力してください。");
  }

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("値は0以上の数値で入力してください。");
  }

  if (!date) {
    throw new Error("記録日を入力してください。");
  }

  return new Entry({
    id: crypto.randomUUID(),
    kind,
    category,
    description,
    amount,
    date,
  });
}

function render() {
  const monthKey = elements.monthFilter.value;
  const visibleEntries = ledger.listEntries(monthKey);
  const { income, expense } = ledger.summarize(monthKey);
  const balance = income - expense;

  elements.incomeTotal.textContent = currency.format(income);
  elements.expenseTotal.textContent = currency.format(expense);
  elements.balanceTotal.textContent = currency.format(balance);
  elements.entryCount.textContent = `${visibleEntries.length} items`;

  if (visibleEntries.length === 0) {
    elements.entryList.innerHTML = '<li class="empty-state">この期間のレコードはありません。</li>';
    return;
  }

  elements.entryList.innerHTML = visibleEntries
    .map(
      (entry) => `
        <li class="entry-row">
          <div>
            <strong>${entry.description}</strong>
            <p class="entry-meta">${entry.category} / ${entry.date}</p>
          </div>
          <div>
            <span class="entry-amount">${entry.kind === "income" ? "+" : "-"}${currency.format(entry.amount)}</span>
            <button class="delete-button" data-entry-id="${entry.id}" type="button">除外</button>
          </div>
        </li>
      `
    )
    .join("");
}

elements.kind.addEventListener("change", (event) => {
  populateCategories(event.target.value);
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const entry = buildEntry();
    ledger.addEntry(entry);
    persistEntries();
    elements.message.textContent = "レコードを追加しました。";
    elements.form.reset();
    elements.kind.value = entry.kind;
    elements.date.value = defaultDate;
    elements.monthFilter.value = entry.date.slice(0, 7);
    populateCategories(entry.kind);
    render();
  } catch (error) {
    elements.message.textContent = error.message;
  }
});

elements.monthFilter.addEventListener("change", render);

elements.entryList.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const { entryId } = target.dataset;

  if (!entryId) {
    return;
  }

  ledger.removeEntry(entryId);
  persistEntries();
  render();
});

populateCategories(elements.kind.value);
render();