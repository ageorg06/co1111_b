// api.js

// Function to fetch treasure hunts
async function getTreasureHunts() {
    // TODO: Implement API call to /th/api/list
    console.log("Fetching treasure hunts...");
}

// Function to start a treasure hunt session
async function startTreasureHunt(player, app, treasureHuntId) {
    // TODO: Implement API call to /th/api/start
    console.log("Starting treasure hunt session...");
}

// Function to get the current question
async function getQuestion(session) {
    // TODO: Implement API call to /th/api/question
    console.log("Getting current question...");
}

// Function to submit an answer
async function submitAnswer(session, answer) {
    // TODO: Implement API call to /th/api/answer
    console.log("Submitting answer...");
}

// Function to update the player's location
async function updateLocation(session, latitude, longitude) {
    // TODO: Implement API call to /th/api/location
    console.log("Updating location...");
}

// Function to skip the current question
async function skipQuestion(session) {
    // TODO: Implement API call to /th/api/skip
    console.log("Skipping question...");
}

// Function to get the current score
async function getScore(session) {
    // TODO: Implement API call to /th/api/score
    console.log("Getting score...");
}

// Function to get the leaderboard
async function getLeaderboard(session, treasureHuntId, sorted, limit) {
    // TODO: Implement API call to /th/api/leaderboard
    console.log("Getting leaderboard...");
}