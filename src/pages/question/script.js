import { getQuestion, submitAnswer, skipQuestion } from '../../api.js';

async function displayQuestion() {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');

  try {
    const question = await getQuestion(session);
    console.log('Question object:', question);
    const questionTextElement = document.getElementById('questionText');
    questionTextElement.innerHTML = question.questionText;
  } catch (error) {
    console.error('Error fetching question:', error);
  }
}

document.getElementById('submitButton').addEventListener('click', async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');
  const answer = document.getElementById('answer').value;

  try {
    const result = await submitAnswer(session, answer);
    console.log('Submit result:', result);
    alert(result.message); // Display message from API

    if (result.correct && !result.completed) {
      displayQuestion(); // Load the next question
    } else if (result.completed) {
      window.location.href = `../leaderboard/index.html?session=${session}`; // Redirect to leaderboard with session
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
  }
});

document.getElementById('skipButton').addEventListener('click', async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');

  try {
    const result = await skipQuestion(session);
    console.log('Skip result:', result);
    displayQuestion(); // Load the next question
  } catch (error) {
    console.error('Error skipping question:', error);
  }
});

displayQuestion();

// Force update location before answering location-sensitive questions
async function forceLocationUpdate() {
  try {
    await getLocation();
    await sendLocation();
    return true;
  } catch (error) {
    console.error('Failed to update location:', error);
    return false;
  }
}