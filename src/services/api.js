// api.js
const USE_TEST_API = false; // Change to false to use the actual API
const BASE_URL = USE_TEST_API ? 'https://codecyprus.org/th/test-api' : 'https://codecyprus.org/th/api';

// Function to fetch treasure hunts
async function getTreasureHunts(includeFinished) {
  // Implemented API call to /th/api/list
  console.log("Fetching treasure hunts...");
  // Set default value for includeFinished if not provided
  // Distinguish between an undefined value and other falsy values
  if (includeFinished === undefined) {
    includeFinished = false;
  }
  // Construct the URL
  let url = BASE_URL + "/list";
  if (includeFinished === true) {
    url = url + "?include-finished";
    // Will return all treasure hunts in the response, regardless of their status
  }
  // Send the request
  let response;
  // To handle potential errors
  try {
    response = await fetch(url);
    // If the fetch is successful
    console.log("Successfully received response from server");
  } catch (error) {
    // If an error occurs during the fetch
    console.error("Failed to fetch data:", error);
    // Stops the normal execution of the function
    throw error;
  }
  // Parse the response
  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error("Failed to parse response:", error);
    throw error;
  }
  // Check the status and return data or throw error
  if (data.status === "OK") {
    return data.treasureHunts;
  } else {
    let errorText = "";
    for (let i = 0; i < data.errorMessages.length; i++) {
      if (i > 0) {
        errorText += ", ";
      }
      errorText += data.errorMessages[i];
    }
    throw new Error(errorText);
  }
}

// Function to start a treasure hunt session
async function startTreasureHunt(player, app, treasureHuntId) {
  console.log(player, app, treasureHuntId);
  // Implemented API call to /th/api/start
  console.log("Starting treasure hunt session...");
  // Special characters should also be URL-encoded
  // Function encodeURIComponent() ->answers containing special characters are correctly transmitted to the server
  const url = `${BASE_URL}/start?player=${encodeURIComponent(player)}&app=${encodeURIComponent(app)}&treasure-hunt-id=${encodeURIComponent(treasureHuntId)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'OK') {
    return data.session;
  } else {
    throw new Error(data.errorMessages.join(', '));
  }
}

// Function to get the current question
async function getQuestion(session) {
  // Implemented API call to /th/api/question
  console.log("Getting current question...");
  const url = `${BASE_URL}/question?session=${encodeURIComponent(session)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'OK') {
    return data;
  } else {
    throw new Error(data.errorMessages.join(', '));
  }
}

// Function to submit an answer
async function submitAnswer(session, answer) {
  // Implemented API call to /th/api/answer
  console.log("Submitting answer...");
  const url = `${BASE_URL}/answer?session=${encodeURIComponent(session)}&answer=${encodeURIComponent(answer)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'OK') {
    return data;
  } else {
    throw new Error(data.errorMessages.join(', '));
  }
}

// Function to update the player's location
async function updateLocation(session, latitude, longitude) {
  // Implemented API call to /th/api/location
  console.log("Updating location...");
  const url = `${BASE_URL}/location?session=${encodeURIComponent(session)}&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'OK') {
    return data.message;
  } else {
    throw new Error(data.errorMessages.join(', '));
  }
}

// Function to skip the current question
async function skipQuestion(session) {
  // Implemented API call to /th/api/skip
  console.log("Skipping question...");
  const url = `${BASE_URL}/skip?session=${encodeURIComponent(session)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'OK') {
    return data;
  } else {
    throw new Error(data.errorMessages.join(', '));
  }
}

// Function to get the current score
async function getScore(session) {
  // Implemented API call to /th/api/score
  console.log("Getting score...");
  const url = `${BASE_URL}/score?session=${encodeURIComponent(session)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'OK') {
    return data;
  } else {
    throw new Error(data.errorMessages.join(', '));
  }
}

// Function to get the leaderboard
async function getLeaderboard(session, treasureHuntId, sorted=false, limit=null) {
  // Implemented API call to /th/api/leaderboard
  console.log("Getting leaderboard...");
  // let url = `${BASE_URL}/leaderboard?session=${session}`;
  // Add treasureHuntId alternative
  let url = `${BASE_URL}/leaderboard?`;
  if (session) {
    url += `session=${encodeURIComponent(session)}`;
  } else if (treasureHuntId) {
    url += `treasure-hunt-id=${encodeURIComponent(treasureHuntId)}`;
  } else {
    throw new Error("Provide session or treasureHuntId");
  }
  if (sorted) url += '&sorted';
  // if (limit) url += `&limit=${limit}`;
  // Check for number input
  if (Number.isInteger(limit) && limit > 0) {
    url += `&limit=${limit}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  if (data.status === 'OK') {
    return data;
  } else {
    throw new Error(data.errorMessages.join(', '));
  }
}

export { getTreasureHunts, startTreasureHunt, getQuestion, submitAnswer, updateLocation, skipQuestion, getScore, getLeaderboard };