/* =====================================================
   M-TRACKER
   MAIN APPLICATION ENGINE
===================================================== */


/* =====================================================
   1. M-TRACKER SETTINGS
===================================================== */

const MTracker = {

    settings: {

        // Default currency
        currency: "USD",

        // Currency symbol
        currencySymbol: "$",

        // Balance visibility
        balanceVisible: true,

        // Privacy masking
        privacyMask: "••••••"

    },

    // Financial data
    transactions: [],

    // Budget
    budget: {
        limit: 0
    },

    // Savings
    savings: 0

};


/* =====================================================
   2. CURRENCY DATABASE
===================================================== */

const currencies = {

    USD: {
        name: "US Dollar",
        symbol: "$",
        code: "USD"
    },

    KES: {
        name: "Kenyan Shilling",
        symbol: "KSh",
        code: "KES"
    },

    EUR: {
        name: "Euro",
        symbol: "€",
        code: "EUR"
    },

    GBP: {
        name: "British Pound",
        symbol: "£",
        code: "GBP"
    },

    ZAR: {
        name: "South African Rand",
        symbol: "R",
        code: "ZAR"
    },

    NGN: {
        name: "Nigerian Naira",
        symbol: "₦",
        code: "NGN"
    },

    UGX: {
        name: "Ugandan Shilling",
        symbol: "USh",
        code: "UGX"
    },

    TZS: {
        name: "Tanzanian Shilling",
        symbol: "TSh",
        code: "TZS"
    },

    GHS: {
        name: "Ghanaian Cedi",
        symbol: "GH₵",
        code: "GHS"
    },

    JPY: {
        name: "Japanese Yen",
        symbol: "¥",
        code: "JPY"
    },

    CAD: {
        name: "Canadian Dollar",
        symbol: "C$",
        code: "CAD"
    },

    AUD: {
        name: "Australian Dollar",
        symbol: "A$",
        code: "AUD"
    }

};


/* =====================================================
   3. LOAD SAVED DATA
===================================================== */

function loadMTrackerData() {

    try {

        const savedData =
            localStorage.getItem("mtrackerData");

        if (!savedData) {
            return;
        }

        const data =
            JSON.parse(savedData);

        if (data.settings) {

            MTracker.settings =
                {
                    ...MTracker.settings,
                    ...data.settings
                };

        }

        if (Array.isArray(data.transactions)) {

            MTracker.transactions =
                data.transactions;

        }

        if (data.budget) {

            MTracker.budget =
                data.budget;

        }

        if (
            typeof data.savings === "number"
        ) {

            MTracker.savings =
                data.savings;

        }

    } catch (error) {

        console.error(
            "M-Tracker data could not be loaded:",
            error
        );

    }

}


/* =====================================================
   4. SAVE M-TRACKER DATA
===================================================== */

function saveMTrackerData() {

    try {

        localStorage.setItem(

            "mtrackerData",

            JSON.stringify({

                settings:
                    MTracker.settings,

                transactions:
                    MTracker.transactions,

                budget:
                    MTracker.budget,

                savings:
                    MTracker.savings

            })

        );

    } catch (error) {

        console.error(
            "M-Tracker data could not be saved:",
            error
        );

    }

}


/* =====================================================
   5. FORMAT MONEY
===================================================== */

function formatMoney(amount) {

    const currency =
        currencies[
            MTracker.settings.currency
        ] || currencies.USD;

    try {

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: currency.code,
                maximumFractionDigits: 2
            }
        ).format(amount);

    } catch (error) {

        return (
            currency.symbol +
            Number(amount).toFixed(2)
        );

    }

}


/* =====================================================
   6. GET TOTAL INCOME
===================================================== */

function getTotalIncome() {

    return MTracker.transactions

        .filter(
            transaction =>
                transaction.type === "income"
        )

        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

}


/* =====================================================
   7. GET TOTAL EXPENSES
===================================================== */

function getTotalExpenses() {

    return MTracker.transactions

        .filter(
            transaction =>
                transaction.type === "expense"
        )

        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

}


/* =====================================================
   8. GET TOTAL SAVINGS
===================================================== */

function getTotalSavings() {

    return MTracker.transactions

        .filter(
            transaction =>
                transaction.type === "savings"
        )

        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

}


/* =====================================================
   9. CALCULATE BALANCE
===================================================== */

function getBalance() {

    const income =
        getTotalIncome();

    const expenses =
        getTotalExpenses();

    const savings =
        getTotalSavings();

    return (
        income -
        expenses -
        savings
    );

}


/* =====================================================
   10. DISPLAY BALANCE
===================================================== */

function updateBalance() {

    const balanceElement =
        document.getElementById(
            "totalBalance"
        );

    if (!balanceElement) {
        return;
    }

    if (
        MTracker.settings.balanceVisible
    ) {

        balanceElement.textContent =
            formatMoney(
                getBalance()
            );

    } else {

        balanceElement.textContent =
            MTracker.settings.privacyMask;

    }

}


/* =====================================================
   11. DISPLAY FINANCIAL SUMMARY
===================================================== */

function updateSummary() {

    const incomeElement =
        document.getElementById(
            "totalIncome"
        );

    const expenseElement =
        document.getElementById(
            "totalExpenses"
        );

    const savingsElement =
        document.getElementById(
            "totalSavings"
        );


    const income =
        getTotalIncome();

    const expenses =
        getTotalExpenses();

    const savings =
        getTotalSavings();


    if (incomeElement) {

        incomeElement.textContent =
            formatMoney(income);

    }

    if (expenseElement) {

        expenseElement.textContent =
            formatMoney(expenses);

    }

    if (savingsElement) {

        savingsElement.textContent =
            formatMoney(savings);

    }

}


/* =====================================================
   12. UPDATE BUDGET
===================================================== */

function updateBudget() {

    const spentElement =
        document.getElementById(
            "budgetSpent"
        );

    const limitElement =
        document.getElementById(
            "budgetLimit"
        );

    const progressElement =
        document.getElementById(
            "budgetProgress"
        );

    const statusElement =
        document.getElementById(
            "budgetStatus"
        );


    if (
        !spentElement ||
        !limitElement ||
        !progressElement ||
        !statusElement
    ) {

        return;

    }


    const expenses =
        getTotalExpenses();

    const limit =
        Number(
            MTracker.budget.limit
        );


    spentElement.textContent =
        formatMoney(expenses);

    limitElement.textContent =
        formatMoney(limit);


    if (limit <= 0) {

        progressElement.style.width =
            "0%";

        statusElement.textContent =
            "Create a budget to start tracking your spending.";

        return;

    }


    let percentage =
        (expenses / limit) * 100;


    percentage =
        Math.min(
            Math.max(percentage, 0),
            100
        );


    progressElement.style.width =
        percentage + "%";


    if (expenses > limit) {

        statusElement.textContent =
            "⚠️ You have exceeded your budget.";

    } else if (percentage >= 80) {

        statusElement.textContent =
            "⚠️ You are getting close to your budget limit.";

    } else {

        statusElement.textContent =
            "✓ Your spending is currently within your budget.";

    }

}


/* =====================================================
   13. BALANCE PRIVACY BUTTON
===================================================== */

function setupBalancePrivacy() {

    const button =
        document.getElementById(
            "balanceVisibility"
        );

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            MTracker.settings.balanceVisible =
                !MTracker.settings.balanceVisible;


            updateBalance();


            if (
                MTracker.settings.balanceVisible
            ) {

                button.textContent =
                    "👁️";

                button.setAttribute(
                    "aria-label",
                    "Hide balance"
                );

            } else {

                button.textContent =
                    "🙈";

                button.setAttribute(
                    "aria-label",
                    "Show balance"
                );

            }


            saveMTrackerData();

        }
    );

}


/* =====================================================
   14. CURRENCY MANAGEMENT
===================================================== */

function setCurrency(currencyCode) {

    if (
        !currencies[currencyCode]
    ) {

        console.warn(
            "Currency not supported:",
            currencyCode
        );

        return;

    }


    MTracker.settings.currency =
        currencyCode;


    MTracker.settings.currencySymbol =
        currencies[
            currencyCode
        ].symbol;


    saveMTrackerData();


    updateDashboard();

}


/* =====================================================
   15. ADD TRANSACTION
===================================================== */

function addTransaction({

    type,
    amount,
    description = "",
    category = "general",
    date = new Date().toISOString(),
    notes = ""

}) {

    const numericAmount =
        Number(amount);


    if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
    ) {

        console.warn(
            "Invalid transaction amount."
        );

        return false;

    }


    if (
        ![
            "income",
            "expense",
            "savings"
        ].includes(type)
    ) {

        console.warn(
            "Invalid transaction type."
        );

        return false;

    }


    const transaction = {

        id:
            Date.now().toString(),

        type,

        amount:
            numericAmount,

        description,

        category,

        date,

        notes

    };


    MTracker.transactions.push(
        transaction
    );


    saveMTrackerData();

    updateDashboard();

    return true;

}


/* =====================================================
   16. UPDATE DASHBOARD
===================================================== */

function updateDashboard() {

    updateBalance();

    updateSummary();

    updateBudget();

    updateRecentTransactions();

}


/* =====================================================
   17. RECENT TRANSACTIONS
===================================================== */

function updateRecentTransactions() {

    const container =
        document.getElementById(
            "recentTransactions"
        );

    if (!container) {
        return;
    }


    if (
        MTracker.transactions.length === 0
    ) {

        return;

    }


    const transactions =
        [
            ...MTracker.transactions
        ]

        .sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        )

        .slice(0, 5);


    container.innerHTML = "";


    transactions.forEach(
        transaction => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "transaction-item";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const amountClass =
                transaction.type === "income"
                    ? "transaction-income"
                    : "transaction-expense";


            item.innerHTML = `

                <div class="transaction-icon">
                    ${transaction.type === "income"
                        ? "↗"
                        : transaction.type === "savings"
                            ? "💰"
                            : "↘"}
                </div>

                <div class="transaction-details">

                    <strong>
                        ${escapeHTML(
                            transaction.description ||
                            "Transaction"
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            transaction.category
                        )}
                    </small>

                </div>

                <strong class="${amountClass}">
                    ${sign}${formatMoney(
                        transaction.amount
                    )}
                </strong>

            `;


            container.appendChild(item);

        }
    );

}


/* =====================================================
   18. BASIC SECURITY HELPER
===================================================== */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(value);

    return div.innerHTML;

}


/* =====================================================
   19. INITIALIZE M-TRACKER
===================================================== */

function initializeMTracker() {

    loadMTrackerData();

    updateDashboard();

    setupBalancePrivacy();

}


/* =====================================================
   20. START APPLICATION
===================================================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeMTracker
    );

} else {

    initializeMTracker();

}