// ===== contact.js =====
// 1. Dark / light theme toggle
// 2. Live form validation with error messages
// 3. Show / hide FAQ accordion

/* ---------- 1. Theme toggle ---------- */
const themeButton = document.getElementById("theme-toggle");

function setTheme(isDark) {
    document.body.classList.toggle("dark", isDark);
    themeButton.textContent = isDark ? "Light mode" : "Dark mode";
    themeButton.setAttribute("aria-pressed", isDark);
}

// remember the choice (wrapped in try because storage can be blocked)
try {
    if (localStorage.getItem("bole-theme") === "dark") {
        setTheme(true);
    }
} catch (e) {
    // ignore, just use the light theme
}

themeButton.addEventListener("click", function () {
    const isDark = !document.body.classList.contains("dark");
    setTheme(isDark);
    try {
        localStorage.setItem("bole-theme", isDark ? "dark" : "light");
    } catch (e) {
        // ignore
    }
});

/* ---------- 2. Live form validation ---------- */
const form = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const topicInput = document.getElementById("topic");
const messageInput = document.getElementById("message");
const charCount = document.getElementById("char-count");
const formStatus = document.getElementById("form-status");

// each check returns an error message, or "" if the value is fine
function checkName() {
    const value = nameInput.value.trim();
    if (value === "") return "Please enter your name.";
    if (value.length < 3) return "Name must be at least 3 characters.";
    return "";
}

function checkEmail() {
    const value = emailInput.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === "") return "Please enter your email.";
    if (!pattern.test(value)) return "That email doesn't look right (e.g. name@company.com).";
    return "";
}

function checkPhone() {
    const value = phoneInput.value.trim();
    // phone is optional, but if typed it should only use digits, spaces, + - ( )
    if (value !== "" && !/^[0-9+\-()\s]{7,20}$/.test(value)) {
        return "Use digits only, 7 to 20 characters.";
    }
    return "";
}

function checkTopic() {
    if (topicInput.value === "") return "Please choose a topic.";
    return "";
}

function checkMessage() {
    const length = messageInput.value.trim().length;
    if (length === 0) return "Please write a message.";
    if (length < 20) return "Message needs " + (20 - length) + " more characters.";
    return "";
}

// show or clear the error under one field
function showResult(input, checkFunction) {
    const message = checkFunction();
    const errorBox = document.getElementById(input.id + "-error");
    errorBox.textContent = message;

    if (message === "") {
        input.classList.remove("invalid");
        // only mark optional empty fields as neutral, not green
        input.classList.toggle("valid", input.value.trim() !== "");
    } else {
        input.classList.add("invalid");
        input.classList.remove("valid");
    }
    return message === "";
}

const fields = [
    { input: nameInput, check: checkName },
    { input: emailInput, check: checkEmail },
    { input: phoneInput, check: checkPhone },
    { input: topicInput, check: checkTopic },
    { input: messageInput, check: checkMessage }
];

// validate while the user types (after they have left the field once)
fields.forEach(function (field) {
    field.input.addEventListener("blur", function () {
        field.input.dataset.touched = "yes";
        showResult(field.input, field.check);
    });

    field.input.addEventListener("input", function () {
        if (field.input.dataset.touched === "yes") {
            showResult(field.input, field.check);
        }
    });

    field.input.addEventListener("change", function () {
        showResult(field.input, field.check);
    });
});

// live character counter for the message box
messageInput.addEventListener("input", function () {
    charCount.textContent = messageInput.value.length + " / 500";
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let allGood = true;
    fields.forEach(function (field) {
        field.input.dataset.touched = "yes";
        if (!showResult(field.input, field.check)) {
            allGood = false;
        }
    });

    if (allGood) {
        formStatus.textContent = "Thanks " + nameInput.value.trim() + "! We will reply within 2 working days.";
        formStatus.className = "form-status success";
        form.reset();
        charCount.textContent = "0 / 500";
        fields.forEach(function (field) {
            field.input.classList.remove("valid", "invalid");
            field.input.dataset.touched = "";
        });
    } else {
        formStatus.textContent = "Please fix the errors above.";
        formStatus.className = "form-status fail";
        // move focus to the first wrong field
        form.querySelector(".invalid").focus();
    }
});

/* ---------- 3. FAQ accordion ---------- */
const questions = document.querySelectorAll(".faq-question");

questions.forEach(function (question) {
    question.addEventListener("click", function () {
        const answer = question.nextElementSibling;
        const isOpen = question.getAttribute("aria-expanded") === "true";

        // close every answer first so only one is open at a time
        questions.forEach(function (other) {
            other.setAttribute("aria-expanded", "false");
            other.nextElementSibling.hidden = true;
        });

        if (!isOpen) {
            question.setAttribute("aria-expanded", "true");
            answer.hidden = false;
        }
    });
});
