
// Array of tutorial steps
const tutorialSteps = [
    { id: "scoreDisplay", message: "Displays your current score in the game" },
    { id: "timerDisplay", message: "Shows the remaining time for the challenge" },
    { id: "questionText", message: "Displays the current question" },
    { id: "answer", message: "Type your answer here" },
    { id: "answerOptions", message: "Choose from available options for multiple choice questions" },
    { id: "submitButton", message: "Click to submit your answer" },
    { id: "skipButton", message: "Skip the current question if needed" },
    { id: "qrScanButton", message: "Scan a QR code if necessary for certain questions" },
    { id: "hintButton", message: "Get a hint to help answer the question" },
    { id: "exitButton", message: "Exit the game (your progress will be saved)" },
    { id: "leaderboardButton", message: "See how your score ranks compared to others" }
];

let currentStep = -1;

function createTutorialElements() {
    if (!document.getElementById("tutorialOverlay")) {
        const overlay = document.createElement("div");
        overlay.id = "tutorialOverlay";
        document.body.appendChild(overlay);
    }

    createTutorialNavigation();
}

function createTutorialNavigation() {

    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "tutorial-buttons";

    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.id = "tutorialNextButton";
    nextButton.onclick = showNextStep;

    const skipButton = document.createElement("button");
    skipButton.innerText = "Skip Tutorial";
    skipButton.onclick = endTutorial;

    buttonsContainer.appendChild(nextButton);
    buttonsContainer.appendChild(skipButton);

    const answerInput = document.getElementById("answer");
    answerInput.parentNode.insertBefore(buttonsContainer, answerInput.nextSibling);
}

function startTutorial() {
    createTutorialElements();

    currentStep = -1;
    showNextStep();

    window.addEventListener("resize", handleResize);
}

function handleResize() {
    const textCloud = document.querySelector(".text-cloud");
    const currentElement = document.querySelector(".highlight");

    if (textCloud && currentElement) {
        positionTextCloud(textCloud, currentElement);
    }
}

function showNextStep() {
    if (currentStep >= 0) {
        const prevElement = document.getElementById(tutorialSteps[currentStep]?.id);
        if (prevElement) prevElement.classList.remove("highlight");

        const textCloud = document.querySelector(".text-cloud");
        if (textCloud) textCloud.remove();
    }

    currentStep++;

    if (currentStep >= tutorialSteps.length) {
        endTutorial();
        const completionMsg = document.createElement("div");
        completionMsg.className = "text-cloud";
        completionMsg.style.position = "fixed";
        completionMsg.style.top = "50%";
        completionMsg.style.left = "50%";
        completionMsg.style.transform = "translate(-50%, -50%)";
        completionMsg.style.maxWidth = "300px";
        completionMsg.innerHTML = "<h3>Tutorial Complete!<span style=\"margin-right: 5px;\">🎓</span></h3>";
        document.body.appendChild(completionMsg);

        setTimeout(() => {
            completionMsg.remove();
        }, 3000);

        window.removeEventListener("resize", handleResize);

        return;
    }

    const step = tutorialSteps[currentStep];
    const element = document.getElementById(step.id);

    if (!element) {
        showNextStep();
        return;
    }

    element.classList.add("highlight");
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const cloud = document.createElement("div");
    cloud.className = "text-cloud";
    cloud.innerHTML = step.message;
    document.body.appendChild(cloud);

    positionTextCloud(cloud, element);

    if (currentStep === tutorialSteps.length - 1) {
        const nextButton = document.getElementById("tutorialNextButton");
        if (nextButton) nextButton.innerText = "Finish";
    }
}

function positionTextCloud(cloud, element) {
    if (!element || !cloud) return;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const cloudWidth = 200;

    let top, left;

    if (rect.top > 150) {
        top = rect.top + window.scrollY - 100;
        left = rect.left + window.scrollX + (rect.width / 2) - (cloudWidth / 2);
    }
    else if (viewportHeight - rect.bottom > 150) {
        top = rect.bottom + window.scrollY + 10;
        left = rect.left + window.scrollX + (rect.width / 2) - (cloudWidth / 2);
    }
    else {
        top = rect.top + window.scrollY + (rect.height / 2) - 50;
        left = rect.right + window.scrollX + 10;
    }

    if (left < 10) left = 10;
    if (left + cloudWidth > viewportWidth - 10) left = viewportWidth - cloudWidth - 10;

    cloud.style.top = `${top}px`;
    cloud.style.left = `${left}px`;
}

function endTutorial() {

    const highlighted = document.querySelector(".highlight");
    if (highlighted) highlighted.classList.remove("highlight");

    const textCloud = document.querySelector(".text-cloud");
    if (textCloud) textCloud.remove();

    const buttonsContainer = document.querySelector(".tutorial-buttons");
    if (buttonsContainer) buttonsContainer.remove();
}

document.addEventListener("DOMContentLoaded", () => {
    const tutorialButtons = document.querySelectorAll(".nav-icon");
    tutorialButtons.forEach(button => {
        if (button.textContent.trim().toLowerCase().includes("tutorial")) {
            button.id = "tutorialButton";
            button.addEventListener("click", startTutorial);
        }
    });
});



