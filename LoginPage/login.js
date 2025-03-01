
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

// Function to get a Cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let cookiesArray = document.cookie.split(";");
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

// Check if user is already logged in
document.addEventListener("DOMContentLoaded", () => {
    const savedUsername = getCookie("Username");
    const savedEmail = getCookie("Email");

    if (savedUsername && savedEmail) {
        // Auto-login if cookies exist
        window.location.href = "/game";
    }
});

document.getElementById("LoginForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("Username").value.trim();
    const email = document.getElementById("Email").value.trim();
    const errorMessage = document.getElementById("Error-Message");

    if (!username || !email) {
        errorMessage.textContent = "Both fields are required.";
        return;
    }

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errorMessage.textContent = "Please enter a valid email address.";
        return;
    }

    // Save credentials in cookies for 30 days
    setCookie("Username", username, 30);
    setCookie("Email", email, 30);

    // Redirect to game
    window.location.href = "game.html";
});