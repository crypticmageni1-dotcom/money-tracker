document.addEventListener("DOMContentLoaded", function () {

    var businessName =
        document.getElementById("businessName");

    var pageBusinessName =
        document.getElementById("pageBusinessName");

    var businessType =
        document.getElementById("businessType");

    var businessNameInput =
        document.getElementById("businessNameInput");

    var businessTypeInput =
        document.getElementById("businessTypeInput");

    var editButton =
        document.getElementById("editButton");

    var saveButton =
        document.getElementById("saveButton");

    var editor =
        document.getElementById("editor");

    var revenue =
        document.getElementById("revenue");

    var expenses =
        document.getElementById("expenses");

    var profit =
        document.getElementById("profit");

    var transactionCount =
        document.getElementById("transactionCount");

    var plIncome =
        document.getElementById("plIncome");

    var plExpenses =
        document.getElementById("plExpenses");

    var netProfit =
        document.getElementById("netProfit");

    function money(value) {
        return "KSh " +
            Number(value).toLocaleString();
    }

    function loadBusiness() {

        var saved =
            localStorage.getItem("mtracker_business");

        if (!saved) return;

        var data =
            JSON.parse(saved);

        businessName.textContent =
            data.name;

        pageBusinessName.textContent =
            data.name;

        businessType.textContent =
            data.type;

        businessNameInput.value =
            data.name;

        businessTypeInput.value =
            data.type;
    }

    function saveBusiness() {

        var data = {

            name:
                businessNameInput.value || "My Business",

            type:
                businessTypeInput.value

        };

        localStorage.setItem(
            "mtracker_business",
            JSON.stringify(data)
        );

        loadBusiness();

        editor.style.display = "none";
    }

    editButton.addEventListener(
        "click",
        function () {

            if (editor.style.display === "block") {

                editor.style.display = "none";

            } else {

                editor.style.display = "block";

            }

        }
    );

    saveButton.addEventListener(
        "click",
        saveBusiness
    );

    function updateFinancials() {

        var transactions =
            JSON.parse(
                localStorage.getItem(
                    "mtracker_transactions"
                ) || "[]"
            );

        var income = 0;
        var expense = 0;

        transactions.forEach(function (item) {

            if (item.type === "income") {

                income +=
                    Number(item.amount);

            }

            if (item.type === "expense") {

                expense +=
                    Number(item.amount);

            }

        });

        var total =
            income - expense;

        revenue.textContent =
            money(income);

        expenses.textContent =
            money(expense);

        profit.textContent =
            money(total);

        transactionCount.textContent =
            transactions.length;

        plIncome.textContent =
            money(income);

        plExpenses.textContent =
            money(expense);

        netProfit.textContent =
            money(total);
    }

    loadBusiness();

    updateFinancials();

    window.addEventListener(
        "focus",
        updateFinancials
    );

});