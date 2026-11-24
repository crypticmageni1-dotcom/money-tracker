document.addEventListener("DOMContentLoaded", function () {

    /* ===============================
       ELEMENTS
    =============================== */

    const productName =
        document.getElementById("productName");

    const buyPrice =
        document.getElementById("buyPrice");

    const sellPrice =
        document.getElementById("sellPrice");

    const quantity =
        document.getElementById("quantity");

    const addProduct =
        document.getElementById("addProduct");

    const productList =
        document.getElementById("productList");

    const totalProducts =
        document.getElementById("totalProducts");

    const stockValue =
        document.getElementById("stockValue");

    const expectedProfit =
        document.getElementById("expectedProfit");

    const expectedRevenue =
        document.getElementById("expectedRevenue");

    const searchProduct =
        document.getElementById("searchProduct");


    /* ===============================
       LOAD PRODUCTS
    =============================== */

    let products = [];

    try {

        products =
            JSON.parse(
                localStorage.getItem(
                    "mtracker_inventory"
                )
            ) || [];

    } catch (error) {

        products = [];

    }


    /* ===============================
       SAVE PRODUCTS
    =============================== */

    function saveProducts() {

        localStorage.setItem(
            "mtracker_inventory",
            JSON.stringify(products)
        );

    }


    /* ===============================
       MONEY
    =============================== */

    function money(value) {

        return "KSh " +
            Number(value || 0).toLocaleString();

    }


    /* ===============================
       SUMMARY
    =============================== */

    function updateSummary() {

        let value = 0;
        let revenue = 0;
        let profit = 0;

        products.forEach(function (product) {

            const buy =
                Number(product.buyPrice) || 0;

            const sell =
                Number(product.sellPrice) || 0;

            const qty =
                Number(product.quantity) || 0;

            value += buy * qty;

            revenue += sell * qty;

            profit +=
                (sell - buy) * qty;

        });


        if (totalProducts) {

            totalProducts.textContent =
                products.length;

        }


        if (stockValue) {

            stockValue.textContent =
                money(value);

        }


        if (expectedRevenue) {

            expectedRevenue.textContent =
                money(revenue);

        }


        if (expectedProfit) {

            expectedProfit.textContent =
                money(profit);

        }

    }    /* ===============================
       DISPLAY PRODUCTS
    =============================== */

    function displayProducts() {

        updateSummary();

        if (!productList) {
            return;
        }

        productList.innerHTML = "";


        let displayedProducts =
            products.slice();


        /* SEARCH */

        if (searchProduct) {

            const search =
                searchProduct.value
                    .trim()
                    .toLowerCase();

            if (search) {

                displayedProducts =
                    products.filter(
                        function (product) {

                            return product.name
                                .toLowerCase()
                                .includes(search);

                        }
                    );

            }

        }


        /* EMPTY */

        if (displayedProducts.length === 0) {

            const empty =
                document.createElement("div");

            empty.className = "empty";

            empty.innerHTML =
                products.length === 0
                ? "📦 No products yet.<br><br>Add your first product above."
                : "🔍 No products match your search.";

            productList.appendChild(empty);

            return;

        }


        /* PRODUCTS */

        displayedProducts.forEach(
            function (product) {

                const actualIndex =
                    products.indexOf(product);


                const card =
                    document.createElement("div");

                card.className =
                    "product";


                const buy =
                    Number(product.buyPrice) || 0;

                const sell =
                    Number(product.sellPrice) || 0;

                const qty =
                    Number(product.quantity) || 0;

                const profit =
                    sell - buy;


                /* STOCK STATUS */

                let statusText =
                    "In Stock";

                let statusClass =
                    "stock";


                if (qty <= 0) {

                    statusText =
                        "Out of Stock";

                    statusClass =
                        "stock out-stock";

                } else if (qty <= 5) {

                    statusText =
                        "Low Stock";

                    statusClass =
                        "stock low-stock";

                }


                card.innerHTML = `

                    <div class="product-icon">
                        📦
                    </div>

                    <div class="product-info">

                        <strong>
                            ${escapeHTML(product.name)}
                        </strong>

                        <small>
                            Buy ${money(buy)}
                            • Sell ${money(sell)}
                        </small>

                        <small>
                            Profit/item:
                            ${money(profit)}
                        </small>

                    </div>

                    <div class="product-right">

                        <strong>
                            ${qty} units
                        </strong>

                        <span class="${statusClass}">
                            ${statusText}
                        </span>

                        <button
                            class="edit-product"
                            data-index="${actualIndex}"
                            type="button">

                            ✏️

                        </button>

                        <button
                            class="delete-product"
                            data-index="${actualIndex}"
                            type="button">

                            🗑️

                        </button>

                    </div>

                `;


                productList.appendChild(card);

            }
        );

    }


    /* ===============================
       ESCAPE HTML
    =============================== */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;

    }    /* ===============================
       ADD PRODUCT
    =============================== */

    if (addProduct) {

        addProduct.addEventListener(
            "click",
            function () {

                const name =
                    productName.value.trim();

                const buy =
                    Number(buyPrice.value);

                const sell =
                    Number(sellPrice.value);

                const qty =
                    Number(quantity.value);


                if (!name) {

                    alert(
                        "Please enter a product name."
                    );

                    return;

                }


                if (
                    !Number.isFinite(buy) ||
                    buy < 0
                ) {

                    alert(
                        "Please enter a valid buying price."
                    );

                    return;

                }


                if (
                    !Number.isFinite(sell) ||
                    sell < 0
                ) {

                    alert(
                        "Please enter a valid selling price."
                    );

                    return;

                }


                if (
                    !Number.isInteger(qty) ||
                    qty < 0
                ) {

                    alert(
                        "Please enter a valid quantity."
                    );

                    return;

                }


                products.push({

                    name: name,

                    buyPrice: buy,

                    sellPrice: sell,

                    quantity: qty

                });


                saveProducts();

                displayProducts();


                productName.value = "";

                buyPrice.value = "";

                sellPrice.value = "";

                quantity.value = "";

            }
        );

    }


    /* ===============================
       EDIT / DELETE
    =============================== */

    if (productList) {

        productList.addEventListener(
            "click",
            function (event) {

                const editButton =
                    event.target.closest(
                        ".edit-product"
                    );

                const deleteButton =
                    event.target.closest(
                        ".delete-product"
                    );


                /* EDIT */

                if (editButton) {

                    const index =
                        Number(
                            editButton.dataset.index
                        );

                    const product =
                        products[index];


                    if (!product) {
                        return;
                    }


                    const newName =
                        prompt(
                            "Product name:",
                            product.name
                        );


                    if (
                        newName === null ||
                        !newName.trim()
                    ) {

                        return;

                    }


                    const newBuy =
                        prompt(
                            "Buying price:",
                            product.buyPrice
                        );


                    if (newBuy === null) {
                        return;
                    }


                    const newSell =
                        prompt(
                            "Selling price:",
                            product.sellPrice
                        );


                    if (newSell === null) {
                        return;
                    }


                    const newQuantity =
                        prompt(
                            "Quantity:",
                            product.quantity
                        );


                    if (newQuantity === null) {
                        return;
                    }


                    const buy =
                        Number(newBuy);

                    const sell =
                        Number(newSell);

                    const qty =
                        Number(newQuantity);


                    if (
                        !Number.isFinite(buy) ||
                        buy < 0 ||
                        !Number.isFinite(sell) ||
                        sell < 0 ||
                        !Number.isInteger(qty) ||
                        qty < 0
                    ) {

                        alert(
                            "Please enter valid product information."
                        );

                        return;

                    }


                    products[index] = {

                        name:
                            newName.trim(),

                        buyPrice:
                            buy,

                        sellPrice:
                            sell,

                        quantity:
                            qty

                    };


                    saveProducts();

                    displayProducts();

                }


                /* DELETE */

                if (deleteButton) {

                    const index =
                        Number(
                            deleteButton.dataset.index
                        );


                    if (!products[index]) {
                        return;
                    }


                    const confirmed =
                        confirm(
                            "Delete " +
                            products[index].name +
                            " from inventory?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    products.splice(
                        index,
                        1
                    );


                    saveProducts();

                    displayProducts();

                }

            }
        );

    }    /* ===============================
       SEARCH
    =============================== */

    if (searchProduct) {

        searchProduct.addEventListener(
            "input",
            function () {

                displayProducts();

            }
        );

    }


    /* ===============================
       START
    =============================== */

    displayProducts();

});