/* =========================================
   AGSTYA LOGIN PAGE JAVASCRIPT
   ========================================= */

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const togglePassword = document.getElementById("togglePassword");

const successMessage = document.getElementById("successMessage");

const forgotPassword = document.getElementById("forgotPassword");
const forgotModal = document.getElementById("forgotModal");
const closeModal = document.getElementById("closeModal");

const resetEmail = document.getElementById("resetEmail");
const resetError = document.getElementById("resetError");
const resetButton = document.getElementById("resetButton");
const resetSuccess = document.getElementById("resetSuccess");


/* =========================================
   SHOW / HIDE PASSWORD
   ========================================= */

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "🙈";

        togglePassword.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "👁";

        togglePassword.setAttribute(
            "aria-label",
            "Show password"
        );
    }

});


/* =========================================
   EMAIL VALIDATION
   ========================================= */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
}


/* =========================================
   LOGIN FORM
   ========================================= */

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Clear old messages
    emailError.textContent = "";
    passwordError.textContent = "";
    successMessage.style.display = "none";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    let isValid = true;


    /* Email validation */

    if (email === "") {

        emailError.textContent =
            "Please enter your email address.";

        isValid = false;

    } else if (!isValidEmail(email)) {

        emailError.textContent =
            "Please enter a valid email address.";

        isValid = false;
    }


    /* Password validation */

    if (password === "") {

        passwordError.textContent =
            "Please enter your password.";

        isValid = false;

    } else if (password.length < 6) {

        passwordError.textContent =
            "Password must contain at least 6 characters.";

        isValid = false;
    }


    /* Login success */

    if (isValid) {

        successMessage.textContent =
            "Login details are valid. Backend authentication will be connected later.";

        successMessage.style.display = "block";

        console.log("Login form submitted:", email);
    }

});


/* =========================================
   FORGOT PASSWORD MODAL
   ========================================= */

forgotPassword.addEventListener("click", function () {

    forgotModal.classList.add("active");

    resetEmail.focus();

});


/* =========================================
   CLOSE MODAL
   ========================================= */

closeModal.addEventListener("click", function () {

    forgotModal.classList.remove("active");

    resetError.textContent = "";

    resetSuccess.textContent = "";

    resetEmail.value = "";

});


/* =========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================= */

forgotModal.addEventListener("click", function (event) {

    if (event.target === forgotModal) {

        forgotModal.classList.remove("active");

    }

});


/* =========================================
   RESET PASSWORD
   ========================================= */

resetButton.addEventListener("click", function () {

    const email = resetEmail.value.trim();

    resetError.textContent = "";

    resetSuccess.textContent = "";


    if (email === "") {

        resetError.textContent =
            "Please enter your email address.";

        return;

    }


    if (!isValidEmail(email)) {

        resetError.textContent =
            "Please enter a valid email address.";

        return;

    }


    resetSuccess.textContent =
        "Reset link request submitted successfully.";

});
