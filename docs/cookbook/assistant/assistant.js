const responses = {
    "how do i play": "Ye must answer questions based on yer location to find treasure!",
    "hint": "Look closely at yer surroundings, matey!",
};

document.getElementById("hint").addEventListener("click", () => {
    // Display assistant response
    const chatLog = document.getElementById("chat-log");
    let answer = responses["hint"]
    chatLog.innerHTML += `<p><strong>Pirate-Bot:</strong> ${answer}</p>`;
});

document.getElementById("guide").addEventListener("click", () => {
    let answer = responses["how do i play"]
    const chatLog = document.getElementById("chat-log");
    chatLog.innerHTML += `<p><strong>Pirate-Bot:</strong> ${answer}</p>`;
});

document.getElementById("send-btn").addEventListener("click", () => {
    // Clear input field
    document.getElementById("chat-log").innerHTML = "";
});

