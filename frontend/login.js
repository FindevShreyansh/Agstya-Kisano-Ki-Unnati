/* =========================================
   AGSTYA LOGIN PAGE JAVASCRIPT
   ========================================= */

const API_BASE_URL = window.AGSTYA_API_URL || "http://localhost:8080/api";
const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

const togglePassword = document.getElementById("togglePassword");

const successMessage = document.getElementById("successMessage");
const loginButton = document.getElementById("loginButton");

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

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Clear old messages
    emailError.textContent = "";
    passwordError.textContent = "";
    successMessage.style.display = "none";
    successMessage.style.backgroundColor = "";
    successMessage.style.color = "";

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


    if (isValid) {
        loginButton.disabled = true;
        loginButton.textContent = "Logging in...";

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to log in.");
            }

            localStorage.setItem("agstyaAuth", JSON.stringify(data));
            successMessage.textContent = "Login successful. Redirecting...";
            successMessage.style.display = "block";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 600);
        } catch (error) {
            successMessage.textContent = error.message.includes("Failed to fetch")
                ? "Unable to connect to the server. Please start the backend and try again."
                : error.message;
            successMessage.style.display = "block";
            successMessage.style.backgroundColor = "#fff0ef";
            successMessage.style.color = "#a52820";
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }
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
