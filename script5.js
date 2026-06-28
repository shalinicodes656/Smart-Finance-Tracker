const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");

const search = document.getElementById("search");
const download = document.getElementById("download");
const themeToggle = document.getElementById("themeToggle");

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

function updateLocalStorage() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function addTransaction(e) {

    e.preventDefault();

    if (
        text.value.trim() === "" ||
        amount.value === "" ||
        date.value === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    const transaction = {

        id: Date.now(),

        text: text.value,

        amount: +amount.value,

        date: date.value,

        category: category.value

    };

    transactions.push(transaction);

    updateValues();

    updateLocalStorage();

    text.value = "";

    amount.value = "";

    date.value = "";

    category.selectedIndex = 0;

}

function removeTransaction(id) {

    transactions =
    transactions.filter(item => item.id !== id);

    updateValues();

    updateLocalStorage();

}
function editTransaction(id) {

    const transaction = transactions.find(item => item.id === id);

    text.value = transaction.text;
    amount.value = transaction.amount;
    date.value = transaction.date;
    category.value = transaction.category;

    transactions = transactions.filter(item => item.id !== id);

    updateValues();
    updateLocalStorage();
}

function updateValues() {

    list.innerHTML = "";

    const filteredTransactions = transactions.filter(item =>
        item.text.toLowerCase().includes(search.value.toLowerCase()) ||
        item.category.toLowerCase().includes(search.value.toLowerCase())
    );

    filteredTransactions.forEach(item => {

        const sign = item.amount < 0 ? "-" : "+";

        const li = document.createElement("li");

        li.classList.add(item.amount < 0 ? "minus" : "plus");

        li.innerHTML = `
        <div>
            <strong>${item.text}</strong><br>
            <small>${item.category} | ${item.date}</small>
        </div>

        <span>${sign}₹${Math.abs(item.amount).toLocaleString("en-IN")}</span>

        <button class="edit-btn" onclick="editTransaction(${item.id})">
        ✏️
        </button>

        <button class="delete-btn" onclick="removeTransaction(${item.id})">
            ✖
        </button>
        `;

        list.appendChild(li);

    });

    const amounts = transactions.map(item => item.amount);

    const total = amounts.reduce((a, b) => a + b, 0);

    const income = amounts
        .filter(item => item > 0)
        .reduce((a, b) => a + b, 0);

    const expense = amounts
        .filter(item => item < 0)
        .reduce((a, b) => a + b, 0) * -1;

    balance.innerText = "₹" + total.toLocaleString("en-IN");

    moneyPlus.innerText = "₹" + income.toLocaleString("en-IN");

    moneyMinus.innerText = "₹" + expense.toLocaleString("en-IN");

    drawChart(income, expense);

}

let chart;

function drawChart(income, expense) {

    const ctx = document.getElementById("myChart");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: ["Income", "Expense"],

            datasets: [{

                data: [income, expense],

                backgroundColor: [
                    "#28a745",
                    "#dc3545"
                ]

            }]

        }

    });

}
function downloadCSV() {

    let csv = "Description,Amount,Category,Date\n";

    transactions.forEach(item => {
        csv += `${item.text},${item.amount},${item.category},${item.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "FinanceTrackerReport.csv";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
}

// Dark Mode
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.innerHTML = "☀️ Light Mode";
    } else {
        themeToggle.innerHTML = "🌙 Dark Mode";
    }

});

// Event Listeners
form.addEventListener("submit", addTransaction);

search.addEventListener("keyup", updateValues);

download.addEventListener("click", downloadCSV);

// Initial Load
updateValues();
