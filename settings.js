document.addEventListener("DOMContentLoaded", function () {

    var currency =
        document.getElementById("currency");

    var hideBalance =
        document.getElementById("hideBalance");

    var pinEnabled =
        document.getElementById("pinEnabled");

    var pinArea =
        document.getElementById("pinArea");

    var pin =
        document.getElementById("pin");

    var savePin =
        document.getElementById("savePin");

    var exportData =
        document.getElementById("exportData");

    var importButton =
        document.getElementById("importButton");

    var importFile =
        document.getElementById("importFile");

    var clearData =
        document.getElementById("clearData");

    var message =
        document.getElementById("message");


    var defaultSettings = {

        currency: "KES",

        hideBalance: false,

        pinEnabled: false,

        pin: ""

    };


    function getSettings() {

        try {

            var saved =
                localStorage.getItem(
                    "mtracker_settings"
                );


            if (!saved) {
                return defaultSettings;
            }


            var data =
                JSON.parse(saved);


            return {

                currency:
                    data.currency ||
                    "KES",

                hideBalance:
                    data.hideBalance === true,

                pinEnabled:
                    data.pinEnabled === true,

                pin:
                    data.pin || ""

            };

        }

        catch (error) {

            return defaultSettings;

        }

    }


    function saveSettings(settings) {

        localStorage.setItem(
            "mtracker_settings",
            JSON.stringify(settings)
        );

    }


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


    /* LOAD */

    function loadSettings() {

        var settings =
            getSettings();


        currency.value =
            settings.currency;


        hideBalance.checked =
            settings.hideBalance;


        pinEnabled.checked =
            settings.pinEnabled;


        if (settings.pinEnabled) {

            pinArea.classList.add(
                "show"
            );

        }

    }


    /* CURRENCY */

    currency.addEventListener(
        "change",
        function () {

            var settings =
                getSettings();


            settings.currency =
                currency.value;


            saveSettings(
                settings
            );


            showMessage(
                "Currency saved."
            );

        }
    );


    /* HIDE BALANCE */

    hideBalance.addEventListener(
        "change",
        function () {

            var settings =
                getSettings();


            settings.hideBalance =
                hideBalance.checked;


            saveSettings(
                settings
            );


            showMessage(
                "Balance privacy setting saved."
            );

        }
    );


    /* PIN TOGGLE */

    pinEnabled.addEventListener(
        "change",
        function () {

            var settings =
                getSettings();


            if (pinEnabled.checked) {

                pinArea.classList.add(
                    "show"
                );


                settings.pinEnabled =
                    true;


                saveSettings(
                    settings
                );


                showMessage(
                    "Create your PIN below."
                );

            }

            else {

                var confirmed =
                    confirm(
                        "Disable PIN protection?"
                    );


                if (!confirmed) {

                    pinEnabled.checked =
                        true;

                    return;

                }


                settings.pinEnabled =
                    false;

                settings.pin =
                    "";


                saveSettings(
                    settings
                );


                pin.value = "";


                pinArea.classList.remove(
                    "show"
                );


                showMessage(
                    "PIN protection disabled."
                );

            }

        }
    );


    /* SAVE PIN */

    savePin.addEventListener(
        "click",
        function () {

            var value =
                pin.value.trim();


            if (!/^[0-9]{4,6}$/.test(value)) {

                showMessage(
                    "PIN must contain 4–6 numbers."
                );

                return;

            }


            var settings =
                getSettings();


            settings.pinEnabled =
                true;


            settings.pin =
                value;


            saveSettings(
                settings
            );


            pin.value = "";


            showMessage(
                "PIN saved successfully."
            );

        }
    );


    /* EXPORT */

    exportData.addEventListener(
        "click",
        function () {

            var backup = {

                app:
                    "M-Tracker",

                version:
                    "1.0",

                exportedAt:
                    new Date().toISOString(),

                transactions:
                    localStorage.getItem(
                        "mtracker_transactions"
                    ),

                budgets:
                    localStorage.getItem(
                        "mtracker_budgets"
                    ),

                settings:
                    localStorage.getItem(
                        "mtracker_settings"
                    )

            };


            var json =
                JSON.stringify(
                    backup,
                    null,
                    2
                );


            var blob =
                new Blob(
                    [json],
                    {
                        type:
                            "application/json"
                    }
                );


            var url =
                URL.createObjectURL(
                    blob
                );


            var link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                "mtracker-backup.json";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );


            showMessage(
                "Backup created successfully."
            );

        }
    );


    /* IMPORT */

    importButton.addEventListener(
        "click",
        function () {

            importFile.click();

        }
    );


    importFile.addEventListener(
        "change",
        function () {

            var file =
                importFile.files[0];


            if (!file) {
                return;
            }


            var reader =
                new FileReader();


            reader.onload =
                function (event) {

                    try {

                        var backup =
                            JSON.parse(
                                event.target.result
                            );


                        if (
                            backup.app !==
                            "M-Tracker"
                        ) {

                            showMessage(
                                "This is not a valid M-Tracker backup."
                            );

                            return;

                        }


                        if (
                            backup.transactions !==
                            null &&
                            backup.transactions !==
                            undefined
                        ) {

                            localStorage.setItem(
                                "mtracker_transactions",
                                backup.transactions
                            );

                        }


                        if (
                            backup.budgets !==
                            null &&
                            backup.budgets !==
                            undefined
                        ) {

                            localStorage.setItem(
                                "mtracker_budgets",
                                backup.budgets
                            );

                        }


                        if (
                            backup.settings !==
                            null &&
                            backup.settings !==
                            undefined
                        ) {

                            localStorage.setItem(
                                "mtracker_settings",
                                backup.settings
                            );

                        }


                        loadSettings();


                        showMessage(
                            "Backup imported successfully."
                        );

                    }

                    catch (error) {

                        showMessage(
                            "Could not read this backup."
                        );

                    }

                };


            reader.readAsText(
                file
            );


            importFile.value = "";

        }
    );


    /* CLEAR DATA */

    clearData.addEventListener(
        "click",
        function () {

            var first =
                confirm(
                    "This will delete your transactions and budgets. Continue?"
                );


            if (!first) {
                return;
            }


            var second =
                confirm(
                    "Are you absolutely sure? This action cannot be easily undone."
                );


            if (!second) {
                return;
            }


            localStorage.removeItem(
                "mtracker_transactions"
            );


            localStorage.removeItem(
                "mtracker_budgets"
            );


            showMessage(
                "Financial data has been cleared."
            );

        }
    );


    loadSettings();

});