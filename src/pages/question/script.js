import { getQuestion, submitAnswer, skipQuestion, updateLocation } from '../../services/api.js';
import locationService from '../../services/locationService.js';

let currentQuestion = null;
let questionTextElement;
let answerOptionsElement;
let answerInput;
let submitButton;
let skipButton;
let qrScanner = null;
let availableCameras = [];
let currentCameraIndex = 0;

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function () {
  // Initialize DOM elements
  questionTextElement = document.getElementById('questionText');
  answerOptionsElement = document.getElementById('answerOptions');
  answerInput = document.getElementById('answer');
  submitButton = document.getElementById('submitButton');
  skipButton = document.getElementById('skipButton');
  
  // Add input validation events
  answerInput.addEventListener('input', validateAnswer);

  // Exit button functionality
  const exitButton = document.getElementById('exitButton');
  const exitModal = document.getElementById('exitModal');
  const confirmExit = document.getElementById('confirmExit');
  const cancelExit = document.getElementById('cancelExit');

  if (exitButton) {
    exitButton.addEventListener('click', function() {
      exitModal.style.display = 'flex';
    });
  }

  if (confirmExit) {
    confirmExit.addEventListener('click', function() {
      window.location.href = '../../index.html'; // Redirect to home page
    });
  }

  if (cancelExit) {
    cancelExit.addEventListener('click', function() {
      exitModal.style.display = 'none';
    });
  }

  // Start the location service
  locationService.getLocation().then(() => {
    console.log("Initial location retrieved");
  }).catch(error => {
    console.error("Error getting initial location:", error);
  });

  // Initialize QR scanner
  initQRScanner();

  // Display the question
  displayQuestion();
});

// Validate answer based on question type
function validateAnswer() {
  if (!currentQuestion) return;
  
  const answer = answerInput.value.trim();
  let isValid = false;
  
  switch (currentQuestion.questionType) {
    case 'INTEGER':
      // Only allow numeric input and validate it's an integer
      const intValue = parseInt(answer);
      isValid = answer !== '' && !isNaN(intValue) && intValue.toString() === answer;
      break;
      
    case 'NUMERIC':
      // Allow decimal numbers
      const numValue = parseFloat(answer);
      isValid = answer !== '' && !isNaN(numValue);
      break;
      
    case 'TEXT':
      // Simple check for non-empty text
      isValid = answer !== '';
      break;
      
    case 'BOOLEAN':
    case 'MCQ':
      // For button-based selections, check if any option is selected
      isValid = answerOptionsElement.querySelector('.selected') !== null;
      break;
      
    default:
      isValid = answer !== '';
  }
  
  // Enable/disable submit button based on validation
  submitButton.disabled = !isValid;
  submitButton.classList.toggle('btn-disabled', !isValid);
  
  return isValid;
}

async function displayQuestion() {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');

  try {
    const question = await getQuestion(session);
    console.log('Question object:', question);
    console.log('Question type:', question.questionType);
    currentQuestion = question;

    questionTextElement.innerHTML = question.questionText;
    
    // Reset button states
    submitButton.disabled = true;
    submitButton.classList.add('btn-disabled');
    
    // Set skip button state based on question's skippable property
    if (question.skippable === false) {
      skipButton.disabled = true;
      skipButton.classList.add('btn-disabled');
    } else {
      skipButton.disabled = false;
      skipButton.classList.remove('btn-disabled');
    }
    
    // Handle different question types
    switch (question.questionType) {
      case 'BOOLEAN':
        console.log('BOOLEAN case');
        answerInput.style.display = 'none'; // Hide the text input
        answerOptionsElement.style.display = 'flex';
        answerOptionsElement.className = 'answer-options boolean-options';
        answerOptionsElement.innerHTML = ''; // Clear previous options
        
        // For BOOLEAN questions, ensure we're using proper case-sensitive values
        const options = ['TRUE', 'FALSE'];
        options.forEach(option => {
          const button = document.createElement('button');
          button.className = 'answer-button';
          button.textContent = option; // Display value
          button.setAttribute('data-value', option); // Store exact value as attribute
          button.onclick = () => {
            // Remove selected class from all buttons
            answerOptionsElement.querySelectorAll('.answer-button').forEach(btn => {
              btn.classList.remove('selected');
            });
            // Add selected class to clicked button
            button.classList.add('selected');
            
            // Store value in hidden input for consistency
            answerInput.value = option;
            console.log('BOOLEAN selection made:', option);
            
            // Enable submit button when an option is selected
            validateAnswer();
          };
          answerOptionsElement.appendChild(button);
        });
        break;

      case 'MCQ':
        console.log('MCQ case');
        answerInput.style.display = 'none';
        answerOptionsElement.style.display = 'flex';
        answerOptionsElement.className = 'answer-options';
        answerOptionsElement.innerHTML = ''; // Clear previous options
        
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
            
            // Enable submit button when an option is selected
            validateAnswer();
          };
          answerOptionsElement.appendChild(button);
        });
        break;

      case 'INTEGER':
        console.log('INTEGER case');
        answerInput.style.display = 'block';
        answerOptionsElement.style.display = 'none';
        answerInput.value = ''; // Clear the input
        answerInput.type = 'number';
        answerInput.pattern = '[0-9]*'; // For better mobile numeric keypad
        answerInput.inputmode = 'numeric';
        answerInput.step = '1';
        break;
        
      case 'NUMERIC':
        console.log('NUMERIC case');
        answerInput.style.display = 'block';
        answerOptionsElement.style.display = 'none';
        answerInput.value = ''; // Clear the input
        answerInput.type = 'number';
        answerInput.pattern = '[0-9]*\\.?[0-9]*'; // Allow decimals
        answerInput.inputmode = 'decimal';
        answerInput.step = 'any';
        break;
        
      case 'TEXT':
      default:
        console.log('TEXT or default case');
        // For text questions
        answerInput.style.display = 'block';
        answerOptionsElement.style.display = 'none';
        answerInput.value = ''; // Clear the input
        answerInput.type = 'text';
        answerInput.pattern = '';
        answerInput.inputmode = 'text';
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
    questionTextElement.innerHTML = 'Error loading question. Please try again.';
  }
}

// Initialize QR scanning functionality
function initQRScanner() {
  const qrScanButton = document.getElementById('qrScanButton');
  const qrScannerModal = document.getElementById('qrScannerModal');
  const qrPreview = document.getElementById('qrPreview');
  const startScanBtn = document.getElementById('startScanBtn');
  const switchCameraBtn = document.getElementById('switchCameraBtn');
  const closeScanBtn = document.getElementById('closeScanBtn');
  const qrResult = document.getElementById('qrResult');
  const qrContent = document.getElementById('qrContent');
  
  if (!qrScanButton) return; // Exit if button doesn't exist
  
  // QR scanner configuration
  const scannerOptions = {
    continuous: true,
    video: qrPreview,
    mirror: true,
    captureImage: false,
    backgroundScan: true,
    refractoryPeriod: 5000,
    scanPeriod: 1
  };
  
  // Open QR scanner modal
  qrScanButton.addEventListener('click', function() {
    qrScannerModal.style.display = 'flex';
    qrResult.style.display = 'none';
    qrPreview.style.display = 'none';
    
    // Reset state
    if (qrScanner) {
      qrScanner.stop();
    }
    
    switchCameraBtn.disabled = true;
  });
  
  // Start QR scanning
  startScanBtn.addEventListener('click', function() {
    // Initialize scanner if not done already
    if (!qrScanner) {
      qrScanner = new Instascan.Scanner(scannerOptions);
      
      // QR code detected handler
      qrScanner.addListener('scan', function(content) {
        console.log('QR Code detected:', content);
        
        // Display result
        qrContent.textContent = content;
        qrResult.style.display = 'block';
        
        // Copy to clipboard
        navigator.clipboard.writeText(content).catch(err => {
          console.error('Could not copy text: ', err);
        });
        
        // Fill answer input
        const answerInput = document.getElementById('answer');
        if (answerInput) {
          answerInput.value = content;
          
          // Trigger input event for validation
          const inputEvent = new Event('input', { bubbles: true });
          answerInput.dispatchEvent(inputEvent);
        }
        
        // Stop scanner
        qrScanner.stop();
        qrPreview.style.display = 'none';
        
        // Auto-close modal after delay
        setTimeout(() => {
          qrScannerModal.style.display = 'none';
          qrResult.style.display = 'none';
        }, 3000);
      });
    }
    
    // Get available cameras if not already fetched
    if (availableCameras.length === 0) {
      Instascan.Camera.getCameras().then(function(cameras) {
        availableCameras = cameras;
        
        if (cameras.length > 0) {
          // Enable camera switching if multiple cameras
          switchCameraBtn.disabled = cameras.length <= 1;
          
          // Start scanner with the first camera
          startQRScanner();
        } else {
          console.error('No cameras found.');
          qrResult.innerHTML = '<p style="color: #c62828;">No cameras found on your device.</p>';
          qrResult.style.display = 'block';
        }
      }).catch(function(error) {
        console.error('Error getting cameras:', error);
        qrResult.innerHTML = '<p style="color: #c62828;">Could not access the camera. Please allow camera permissions.</p>';
        qrResult.style.display = 'block';
      });
    } else {
      // Use already discovered cameras
      startQRScanner();
    }
  });
  
  // Function to start the QR scanner
  function startQRScanner() {
    if (availableCameras.length > 0) {
      qrResult.style.display = 'none';
      qrPreview.style.display = 'block';
      
      // Start with the current camera
      qrScanner.start(availableCameras[currentCameraIndex])
        .then(() => {
          console.log('Scanner started with camera:', currentCameraIndex);
        })
        .catch(error => {
          console.error('Failed to start scanner:', error);
          qrResult.innerHTML = `<p style="color: #c62828;">Failed to start camera: ${error.message}</p>`;
          qrResult.style.display = 'block';
        });
    }
  }
  
  // Switch between available cameras
  switchCameraBtn.addEventListener('click', function() {
    if (availableCameras.length > 1) {
      // Stop current scanner
      qrScanner.stop();
      
      // Switch to next camera
      currentCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
      
      // Start with new camera
      startQRScanner();
    }
  });
  
  // Close scanner modal
  closeScanBtn.addEventListener('click', function() {
    if (qrScanner) {
      qrScanner.stop();
    }
    qrScannerModal.style.display = 'none';
  });
}

document.getElementById('submitButton').addEventListener('click', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');
  
  // Always validate before submission
  if (!validateAnswer()) {
    return;
  }
  
  // Get the answer based on question type
  let answer;
  if (currentQuestion.questionType === 'BOOLEAN' || currentQuestion.questionType === 'MCQ') {
    // For button-based selections, get the selected button's text
    const selectedButton = answerOptionsElement.querySelector('.selected');
    if (selectedButton) {
      answer = selectedButton.textContent;
    } else {
      // Fallback to input value if no button is selected (shouldn't happen due to validation)
      answer = document.getElementById('answer').value;
    }
  } else {
    // For text/number inputs, get the input field value
    answer = document.getElementById('answer').value;
  }
  
  // Log the answer for debugging
  console.log('Submitting answer:', answer);

  // Validate that we have an answer to submit
  if (!answer || answer.trim() === '') {
    const feedbackElement = document.getElementById('answerFeedback');
    feedbackElement.textContent = 'Please provide an answer before submitting';
    feedbackElement.className = 'feedback-message incorrect';
    feedbackElement.style.display = 'block';
    
    setTimeout(() => {
      feedbackElement.style.display = 'none';
    }, 3000);
    return;
  }

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
          const feedbackElement = document.getElementById('answerFeedback');
          feedbackElement.textContent = "Failed to update your location. Please ensure location services are enabled.";
          feedbackElement.className = 'feedback-message incorrect';
          feedbackElement.style.display = 'block';
          
          setTimeout(() => {
            feedbackElement.style.display = 'none';
          }, 3000);
          return; // Stop submission if location update fails
        }
      } else {
        const feedbackElement = document.getElementById('answerFeedback');
        feedbackElement.textContent = "Unable to get your location. Please ensure location services are enabled.";
        feedbackElement.className = 'feedback-message incorrect';
        feedbackElement.style.display = 'block';
        
        setTimeout(() => {
          feedbackElement.style.display = 'none';
        }, 3000);
        return; // Stop submission if location is not available
      }
    }

    console.log(`Submitting answer for session ${session}:`, answer);
    
    // Submit the answer
    const result = await submitAnswer(session, answer);
    console.log('Submit result:', result);
    
    // Display feedback
    const feedbackElement = document.getElementById('answerFeedback');
    feedbackElement.textContent = result.message || (result.correct ? 'Correct!' : 'Incorrect!');
    feedbackElement.className = `feedback-message ${result.correct ? 'correct' : 'incorrect'}`;
    feedbackElement.style.display = 'block';
    
    setTimeout(() => {
      feedbackElement.style.display = 'none';
      
      if (result.correct && !result.completed) {
        document.getElementById('answer').value = ''; // Clear the answer field
        displayQuestion(); // Load the next question
      } else if (result.completed) {
        window.location.href = `../leaderboard/index.html?session=${session}`; // Redirect to leaderboard with session
      }
    }, 2000);
    
  } catch (error) {
    console.error('Error submitting answer:', error);
    const errorMessage = error.message || 'Something went wrong with your submission';
    console.error('Error details:', errorMessage);
    
    const feedbackElement = document.getElementById('answerFeedback');
    feedbackElement.textContent = `Error: ${errorMessage}`;
    feedbackElement.className = 'feedback-message incorrect';
    feedbackElement.style.display = 'block';
    
    setTimeout(() => {
      feedbackElement.style.display = 'none';
    }, 4000);
  }
});

document.getElementById('skipButton').addEventListener('click', function () {
  // Don't do anything if the button is disabled
  if (skipButton.disabled) {
    return;
  }
  
  // Display the skip confirmation modal
  const skipModal = document.createElement('div');
  skipModal.className = 'modal-overlay';
  skipModal.style.display = 'flex';
  skipModal.innerHTML = `
    <div class="modal-content">
      <h2>Skip This Question?</h2>
      <p>Are you sure you want to skip? This may affect your score.</p>
      <div class="modal-buttons">
        <button id="confirmSkip" class="btn-alert">Yes, Skip</button>
        <button id="cancelSkip" class="btn-secondary">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(skipModal);
  
  // Add button event listeners
  document.getElementById('confirmSkip').addEventListener('click', async function() {
    // Remove the modal
    document.body.removeChild(skipModal);
    
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');

    try {
      const result = await skipQuestion(session);
      console.log('Skip result:', result);
      document.getElementById('answer').value = ''; // Clear the answer field
      
      const feedbackElement = document.getElementById('answerFeedback');
      feedbackElement.textContent = result.message || 'Question skipped!';
      feedbackElement.className = 'feedback-message';
      feedbackElement.style.display = 'block';
      
      setTimeout(() => {
        feedbackElement.style.display = 'none';
        displayQuestion(); // Load the next question
      }, 1500);
      
    } catch (error) {
      console.error('Error skipping question:', error);
      const feedbackElement = document.getElementById('answerFeedback');
      feedbackElement.textContent = error.message || 'Unable to skip question';
      feedbackElement.className = 'feedback-message incorrect';
      feedbackElement.style.display = 'block';
      
      setTimeout(() => {
        feedbackElement.style.display = 'none';
      }, 3000);
    }
  });
  
  document.getElementById('cancelSkip').addEventListener('click', function() {
    // Just remove the modal
    document.body.removeChild(skipModal);
  });
});

// Handle the hint button click
document.getElementById('hintButton').addEventListener('click', function() {
  if (currentQuestion && currentQuestion.hint) {
    alert(currentQuestion.hint);
  } else {
    alert('No hint available for this question');
  }
});

// Make sure to stop location updates when leaving the page
window.addEventListener('beforeunload', function () {
  locationService.stopUpdates();
  
  // Also stop QR scanner if active
  if (qrScanner) {
    qrScanner.stop();
  }
});