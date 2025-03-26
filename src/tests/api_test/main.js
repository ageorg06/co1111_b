// Test functions for API endpoints defined in src/api.js
// Each function tests a specific API endpoint and updates the corresponding div with results
let sessionId = null;

// Function to test getTreasureHunts API
async function testGetTreasureHunts() {
    try {
        const treasureHunts = await getTreasureHunts();
        document.getElementById('treasureHuntsResult').innerText = "getTreasureHunts: " + JSON.stringify(treasureHunts, null, 2);
    } catch (error) {
        document.getElementById('treasureHuntsResult').innerText = "getTreasureHunts Error: " + error.message;
    }
}

// Function to test startTreasureHunt API with an error
async function testStartTreasureHunt() {
    try {
        const treasureHunts = await getTreasureHunts();
        if (treasureHunts && treasureHunts.length > 0) {
            const treasureHuntId = treasureHunts[1].uuid;
            const session = await startTreasureHunt("aek", "TestApp", treasureHuntId);
            console.log("startTreasureHunt (error): ", session);
            document.getElementById('startTreasureHuntResult').innerText = "startTreasureHunt (error): " + JSON.stringify(session, null, 2);
        } else {
            document.getElementById('startTreasureHuntResult').innerText = "No treasure hunts available.";
        }
    } catch (error) {
        console.error("startTreasureHunt (error) Error: ", error);
        document.getElementById('startTreasureHuntResult').innerText = "startTreasureHunt (error) Error: " + error.message;
    }
}

// Function to test startTreasureHunt API successfully
async function testStartTreasureHuntSuccess() {
    try {
        const treasureHunts = await getTreasureHunts();
        if (treasureHunts && treasureHunts.length > 0) {
            const treasureHuntId = treasureHunts[1].uuid;
            const session = await startTreasureHunt("kat", "TestApp", treasureHuntId);
            console.log("startTreasureHunt (success): ", session);
            document.getElementById('startTreasureHuntResult').innerText += "<br><br>startTreasureHunt (success): " + JSON.stringify(session, null, 2);
            sessionId = session; // Save the session ID
        } else {
            document.getElementById('startTreasureHuntResult').innerText += "<br><br>No treasure hunts available.";
        }
    } catch (error) {
        console.error("startTreasureHunt (success) Error: ", error);
        document.getElementById('startTreasureHuntResult').innerText += "<br><br>startTreasureHunt (success) Error: " + error.message;
    }
}

// Function to test getQuestion API
async function testGetQuestion() {
    try {
        const question = await getQuestion(sessionId);
        document.getElementById('questionResult').innerText = "getQuestion: " + JSON.stringify(question, null, 2);
    } catch (error) {
        document.getElementById('questionResult').innerText = "getQuestion Error: " + error.message;
    }
}

// Function to test submitAnswer API
async function testSubmitAnswer() {
    try {
        const answer = await submitAnswer(sessionId, "TestAnswer");
        document.getElementById('answerResult').innerText = "submitAnswer: " + JSON.stringify(answer, null, 2);
    } catch (error) {
        document.getElementById('answerResult').innerText = "submitAnswer Error: " + error.message;
    }
}

// Function to test getQuestion API with completed parameter
async function testGetQuestionCompleted() {
    try {
        const question = await getQuestion(sessionId + "?completed");
        document.getElementById('questionResult').innerText += "<br><br>getQuestion (completed): " + JSON.stringify(question, null, 2);
    } catch (error) {
        document.getElementById('questionResult').innerText += "<br><br>getQuestion (completed) Error: " + error.message;
    }
}

// Function to test getQuestion API with MCQ parameter
async function testGetQuestionMCQ() {
    try {
        const question = await getQuestion(sessionId + "?question-type=MCQ");
        document.getElementById('questionResult').innerText += "<br><br>getQuestion (MCQ): " + JSON.stringify(question, null, 2);
    } catch (error) {
        document.getElementById('questionResult').innerText += "<br><br>getQuestion (MCQ) Error: " + error.message;
    }
}

// Function to test updateLocation API
async function testUpdateLocation() {
    try {
        const message = await updateLocation(sessionId, 34.683646, 33.055391);
        document.getElementById('answerResult').innerText += "<br><br>updateLocation: " + JSON.stringify(message, null, 2);
    } catch (error) {
        document.getElementById('answerResult').innerText += "<br><br>updateLocation Error: " + error.message;
    }

    testUpdateLocation();
    testSkipQuestion();
    testGetScore();
    testGetLeaderboard();
}

// Function to test skipQuestion API
async function testSkipQuestion() {
    try {
        const result = await skipQuestion(sessionId);
        document.getElementById('answerResult').innerText += "<br><br>skipQuestion: " + JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('answerResult').innerText += "<br><br>skipQuestion Error: " + error.message;
    }
}

// Function to test getScore API
async function testGetScore() {
    try {
        const result = await getScore(sessionId);
        document.getElementById('answerResult').innerText += "<br><br>getScore: " + JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('answerResult').innerText += "<br><br>getScore Error: " + error.message;
    }
}

// Function to test getLeaderboard API
async function testGetLeaderboard() {
    try {
        const result = await getLeaderboard(sessionId);
        document.getElementById('answerResult').innerText += "<br><br>getLeaderboard: " + JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('answerResult').innerText += "<br><br>getLeaderboard Error: " + error.message;
    }
}

// Function to test submitAnswer API with correct parameter
async function testSubmitAnswerCorrect() {
    try {
        const answer = await submitAnswer(sessionId + "?correct", "TestAnswer");
        document.getElementById('answerResult').innerText += "<br><br>submitAnswer (correct): " + JSON.stringify(answer, null, 2);
    } catch (error) {
        document.getElementById('answerResult').innerText += "<br><br>submitAnswer (correct) Error: " + error.message;
    }
}

testGetTreasureHunts();
testStartTreasureHunt();
testStartTreasureHuntSuccess();
testGetQuestion();
testSubmitAnswer();
testGetQuestionCompleted();
testGetQuestionMCQ();
testSubmitAnswerCorrect();