// LocalStorage keys
const STORAGE_KEYS = {
  maintenance: 'maintenanceRecords',
  expense: 'expenseRecords',
  issues: 'issuesRecords',
  waterCleaning: 'waterCleaningRecords'
};

// Utility
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function updateBalance() {
  const m = getData(STORAGE_KEYS.maintenance);
  const e = getData(STORAGE_KEYS.expense);
  const totalM = m.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const totalE = e.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  document.getElementById('total-maintenance').textContent = totalM.toFixed(2);
  document.getElementById('total-expense').textContent = totalE.toFixed(2);
  document.getElementById('balance-amount').textContent = (totalM - totalE).toFixed(2);
}
function renderHistoryTables() {
  const makeTable = (id, records, cols, type) => {
    const tbody = document.querySelector(`#${id} tbody`);
    tbody.innerHTML = '';
    records.forEach((rec, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = cols.map(c => `<td>${rec[c] || ''}</td>`).join('') +
        `<td><button class="delete-btn" data-type="${type}" data-index="${i}">Delete</button></td>`;
      tbody.appendChild(tr);
    });
  };
  makeTable('maintenance-table', getData(STORAGE_KEYS.maintenance), ['flatNumber', 'month', 'amount'], 'maintenance');
  makeTable('expense-table', getData(STORAGE_KEYS.expense), ['description', 'amount', 'date'], 'expense');
  makeTable('issues-table', getData(STORAGE_KEYS.issues), ['flatNumber', 'description'], 'issues');
  makeTable('water-cleaning-table', getData(STORAGE_KEYS.waterCleaning), ['plotNumber', 'filteredCleaning', 'startDate', 'endDate'], 'waterCleaning');
}
function deleteRecord(type, index) {
  const data = getData(STORAGE_KEYS[type]);
  if (index >= 0 && index < data.length) {
    data.splice(index, 1);
    saveData(STORAGE_KEYS[type], data);
    renderHistoryTables();
    updateBalance();
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  updateBalance();
  renderHistoryTables();

  // Nav handling
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(target).classList.add('active');
      updateBalance();
      renderHistoryTables();
    });
  });

  // Forms
  document.getElementById('maintenance-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const recs = getData(STORAGE_KEYS.maintenance);
    recs.push({ flatNumber: f.flatNumber.value, month: f.month.value, amount: parseFloat(f.amount.value) });
    saveData(STORAGE_KEYS.maintenance, recs);
    f.reset(); alert('Added.');
  });

  document.getElementById('expense-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const recs = getData(STORAGE_KEYS.expense);
    recs.push({ description: f.description.value, amount: parseFloat(f.amount.value), date: f.date.value });
    saveData(STORAGE_KEYS.expense, recs);
    f.reset(); alert('Added.');
  });

  document.getElementById('issues-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const recs = getData(STORAGE_KEYS.issues);
    recs.push({ flatNumber: f.flatNumber.value, description: f.description.value });
    saveData(STORAGE_KEYS.issues, recs);
    f.reset(); alert('Submitted.');
  });

  document.getElementById('water-cleaning-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const recs = getData(STORAGE_KEYS.waterCleaning);
    recs.push({
      plotNumber: f.plotNumber.value,
      filteredCleaning: f.filteredCleaning.value,
      startDate: f.startDate.value,
      endDate: f.endDate.value
    });
    saveData(STORAGE_KEYS.waterCleaning, recs);
    f.reset(); alert('Water & Cleaning entry added.');
  });

  document.getElementById('clear-data-btn').addEventListener('click', () => {
    if (confirm('Clear all data?')) {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
      updateBalance(); renderHistoryTables();
    }
  });

  document.addEventListener('click', e => {
    if (e.target.classList.contains('delete-btn')) {
      const type = e.target.dataset.type;
      const index = parseInt(e.target.dataset.index, 10);
      deleteRecord(type, index);
    }
  });
});
