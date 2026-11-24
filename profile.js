document.addEventListener("DOMContentLoaded", function () {

    var photoInput =
        document.getElementById("photoInput");

    var choosePhoto =
        document.getElementById("choosePhoto");

    var removePhoto =
        document.getElementById("removePhoto");

    var photoPreview =
        document.getElementById("photoPreview");

    var photoName =
        document.getElementById("photoName");

    var fullName =
        document.getElementById("fullName");

    var email =
        document.getElementById("email");

    var phone =
        document.getElementById("phone");

    var password =
        document.getElementById("password");

    var confirmPassword =
        document.getElementById("confirmPassword");

    var passwordEye =
        document.getElementById("passwordEye");

    var strengthFill =
        document.getElementById("strengthFill");

    var strengthText =
        document.getElementById("strengthText");

    var passwordStatus =
        document.getElementById("passwordStatus");

    var saveProfile =
        document.getElementById("saveProfile");

    var deleteProfile =
        document.getElementById("deleteProfile");

    var message =
        document.getElementById("message");

    var typeOptions =
        document.querySelectorAll(".type-option");


    var selectedAccountType =
        "personal";

    var profilePhoto =
        "";


    /* =========================
       MESSAGE
    ========================= */

    function showMessage(text) {

        message.textContent =
            text;

        setTimeout(function () {

            message.textContent =
                "";

        }, 2500);
    }


    /* =========================
       LOAD PROFILE
    ========================= */

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


            fullName.value =
                profile.fullName || "";


            email.value =
                profile.email || "";


            phone.value =
                profile.phone || "";


            selectedAccountType =
                profile.accountType ||
                "personal";


            profilePhoto =
                profile.photo || "";


            if (profilePhoto) {

                showPhoto(
                    profilePhoto
                );

            }


            typeOptions.forEach(
                function (option) {

                    option.classList.remove(
                        "active"
                    );


                    if (
                        option.dataset.type ===
                        selectedAccountType
                    ) {

                        option.classList.add(
                            "active"
                        );

                    }

                }
            );


            if (profile.passwordHash) {

                passwordStatus.textContent =
                    "SET";

            }

        }

        catch (error) {

            console.log(
                "Could not load profile."
            );

        }

    }


    /* =========================
       PROFILE PHOTO
    ========================= */

    choosePhoto.addEventListener(
        "click",
        function () {

            photoInput.click();

        }
    );


    photoInput.addEventListener(
        "change",
        function () {

            var file =
                photoInput.files[0];


            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                showMessage(
                    "Please choose an image."
                );

                return;
            }


            /*
             * Resize the picture before
             * saving it.
             *
             * This prevents huge photos
             * from filling localStorage.
             */

            var reader =
                new FileReader();


            reader.onload =
                function (event) {

                    resizeImage(
                        event.target.result,
                        function (compressedImage) {

                            profilePhoto =
                                compressedImage;

                            showPhoto(
                                compressedImage
                            );

                            showMessage(
                                "Profile photo selected."
                            );

                        }
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );


    function resizeImage(
        imageData,
        callback
    ) {

        var image =
            new Image();


        image.onload =
            function () {

                var maxSize =
                    500;

                var width =
                    image.width;

                var height =
                    image.height;


                if (
                    width >
                    height
                ) {

                    if (
                        width >
                        maxSize
                    ) {

                        height =
                            height *
                            maxSize /
                            width;

                        width =
                            maxSize;
                    }

                }

                else {

                    if (
                        height >
                        maxSize
                    ) {

                        width =
                            width *
                            maxSize /
                            height;

                        height =
                            maxSize;
                    }

                }


                var canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width =
                    width;

                canvas.height =
                    height;


                var context =
                    canvas.getContext(
                        "2d"
                    );


                context.drawImage(
                    image,
                    0,
                    0,
                    width,
                    height
                );


                callback(
                    canvas.toDataURL(
                        "image/jpeg",
                        0.75
                    )
                );

            };


        image.src =
            imageData;

    }


    function showPhoto(
        imageData
    ) {

        photoPreview.innerHTML =
            "";


        var image =
            document.createElement(
                "img"
            );


        image.src =
            imageData;


        image.alt =
            "Profile picture";


        photoPreview.appendChild(
            image
        );


        photoName.textContent =
            "Profile picture selected.";

    }


    removePhoto.addEventListener(
        "click",
        function () {

            profilePhoto =
                "";


            photoPreview.innerHTML =
                "M";


            photoName.textContent =
                "Add a profile picture";


            photoInput.value =
                "";


            showMessage(
                "Profile photo removed."
            );

        }
    );


    /* =========================
       ACCOUNT TYPE
    ========================= */

    typeOptions.forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {

                    typeOptions.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    option.classList.add(
                        "active"
                    );


                    selectedAccountType =
                        option.dataset.type;

                }
            );

        }
    );


    /* =========================
       SHOW / HIDE PASSWORD
    ========================= */

    passwordEye.addEventListener(
        "click",
        function () {

            if (
                password.type ===
                "password"
            ) {

                password.type =
                    "text";

                passwordEye.textContent =
                    "🙈";

            }

            else {

                password.type =
                    "password";

                passwordEye.textContent =
                    "👁️";

            }

        }
    );


    /* =========================
       PASSWORD STRENGTH
    ========================= */

    password.addEventListener(
        "input",
        function () {

            updatePasswordStrength(
                password.value
            );

        }
    );


    function updatePasswordStrength(
        value
    ) {

        if (!value) {

            strengthFill.style.width =
                "0%";

            strengthText.textContent =
                "Password not set";

            return;
        }


        var score = 0;


        if (
            value.length >= 8
        ) {
            score++;
        }


        if (
            /[A-Z]/.test(value)
        ) {
            score++;
        }


        if (
            /[a-z]/.test(value)
        ) {
            score++;
        }


        if (
            /[0-9]/.test(value)
        ) {
            score++;
        }


        if (
            /[^A-Za-z0-9]/.test(value)
        ) {
            score++;
        }


        var percentage =
            score * 20;


        strengthFill.style.width =
            percentage + "%";


        if (score <= 1) {

            strengthText.textContent =
                "Very weak password";

        }

        else if (score === 2) {

            strengthText.textContent =
                "Weak password";

        }

        else if (score === 3) {

            strengthText.textContent =
                "Moderate password";

        }

        else if (score === 4) {

            strengthText.textContent =
                "Strong password";

        }

        else {

            strengthText.textContent =
                "Very strong password";
        }

    }


    /* =========================
       PASSWORD HASH
    ========================= */

    async function hashPassword(
        value
    ) {

        /*
         * For this prototype we use
         * SHA-256 instead of saving
         * the plain password.
         */

        var encoder =
            new TextEncoder();


        var data =
            encoder.encode(
                value
            );


        var hash =
            await crypto.subtle.digest(
                "SHA-256",
                data
            );


        var bytes =
            new Uint8Array(
                hash
            );


        var result =
            "";


        bytes.forEach(
            function (byte) {

                result +=
                    byte
                        .toString(16)
                        .padStart(
                            2,
                            "0"
                        );

            }
        );


        return result;

    }


    /* =========================
       SAVE PROFILE
    ========================= */

    saveProfile.addEventListener(
        "click",
        async function () {

            var name =
                fullName.value.trim();

            var userEmail =
                email.value.trim();

            var userPhone =
                phone.value.trim();

            var newPassword =
                password.value;

            var confirmedPassword =
                confirmPassword.value;


            if (!name) {

                showMessage(
                    "Please enter your name."
                );

                fullName.focus();

                return;
            }


            if (
                userEmail &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(userEmail)
            ) {

                showMessage(
                    "Please enter a valid email."
                );

                email.focus();

                return;
            }


            /*
             * Only validate the password
             * if the user is entering one.
             */

            if (newPassword) {

                if (
                    newPassword.length <
                    8
                ) {

                    showMessage(
                        "Password must be at least 8 characters."
                    );

                    password.focus();

                    return;
                }


                if (
                    newPassword !==
                    confirmedPassword
                ) {

                    showMessage(
                        "Passwords do not match."
                    );

                    confirmPassword.focus();

                    return;
                }

            }


            var oldProfile = null;


            try {

                var saved =
                    localStorage.getItem(
                        "mtracker_profile"
                    );


                if (saved) {

                    oldProfile =
                        JSON.parse(saved);

                }

            }

            catch (error) {

                oldProfile = null;

            }


            var passwordHash =
                oldProfile &&
                oldProfile.passwordHash
                    ? oldProfile.passwordHash
                    : "";


            if (newPassword) {

                passwordHash =
                    await hashPassword(
                        newPassword
                    );

            }


            var profile = {

                fullName:
                    name,

                email:
                    userEmail,

                phone:
                    userPhone,

                accountType:
                    selectedAccountType,

                photo:
                    profilePhoto,

                passwordHash:
                    passwordHash,

                updatedAt:
                    new Date().toISOString()

            };


            try {

                localStorage.setItem(
                    "mtracker_profile",
                    JSON.stringify(
                        profile
                    )
                );


                password.value =
                    "";

                confirmPassword.value =
                    "";


                if (passwordHash) {

                    passwordStatus.textContent =
                        "SET";

                }


                showMessage(
                    "Profile saved successfully."
                );

            }

            catch (error) {

                showMessage(
                    "Could not save profile. The selected image may be too large."
                );

            }

        }
    );


    /* =========================
       DELETE PROFILE
    ========================= */

    deleteProfile.addEventListener(
        "click",
        function () {

            var confirmed =
                confirm(
                    "Delete your M-Tracker profile data from this device?"
                );


            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "mtracker_profile"
            );


            fullName.value =
                "";

            email.value =
                "";

            phone.value =
                "";

            password.value =
                "";

            confirmPassword.value =
                "";


            profilePhoto =
                "";


            selectedAccountType =
                "personal";


            photoPreview.innerHTML =
                "M";


            photoName.textContent =
                "Add a profile picture";


            passwordStatus.textContent =
                "Not set";


            typeOptions.forEach(
                function (option) {

                    option.classList.remove(
                        "active"
                    );


                    if (
                        option.dataset.type ===
                        "personal"
                    ) {

                        option.classList.add(
                            "active"
                        );

                    }

                }
            );


            showMessage(
                "Profile data deleted."
            );

        }
    );


    /* =========================
       START
    ========================= */

    loadProfile();

});