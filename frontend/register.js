const API_BASE_URL = window.AGSTYA_API_URL || "http://localhost:8080/api";

const registerForm = document.getElementById("registerForm");
const registerButton = document.getElementById("registerButton");
const formMessage = document.getElementById("formMessage");

const fields = {
    name: document.getElementById("name"),
    phone: document.getElementById("phone"),
    email: document.getElementById("email"),
    role: document.getElementById("role"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    terms: document.getElementById("terms")
};

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(field, message) {
    document.getElementById(`${field}Error`).textContent = message;
}

function clearErrors() {
    ["name", "phone", "email", "role", "password", "confirmPassword", "terms"]
        .forEach((field) => setError(field, ""));
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        const shouldShow = input.type === "password";
        input.type = shouldShow ? "text" : "password";
        button.textContent = shouldShow ? "🙈" : "👁";
        button.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password");
    });
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();
    formMessage.className = "form-message";

    const name = fields.name.value.trim();
    const phone = fields.phone.value.trim();
    const email = fields.email.value.trim().toLowerCase();
    const role = fields.role.value;
    const password = fields.password.value;
    const confirmPassword = fields.confirmPassword.value;
    let isValid = true;

    if (name.length < 2) {
        setError("name", "Please enter your full name.");
        isValid = false;
    }
    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
        setError("phone", "Please enter a valid phone number.");
        isValid = false;
    }
    if (!isValidEmail(email)) {
        setError("email", "Please enter a valid email address.");
        isValid = false;
    }
    if (!role) {
        setError("role", "Please select your role.");
        isValid = false;
    }
    if (password.length < 6) {
        setError("password", "Password must contain at least 6 characters.");
        isValid = false;
    }
    if (confirmPassword !== password) {
        setError("confirmPassword", "Passwords do not match.");
        isValid = false;
    }
    if (!fields.terms.checked) {
        setError("terms", "Please accept the statement to continue.");
        isValid = false;
    }
    if (!isValid) return;

    registerButton.disabled = true;
    registerButton.textContent = "Creating Account...";

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password, role })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to create your account.");
        }

        localStorage.setItem("agstyaAuth", JSON.stringify(data));
        showMessage("Account created successfully. Redirecting to the home page...", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 800);
    } catch (error) {
        showMessage(
            error.message.includes("Failed to fetch")
                ? "Unable to connect to the server. Please start the backend and try again."
                : error.message,
            "error"
        );
    } finally {
        registerButton.disabled = false;
        registerButton.textContent = "Create Account";
    }
});
