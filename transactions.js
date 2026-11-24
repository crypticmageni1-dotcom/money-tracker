document.addEventListener("DOMContentLoaded", function () {

    var amountInput =
        document.getElementById("amount");

    var descriptionInput =
        document.getElementById("description");

    var categoryInput =
        document.getElementById("category");

    var dateInput =
        document.getElementById("date");

    var saveButton =
        document.getElementById("saveTransaction");

    var searchInput =
        document.getElementById("search");

    var typeFilter =
        document.getElementById("typeFilter");

    var categoryFilter =
        document.getElementById("categoryFilter");

    var transactionList =
        document.getElementById("transactionList");

    var balanceElement =
        document.getElementById("balance");

    var incomeElement =
        document.getElementById("income");

    var expensesElement =
        document.getElementById("expenses");

    var countElement =
        document.getElementById("transactionCount");

    var message =
        document.getElementById("message");

    var typeButtons =
        document.querySelectorAll(".type-button");


    var selectedType = "income";


    var currencySymbol = "KSh";


    /* CURRENCY */

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


    /* LOAD TRANSACTIONS */

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


    /* SAVE TRANSACTIONS */

    function saveTransactions(data) {

        localStorage.setItem(
            "mtracker_transactions",
            JSON.stringify(data)
        );

    }


    /* TODAY */

    function setToday() {

        var today =
            new Date();

        var year =
            today.getFullYear();

        var month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        var day =
            String(
                today.getDate()
            ).padStart(2, "0");


        dateInput.value =
            year + "-" +
            month + "-" +
            day;

    }


    /* TYPE BUTTONS */

    typeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    typeButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedType =
                        button.getAttribute(
                            "data-type"
                        );

                }
            );

        }
    );


    /* ADD TRANSACTION */

    saveButton.addEventListener(
        "click",
        function () {

            var amount =
                Number(
                    amountInput.value
                );


            var description =
                descriptionInput.value.trim();


            var category =
                categoryInput.value;


            var date =
                dateInput.value;


            if (
                isNaN(amount) ||
                amount <= 0
            ) {

                showMessage(
                    "Please enter a valid amount."
                );

                return;

            }


            if (!description) {

                showMessage(
                    "Please enter a description."
                );

                return;

            }


            if (!date) {

                showMessage(
                    "Please select a date."
                );

                return;

            }


            var transactions =
                getTransactions();


            var transaction = {

                id:
                    Date.now(),

                type:
                    selectedType,

                amount:
                    amount,

                description:
                    description,

                category:
                    category,

                date:
                    date

            };


            transactions.push(
                transaction
            );


            saveTransactions(
                transactions
            );


            amountInput.value = "";

            descriptionInput.value = "";


            showMessage(
                "Transaction saved successfully."
            );


            updatePage();

        }
    );


    /* DELETE */
/* EDIT */

function editTransaction(id) {

    var transactions =
        getTransactions();

    var transaction =
        transactions.find(
            function (item) {
                return item.id === id;
            }
        );

    if (!transaction) {
        return;
    }


    var newAmount =
        prompt(
            "Enter new amount:",
            transaction.amount
        );

    if (newAmount === null) {
        return;
    }


    var newDescription =
        prompt(
            "Enter new description:",
            transaction.description
        );

    if (newDescription === null) {
        return;
    }


    var newCategory =
        prompt(
            "Enter new category:",
            transaction.category
        );

    if (newCategory === null) {
        return;
    }


    var amount =
        Number(newAmount);

    newDescription =
        newDescription.trim();

    newCategory =
        newCategory.trim();


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        showMessage(
            "Please enter a valid amount."
        );

        return;

    }


    if (!newDescription) {

        showMessage(
            "Description cannot be empty."
        );

        return;

    }


    if (!newCategory) {

        showMessage(
            "Category cannot be empty."
        );

        return;

    }


    transaction.amount =
        amount;

    transaction.description =
        newDescription;

    transaction.category =
        newCategory;


    saveTransactions(
        transactions
    );


    showMessage(
        "Transaction updated."
    );


    updatePage();

}
    function deleteTransaction(id) {

        var transactions =
            getTransactions();


        var confirmed =
            confirm(
                "Delete this transaction?"
            );


        if (!confirmed) {
            return;
        }


        var updated =
            transactions.filter(
                function (transaction) {

                    return transaction.id !== id;

                }
            );


        saveTransactions(
            updated
        );


        showMessage(
            "Transaction deleted."
        );


        updatePage();

    }


    /* SUMMARY */

    function updateSummary() {

        var transactions =
            getTransactions();


        var income = 0;

        var expenses = 0;


        transactions.forEach(
            function (transaction) {

                var amount =
                    Number(
                        transaction.amount
                    ) || 0;


                if (
                    transaction.type ===
                    "income"
                ) {

                    income += amount;

                }


                else if (
                    transaction.type ===
                    "expense"
                ) {

                    expenses += amount;

                }

            }
        );


        var balance =
            income - expenses;


        balanceElement.textContent =
            money(balance);


        incomeElement.textContent =
            money(income);


        expensesElement.textContent =
            money(expenses);


        countElement.textContent =
            transactions.length;

    }


    /* DISPLAY */

    function displayTransactions() {

        var transactions =
            getTransactions();


        var search =
            searchInput.value
                .trim()
                .toLowerCase();


        var type =
            typeFilter.value;


        var category =
            categoryFilter.value;


        var filtered =
            transactions.filter(
                function (transaction) {

                    var matchesSearch =
                        transaction.description
                            .toLowerCase()
                            .includes(search) ||
                        transaction.category
                            .toLowerCase()
                            .includes(search);


                    var matchesType =
                        type === "all" ||
                        transaction.type === type;


                    var matchesCategory =
                        category === "all" ||
                        transaction.category === category;


                    return (
                        matchesSearch &&
                        matchesType &&
                        matchesCategory
                    );

                }
            );


        filtered.sort(
            function (a, b) {

                return b.id - a.id;

            }
        );


        transactionList.innerHTML = "";


        if (filtered.length === 0) {

            transactionList.innerHTML =
                '<div class="empty">' +
                'No matching transactions.' +
                '</div>';

            return;

        }


        filtered.forEach(
            function (transaction) {

                var item =
                    document.createElement("div");


                item.className =
                    "transaction";


                var icon =
                    document.createElement("div");

                icon.className =
                    "transaction-icon";


                if (
                    transaction.type ===
                    "income"
                ) {

                    icon.textContent = "↓";

                }

                else if (
                    transaction.type ===
                    "expense"
                ) {

                    icon.textContent = "↑";

                }

                else {

                    icon.textContent = "↔";

                }


                var info =
                    document.createElement("div");

                info.className =
                    "transaction-info";


                var title =
                    document.createElement("strong");

                title.textContent =
                    transaction.description;


                var details =
                    document.createElement("small");

                details.textContent =
                    transaction.category +
                    " • " +
                    transaction.date;


                info.appendChild(title);

                info.appendChild(details);


                var right =
                    document.createElement("div");

                right.className =
                    "transaction-right";


                var amount =
                    document.createElement("div");


                if (
                    transaction.type ===
                    "income"
                ) {

                    amount.className =
                        "transaction-amount income";

                    amount.textContent =
                        "+" +
                        money(
                            transaction.amount
                        );

                }

                else if (
                    transaction.type ===
                    "expense"
                ) {

                    amount.className =
                        "transaction-amount expense";

                    amount.textContent =
                        "-" +
                        money(
                            transaction.amount
                        );

                }

                else {

                    amount.className =
                        "transaction-amount";

                    amount.textContent =
                        money(
                            transaction.amount
                        );

                }var editButton =
    document.createElement("button");

editButton.className =
    "edit-button";

editButton.textContent =
    "Edit";

editButton.addEventListener(
    "click",
    function () {

        editTransaction(
            transaction.id
        );

    }
);


              var deleteButton =
                    document.createElement("button");


                deleteButton.className =
                    "delete-button";


                deleteButton.textContent =
                    "Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteTransaction(
                            transaction.id
                        );

                    }
                );


right.appendChild(amount);

right.appendChild(
    editButton
);

right.appendChild(
    deleteButton
);


                item.appendChild(icon);

                item.appendChild(info);

                item.appendChild(right);


                transactionList.appendChild(
                    item
                );

            }
        );

    }


    /* UPDATE EVERYTHING */

    function updatePage() {

        loadCurrency();

        updateSummary();

        displayTransactions();

    }


    /* MESSAGE */

    function showMessage(text) {

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


    /* SEARCH */

    searchInput.addEventListener(
        "input",
        displayTransactions
    );


    typeFilter.addEventListener(
        "change",
        displayTransactions
    );


    categoryFilter.addEventListener(
        "change",
        displayTransactions
    );


    /* START */

    setToday();

    updatePage();

});