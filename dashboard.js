document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       M-TRACKER DASHBOARD
       ========================================= */

    var balanceElement = document.getElementById("balance");
    var balanceNote = document.getElementById("balanceNote");
    var incomeElement = document.getElementById("income");
    var expensesElement = document.getElementById("expenses");
    var savingsElement = document.getElementById("savings");
    var countElement = document.getElementById("transactionCount");

    var budgetAmountElement = document.getElementById("budgetAmount");
    var budgetProgress = document.getElementById("budgetProgress");
    var budgetSpent = document.getElementById("budgetSpent");
    var budgetRemaining = document.getElementById("budgetRemaining");

    var recentTransactions =
        document.getElementById("recentTransactions");

    var eyeButton =
        document.getElementById("eyeButton");

    var financialAlert =
        document.getElementById("financialAlert");

    var currencySymbol = "KSh";
    var balanceVisible = true;


    /* =========================================
       CURRENCY
       ========================================= */

    function getCurrencySymbol(currency) {

        if (currency === "USD") return "$";
        if (currency === "EUR") return "€";
        if (currency === "GBP") return "£";
        if (currency === "NGN") return "₦";
        if (currency === "GHS") return "GH₵";
        if (currency === "TZS") return "TSh";
        if (currency === "UGX") return "USh";
        if (currency === "ZAR") return "R";
        if (currency === "INR") return "₹";
        if (currency === "JPY") return "¥";
        if (currency === "CNY") return "¥";
        if (currency === "AED") return "د.إ";

        return "KSh";
    }


    function loadCurrency() {

        currencySymbol = "KSh";

        try {

            var saved =
                localStorage.getItem("mtracker_settings");

            if (!saved) {
                return;
            }

            var settings =
                JSON.parse(saved);

            currencySymbol =
                getCurrencySymbol(
                    settings.currency || "KES"
                );

        } catch (error) {

            currencySymbol = "KSh";

        }
    }


    function money(value) {

        var number =
            Number(value) || 0;

        return currencySymbol + " " +
            number.toLocaleString(undefined, {
                maximumFractionDigits: 2
            });
    }


    /* =========================================
       TRANSACTIONS
       ========================================= */

    function getTransactions() {

        try {

            var saved =
                localStorage.getItem(
                    "mtracker_transactions"
                );

            if (!saved) {
                return [];
            }

            var transactions =
                JSON.parse(saved);

            if (Array.isArray(transactions)) {
                return transactions;
            }

        } catch (error) {

            console.log(
                "Transaction data could not be loaded."
            );

        }

        return [];
    }


    /* =========================================
       FINANCES
       ========================================= */

    function calculateFinances() {

        var transactions =
            getTransactions();

        var income = 0;
        var expenses = 0;

        transactions.forEach(function (transaction) {

            var amount =
                Number(transaction.amount) || 0;

            if (transaction.type === "income") {

                income += amount;

            }

            if (transaction.type === "expense") {

                expenses += amount;

            }

        });

        return {

            income: income,

            expenses: expenses,

            balance:
                income - expenses,

            savings:
                income - expenses

        };
    }


    /* =========================================
       BALANCE
       ========================================= */

    function updateBalance(value) {

        if (!balanceElement) {
            return;
        }

        if (balanceVisible) {

            balanceElement.textContent =
                money(value);

            if (balanceNote) {
                balanceNote.textContent =
                    "Available balance";
            }

            if (eyeButton) {
                eyeButton.textContent =
                    "👁️";
            }

        } else {

            balanceElement.textContent =
                "••••••••";

            if (balanceNote) {
                balanceNote.textContent =
                    "Balance hidden";
            }

            if (eyeButton) {
                eyeButton.textContent =
                    "🙈";
            }

        }

    }


    /* =========================================
       EYE BUTTON
       ========================================= */

    if (eyeButton) {

        eyeButton.addEventListener(
            "click",
            function () {

                balanceVisible =
                    !balanceVisible;

                var finances =
                    calculateFinances();

                updateBalance(
                    finances.balance
                );

            }
        );

    }


    /* =========================================
       SUMMARY
       ========================================= */

    function updateSummary() {

        var finances =
            calculateFinances();

        if (incomeElement) {

            incomeElement.textContent =
                money(finances.income);

        }

        if (expensesElement) {

            expensesElement.textContent =
                money(finances.expenses);

        }

        if (savingsElement) {

            savingsElement.textContent =
                money(finances.savings);

        }

        if (countElement) {

            countElement.textContent =
                getTransactions().length;

        }

        updateBalance(
            finances.balance
        );

        updateAlert(
            finances
        );

    }


    /* =========================================
       ALERT
       ========================================= */

    function updateAlert(finances) {

        if (!financialAlert) {
            return;
        }

        financialAlert.style.display =
            "none";

        financialAlert.textContent =
            "";

        if (
            finances.expenses >
            finances.income &&
            finances.income > 0
        ) {

            financialAlert.textContent =
                "⚠️ Your expenses are currently higher than your income.";

            financialAlert.style.display =
                "block";

            return;
        }

        if (
            finances.income === 0 &&
            finances.expenses > 0
        ) {

            financialAlert.textContent =
                "⚠️ You have recorded expenses but no income yet.";

            financialAlert.style.display =
                "block";

        }

    }


    /* =========================================
       BUDGET
       ========================================= */

    function getBudget() {

        try {

            var saved =
                localStorage.getItem(
                    "mtracker_budgets"
                );

            if (!saved) {

                return 0;

            }

            var data =
                JSON.parse(saved);

            var amount =
                Number(data.amount) || 0;

            if (
                amount === 0 &&
                data.budget !== undefined
            ) {

                amount =
                    Number(data.budget) || 0;

            }

            return amount;

        } catch (error) {

            return 0;

        }

    }


    function updateBudget() {

        var budget =
            getBudget();

        var finances =
            calculateFinances();

        var spent =
            finances.expenses;

        var remaining =
            budget - spent;

        var percentage =
            0;

        if (budget > 0) {

            percentage =
                (spent / budget) * 100;

        }

        if (budgetAmountElement) {

            budgetAmountElement.textContent =
                money(budget);

        }

        if (budgetSpent) {

            budgetSpent.textContent =
                money(spent) +
                " spent";

        }

        if (budgetRemaining) {

            budgetRemaining.textContent =
                money(remaining) +
                " remaining";

        }

        if (budgetProgress) {

            if (percentage < 0) {
                percentage = 0;
            }

            if (percentage > 100) {
                percentage = 100;
            }

            budgetProgress.style.width =
                percentage + "%";

        }

    }


    /* =========================================
       RECENT TRANSACTIONS
       ========================================= */

    function displayRecentTransactions() {

        if (!recentTransactions) {
            return;
        }

        var transactions =
            getTransactions();

        recentTransactions.innerHTML =
            "";

        if (transactions.length === 0) {

            recentTransactions.innerHTML =
                '<div class="empty">No transactions yet.</div>';

            return;

        }

        var recent =
            transactions.slice();

        recent.sort(function (a, b) {

            var first =
                Number(a.id) || 0;

            var second =
                Number(b.id) || 0;

            return second - first;

        });

        recent =
            recent.slice(0, 5);

        recent.forEach(function (transaction) {

            var item =
                document.createElement("div");

            item.className =
                "transaction";


            var icon =
                document.createElement("div");

            icon.className =
                "transaction-icon";


            if (transaction.type === "income") {

                icon.textContent =
                    "↓";

            } else if (
                transaction.type === "expense"
            ) {

                icon.textContent =
                    "↑";

            } else {

                icon.textContent =
                    "↔";

            }


            var info =
                document.createElement("div");

            info.className =
                "transaction-info";


            var title =
                document.createElement("strong");

            title.textContent =
                transaction.description ||
                transaction.title ||
                "Transaction";


            var details =
                document.createElement("small");

            details.textContent =
                (
                    transaction.category ||
                    "Other"
                ) +
                " • " +
                (
                    transaction.date ||
                    ""
                );


            info.appendChild(title);
            info.appendChild(details);


            var amount =
                document.createElement("div");


            if (transaction.type === "income") {

                amount.className =
                    "transaction-amount income";

                amount.textContent =
                    "+" +
                    money(transaction.amount);

            } else if (
                transaction.type === "expense"
            ) {

                amount.className =
                    "transaction-amount expense";

                amount.textContent =
                    "-" +
                    money(transaction.amount);

            } else {

                amount.className =
                    "transaction-amount";

                amount.textContent =
                    money(transaction.amount);

            }


            item.appendChild(icon);
            item.appendChild(info);
            item.appendChild(amount);

            recentTransactions.appendChild(item);

        });

    }


    /* =========================================
       PROFILE
       ========================================= */

    function loadProfile() {

        try {

            var saved =
                localStorage.getItem(
                    "mtracker_profile"
                );

            if (!saved) {
                return;
            }

            var profile =
                JSON.parse(saved);


            var profileButton =
                document.querySelector(
                    ".profile-button"
                );


            if (
                profileButton &&
                profile.photo
            ) {

                profileButton.innerHTML =
                    "";

                var image =
                    document.createElement("img");

                image.src =
                    profile.photo;

                image.alt =
                    "Profile";

                image.style.width =
                    "100%";

                image.style.height =
                    "100%";

                image.style.objectFit =
                    "cover";

                image.style.borderRadius =
                    "50%";

                profileButton.appendChild(
                    image
                );

            }

        } catch (error) {

            console.log(
                "Profile could not be loaded."
            );

        }

    }


    /* =========================================
       UPDATE DASHBOARD
       ========================================= */

    function updateDashboard() {

        loadCurrency();

        var settings = {};

        try {

            var saved =
                localStorage.getItem(
                    "mtracker_settings"
                );

            if (saved) {

                settings =
                    JSON.parse(saved);

            }

        } catch (error) {

            settings = {};

        }


        if (
            settings.hideBalance === true
        ) {

            balanceVisible =
                false;

        } else {

            balanceVisible =
                true;

        }


        updateSummary();

        updateBudget();

        displayRecentTransactions();

        loadProfile();

    }


    /* =========================================
       START
       ========================================= */

    updateDashboard();


    window.addEventListener(
        "focus",
        function () {

            updateDashboard();

        }
    );

});