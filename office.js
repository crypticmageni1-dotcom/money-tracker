document.addEventListener("DOMContentLoaded", function () {

    var invoiceCount =
        document.getElementById("invoiceCount");

    var billCount =
        document.getElementById("billCount");

    var receiptCount =
        document.getElementById("receiptCount");

    var officeSearch =
        document.getElementById("officeSearch");


    /*
     * Safely read a stored list.
     */

    function getList(key) {

        try {

            var saved =
                localStorage.getItem(key);

            if (!saved) {
                return [];
            }

            var data =
                JSON.parse(saved);

            if (Array.isArray(data)) {
                return data;
            }

        } catch (error) {

            console.log(
                "Could not read " + key
            );

        }

        return [];
    }


    /*
     * Update the document
     * counters.
     */

    function updateStatistics() {

        var invoices =
            getList("mtracker_invoices");

        var bills =
            getList("mtracker_bills");

        var receipts =
            getList("mtracker_receipts");


        invoiceCount.textContent =
            invoices.length;

        billCount.textContent =
            bills.length;

        receiptCount.textContent =
            receipts.length;
    }


    /*
     * Search preparation.
     *
     * For now this gives us
     * the search engine foundation.
     * We'll connect it to the
     * actual documents later.
     */

    officeSearch.addEventListener(
        "input",
        function () {

            var query =
                officeSearch.value
                    .trim()
                    .toLowerCase();


            if (query === "") {
                return;
            }


            console.log(
                "Searching M-Tracker Office for:",
                query
            );

        }
    );


    /*
     * Refresh the numbers when
     * returning to the page.
     */

    window.addEventListener(
        "focus",
        function () {

            updateStatistics();

        }
    );


    /*
     * Start.
     */

    updateStatistics();

});