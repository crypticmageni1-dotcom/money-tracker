document.addEventListener("DOMContentLoaded", function () {

    /* ==============================
       ELEMENTS
    ============================== */

    var budgetAmount =
        document.getElementById("budgetAmount");

    var budgetPeriodInput =
        document.getElementById("budgetPeriodInput");

    var saveBudget =
        document.getElementById("saveBudget");

    var totalBudget =
        document.getElementById("totalBudget");

    var budgetPeriod =
        document.getElementById("budgetPeriod");

    var summaryBudget =
        document.getElementById("summaryBudget");

    var summarySpent =
        document.getElementById("summarySpent");

    var summaryRemaining =
        document.getElementById("summaryRemaining");

    var summaryPercent =
        document.getElementById("summaryPercent");

    var progressBar =
        document.getElementById("progressBar");

    var progressSpent =
        document.getElementById("progressSpent");

    var progressBudget =
        document.getElementById("progressBudget");

    var categoryList =
        document.getElementById("categoryList");

    var message =
        document.getElementById("message");


    /* ==============================
       CURRENCY
    ============================== */

    var currencySymbol = "KSh";


    function loadCurrency() {

        currencySymbol = "KSh";

        try {

            var saved =
                localStorage.getItem(
                    "mtracker_settings"
                );

            if (!saved) {
                return;
            }

            var settings =
                JSON.parse(saved);


            if (settings.currency === "USD") {
                currencySymbol = "$";
            }

            else if (settings.currency === "EUR") {
                currencySymbol = "€";
            }

            else if (settings.currency === "GBP") {
                currencySymbol = "£";
            }

            else if (settings.currency === "ZAR") {
                currencySymbol = "R";
            }

            else if (settings.currency === "NGN") {
                currencySymbol = "₦";
            }

            else if (settings.currency === "GHS") {
                currencySymbol = "GH₵";
            }

            else if (settings.currency === "TZS") {
                currencySymbol = "TSh";
            }

            else if (settings.currency === "UGX") {
                currencySymbol = "USh";
            }

            else if (settings.currency === "INR") {
                currencySymbol = "₹";
            }

            else if (settings.currency === "JPY") {
                currencySymbol = "¥";
            }

            else if (settings.currency === "CNY") {
                currencySymbol = "¥";
            }

            else if (settings.currency === "AED") {
                currencySymbol = "د.إ";
            }

        }

        catch (error) {

            currencySymbol = "KSh";

        }

    }


    function money(value) {

        var number =
            Number(value) || 0;

        return currencySymbol + " " +
            number.toLocaleString(
                undefined,
                {
                    maximumFractionDigits: 2
                }
            );

    }


    /* ==============================
       BUDGET STORAGE
    ============================== */

    function getBudget() {

        try {

            var saved =
                localStorage.getItem(
                    "mtracker_budgets"
                );

            if (!saved) {

                return {
                    amount: 0,
                    period: "monthly"
                };

            }


            var data =
                JSON.parse(saved);


            return {

                amount:
                    Number(data.amount) || 0,

                period:
                    data.period || "monthly"

            };

        }

        catch (error) {

            return {
                amount: 0,
                period: "monthly"
            };

        }

    }


    function saveBudgetData(data) {

        localStorage.setItem(
            "mtracker_budgets",
            JSON.stringify(data)
        );

    }


    /* ==============================
       TRANSACTIONS
    ============================== */

    function getTransactions() {

        try {

            var saved =
                localStorage.getItem(
                    "mtracker_transactions"
                );

            if (!saved) {
                return [];
            }


            var data =
                JSON.parse(saved);


            if (Array.isArray(data)) {
                return data;
            }

        }

        catch (error) {

        }

        return [];

    }


    /* ==============================
       DATE HELPERS
    ============================== */

    function getToday() {

        var today =
            new Date();

        return new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

    }


    function getTransactionDate(dateString) {

        if (!dateString) {
            return null;
        }


        var parts =
            dateString.split("-");


        if (parts.length !== 3) {
            return null;
        }


        var year =
            Number(parts[0]);

        var month =
            Number(parts[1]) - 1;

        var day =
            Number(parts[2]);


        return new Date(
            year,
            month,
            day
        );

    }


    /* ==============================
       CHECK BUDGET PERIOD
    ============================== */

    function isInsideBudgetPeriod(
        dateString,
        period
    ) {

        var transactionDate =
            getTransactionDate(dateString);


        if (!transactionDate) {
            return false;
        }


        var today =
            getToday();


        /* WEEKLY */

        if (period === "weekly") {

            var day =
                today.getDay();

            /*
               Sunday = 0
               Monday = 1
            */

            var mondayOffset =
                day === 0 ? -6 : 1 - day;


            var startOfWeek =
                new Date(
                    today
                );


            startOfWeek.setDate(
                today.getDate() +
                mondayOffset
            );


            startOfWeek.setHours(
                0, 0, 0, 0
            );


            var endOfWeek =
                new Date(
                    startOfWeek
                );


            endOfWeek.setDate(
                startOfWeek.getDate() +
                6
            );


            endOfWeek.setHours(
                23, 59, 59, 999
            );


            return (
                transactionDate >=
                startOfWeek &&
                transactionDate <=
                endOfWeek
            );

        }


        /* YEARLY */

        if (period === "yearly") {

            return (
                transactionDate.getFullYear() ===
                today.getFullYear()
            );

        }


        /* MONTHLY */

        return (
            transactionDate.getFullYear() ===
                today.getFullYear() &&

            transactionDate.getMonth() ===
                today.getMonth()
        );

    }


    /* ==============================
       CALCULATE SPENDING
    ============================== */

    function calculateSpent(
        period
    ) {

        var transactions =
            getTransactions();

        var total = 0;


        transactions.forEach(
            function (transaction) {

                var type =
                    String(
                        transaction.type || ""
                    ).toLowerCase();


                if (
                    type !== "expense" &&
                    type !== "spent" &&
                    type !== "debit"
                ) {

                    return;

                }


                if (
                    !isInsideBudgetPeriod(
                        transaction.date,
                        period
                    )
                ) {

                    return;

                }


                var amount =
                    Number(
                        transaction.amount
                    ) || 0;


                total += amount;

            }
        );


        return total;

    }


    /* ==============================
       CATEGORY SPENDING
    ============================== */

    function calculateCategories(
        period
    ) {

        var transactions =
            getTransactions();

        var categories = {};


        transactions.forEach(
            function (transaction) {

                var type =
                    String(
                        transaction.type || ""
                    ).toLowerCase();


                if (
                    type !== "expense" &&
                    type !== "spent" &&
                    type !== "debit"
                ) {

                    return;

                }


                if (
                    !isInsideBudgetPeriod(
                        transaction.date,
                        period
                    )
                ) {

                    return;

                }


                var category =
                    transaction.category ||
                    "Other";


                var amount =
                    Number(
                        transaction.amount
                    ) || 0;


                if (!categories[category]) {

                    categories[category] = 0;

                }


                categories[category] +=
                    amount;

            }
        );


        return categories;

    }


    /* ==============================
       PERIOD NAME
    ============================== */

    function getPeriodName(
        period
    ) {

        if (period === "weekly") {

            return "Weekly budget";

        }


        if (period === "yearly") {

            return "Yearly budget";

        }


        return "Monthly budget";

    }


    /* ==============================
       DISPLAY CATEGORIES
    ============================== */

    function displayCategories(
        budgetAmount,
        period
    ) {

        var categories =
            calculateCategories(
                period
            );


        categoryList.innerHTML = "";


        var names =
            Object.keys(
                categories
            );


        if (names.length === 0) {

            categoryList.innerHTML =
                '<div class="empty">' +
                'No expenses recorded for this period.' +
                '</div>';

            return;

        }


        /* Highest spending first */

        names.sort(
            function (a, b) {

                return (
                    categories[b] -
                    categories[a]
                );

            }
        );


        names.forEach(
            function (name) {

                var amount =
                    categories[name];


                var percentage = 0;


                if (budgetAmount > 0) {

                    percentage =
                        (
                            amount /
                            budgetAmount
                        ) * 100;

                }


                var barPercentage =
                    Math.min(
                        percentage,
                        100
                    );


                var category =
                    document.createElement(
                        "div"
                    );

                category.className =
                    "category";


                /* TOP */

                var top =
                    document.createElement(
                        "div"
                    );

                top.className =
                    "category-top";


                var nameElement =
                    document.createElement(
                        "span"
                    );

                nameElement.className =
                    "category-name";

                nameElement.textContent =
                    name;


                var moneyElement =
                    document.createElement(
                        "span"
                    );

                moneyElement.className =
                    "category-money";

                moneyElement.textContent =
                    money(amount);


                top.appendChild(
                    nameElement
                );

                top.appendChild(
                    moneyElement
                );


                /* BAR */

                var background =
                    document.createElement(
                        "div"
                    );

                background.className =
                    "category-background";


                var bar =
                    document.createElement(
                        "div"
                    );

                bar.className =
                    "category-progress";

                bar.style.width =
                    barPercentage + "%";


                background.appendChild(
                    bar
                );


                /* BOTTOM */

                var bottom =
                    document.createElement(
                        "div"
                    );

                bottom.className =
                    "category-bottom";


                var percentageText =
                    document.createElement(
                        "span"
                    );

                percentageText.textContent =
                    Math.round(
                        percentage
                    ) +
                    "% of budget";


                var amountText =
                    document.createElement(
                        "span"
                    );

                amountText.textContent =
                    money(amount);


                bottom.appendChild(
                    percentageText
                );

                bottom.appendChild(
                    amountText
                );


                /* BUILD */

                category.appendChild(
                    top
                );

                category.appendChild(
                    background
                );

                category.appendChild(
                    bottom
                );


                categoryList.appendChild(
                    category
                );

            }
        );

    }


    /* ==============================
       UPDATE BUDGET
    ============================== */

    function updateBudget() {

        loadCurrency();


        var budget =
            getBudget();


        var amount =
            Number(
                budget.amount
            ) || 0;


        var period =
            budget.period ||
            "monthly";


        var spent =
            calculateSpent(
                period
            );


        var remaining =
            amount - spent;


        var percentage = 0;


        if (amount > 0) {

            percentage =
                (
                    spent /
                    amount
                ) * 100;

        }


        /* TOTAL */

        totalBudget.textContent =
            money(amount);


        budgetPeriod.textContent =
            getPeriodName(
                period
            );


        /* SUMMARY */

        summaryBudget.textContent =
            money(amount);


        summarySpent.textContent =
            money(spent);


        summaryRemaining.textContent =
            money(remaining);


        summaryPercent.textContent =
            Math.round(
                percentage
            ) + "%";


        /* PROGRESS */

        var progress =
            Math.min(
                Math.max(
                    percentage,
                    0
                ),
                100
            );


        progressBar.style.width =
            progress + "%";


        progressSpent.textContent =
            money(spent) +
            " spent";


        progressBudget.textContent =
            money(amount) +
            " budget";


        /* FORM */

        budgetPeriodInput.value =
            period;


        /* CATEGORIES */

        displayCategories(
            amount,
            period
        );

    }


    /* ==============================
       SAVE BUDGET
    ============================== */

    saveBudget.addEventListener(
        "click",
        function () {

            var amount =
                Number(
                    budgetAmount.value
                );


            var period =
                budgetPeriodInput.value;


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                showMessage(
                    "Please enter a valid budget amount."
                );

                return;

            }


            var budget = {

                amount:
                    amount,

                period:
                    period

            };


            saveBudgetData(
                budget
            );


            budgetAmount.value = "";


            showMessage(
                "Budget saved successfully."
            );


            updateBudget();

        }
    );


    /* ==============================
       MESSAGE
    ============================== */

    function showMessage(
        text
    ) {

        message.textContent =
            text;


        setTimeout(
            function () {

                message.textContent =
                    "";

            },
            2500
        );

    }


    /* ==============================
       START
    ============================== */

    updateBudget();

});