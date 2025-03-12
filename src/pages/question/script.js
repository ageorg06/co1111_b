import { getQuestion, submitAnswer, skipQuestion, updateLocation } from '../../services/api.js';
import locationService from '../../services/locationService.js';

let currentQuestion = null;

async function displayQuestion() {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');

  try {
    const question = await getQuestion(session);
    console.log('Question object:', question);
    currentQuestion = question;

    const questionTextElement = document.getElementById('questionText');
    const answerOptionsElement = document.getElementById('answerOptions');
    const answerInput = document.getElementById('answer');

    questionTextElement.innerHTML = question.questionText;
    answerOptionsElement.innerHTML = ''; // Clear previous options

    // Handle different question types
    switch (question.questionType) {
      case 'BOOLEAN':
        answerInput.style.display = 'none';
        answerOptionsElement.className = 'answer-options boolean-options';
        const options = ['TRUE', 'FALSE'];
        options.forEach(option => {
          const button = document.createElement('button');
          button.className = 'answer-button';
          button.textContent = option;
          button.onclick = () => {
            // Remove selected class from all buttons
            answerOptionsElement.querySelectorAll('.answer-button').forEach(btn => {
              btn.classList.remove('selected');
            });
            // Add selected class to clicked button
            button.classList.add('selected');
            answerInput.value = option;
          };
          answerOptionsElement.appendChild(button);
        });
        break;

      case 'MCQ':
        answerInput.style.display = 'none';
        answerOptionsElement.className = 'answer-options';
        const mcqOptions = ['A', 'B', 'C', 'D'];
        mcqOptions.forEach(option => {
          const button = document.createElement('button');
          button.className = 'answer-button';
          button.textContent = option;
          button.onclick = () => {
            // Remove selected class from all buttons
            answerOptionsElement.querySelectorAll('.answer-button').forEach(btn => {
              btn.classList.remove('selected');
            });
            // Add selected class to clicked button
            button.classList.add('selected');
            answerInput.value = option;
          };
          answerOptionsElement.appendChild(button);
        });
        break;

      default:
        // For all other question types (INTEGER, NUMERIC, TEXT)
        answerInput.style.display = 'block';
        answerOptionsElement.className = 'answer-options';
        answerOptionsElement.innerHTML = ''; // Clear any existing options
        answerInput.value = ''; // Clear the input
        break;
    }

    // Show or hide the location warning based on question requirements
    const locationWarning = document.getElementById('locationWarning');
    if (question.requiresLocation) {
      locationWarning.style.display = 'block';
      // Start location updates if this is a location-sensitive question
      locationService.startUpdates();
    } else {
      locationWarning.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching question:', error);
  }
}

document.getElementById('submitButton').addEventListener('click', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');
  const answer = document.getElementById('answer').value;

  try {
    // If question requires location, update location before submitting
    if (currentQuestion && currentQuestion.requiresLocation) {
      // Force a location update before submitting
      await locationService.getLocation();

      // Get the location and send it to the server
      if (locationService.userLocation) {
        try {
          await updateLocation(
            session,
            locationService.userLocation.latitude,
            locationService.userLocation.longitude
          );
          console.log("Location updated before answer submission");
        } catch (locError) {
          console.error("Failed to update location:", locError);
          alert("Failed to update your location. Please ensure location services are enabled.");
          return; // Stop submission if location update fails
        }
      } else {
        alert("Unable to get your location. Please ensure location services are enabled.");
        return; // Stop submission if location is not available
      }
    }

    // Submit the answer
    const result = await submitAnswer(session, answer);
    console.log('Submit result:', result);
    alert(result.message || 'Answer submitted!'); // Display message from API

    if (result.correct && !result.completed) {
      document.getElementById('answer').value = ''; // Clear the answer field
      displayQuestion(); // Load the next question
    } else if (result.completed) {
      window.location.href = `../leaderboard/index.html?session=${session}`; // Redirect to leaderboard with session
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    alert(`Error: ${error.message}`);
  }
});

document.getElementById('skipButton').addEventListener('click', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');

  try {
    const result = await skipQuestion(session);
    console.log('Skip result:', result);
    document.getElementById('answer').value = ''; // Clear the answer field
    alert(result.message || 'Question skipped!');
    displayQuestion(); // Load the next question
  } catch (error) {
    console.error('Error skipping question:', error);
    alert(`Error: ${error.message}`);
  }
});

// Initialize location service when the page loads
document.addEventListener('DOMContentLoaded', function () {
  // Start the location service
  locationService.getLocation().then(() => {
    console.log("Initial location retrieved");
  }).catch(error => {
    console.error("Error getting initial location:", error);
  });

  // Display the question
  displayQuestion();
});

// Make sure to stop location updates when leaving the page
window.addEventListener('beforeunload', function () {
  locationService.stopUpdates();
});