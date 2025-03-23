import { getQuestion, submitAnswer, skipQuestion, updateLocation, getScore } from '../../services/api.js';
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
let timerInterval = null;
let timeLeft = 300; // 5 minutes in seconds

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = document.getElementById('timerDisplay');
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    window.location.href = `../leaderboard/index.html?session=${session}`;
  }
  timeLeft--;
}

function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timeLeft = 300;
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

document.addEventListener('DOMContentLoaded', function () {
  questionTextElement = document.getElementById('questionText');
  answerOptionsElement = document.getElementById('answerOptions');
  answerInput = document.getElementById('answer');
  submitButton = document.getElementById('submitButton');
  skipButton = document.getElementById('skipButton');

  answerInput.addEventListener('input', validateAnswer);

  const exitButton = document.getElementById('exitButton');
  const exitModal = document.getElementById('exitModal');
  const confirmExit = document.getElementById('confirmExit');
  const cancelExit = document.getElementById('cancelExit');

  if (exitButton) {
    exitButton.addEventListener('click', function () {
      exitModal.style.display = 'flex';
    });
  }

  if (confirmExit) {
    confirmExit.addEventListener('click', function () {
      window.location.href = '../../index.html';
    });
  }

  if (cancelExit) {
    cancelExit.addEventListener('click', function () {
      exitModal.style.display = 'none';
    });
  }

  const hintButton = document.getElementById('hintButton');
  const hintContent = document.getElementById('hintContent');
  
  hintButton.addEventListener('click', function() {
    if (hintContent.style.display === 'none') {
      hintContent.style.display = 'block';
      hintButton.classList.add('active');
      hintButton.innerHTML = '<span>💡</span> Hide Hint';
      
      // Update hint content if available
      if (currentQuestion && currentQuestion.hint) {
        hintContent.textContent = currentQuestion.hint;
      } else {
        hintContent.textContent = 'No hint available for this question';
      }
    } else {
      hintContent.style.display = 'none';
      hintButton.classList.remove('active');
      hintButton.innerHTML = '<span>💡</span> Show Hint';
    }
  });

  locationService.getLocation().then(() => {
    console.log("Initial location retrieved");
  }).catch(error => {
    console.error("Error getting initial location:", error);
  });

  initQRScanner();
  displayQuestion();
  updateScoreDisplay();
  startTimer();
});

function validateAnswer() {
  if (!currentQuestion) return;

  const answer = answerInput.value.trim();
  let isValid = false;

  switch (currentQuestion.questionType) {
    case 'INTEGER':
      const intValue = parseInt(answer);
      isValid = answer !== '' && !isNaN(intValue) && intValue.toString() === answer;
      break;

    case 'NUMERIC':
      const numValue = parseFloat(answer);
      isValid = answer !== '' && !isNaN(numValue);
      break;

    case 'TEXT':
      isValid = answer !== '';
      break;

    case 'BOOLEAN':
    case 'MCQ':
      isValid = answerOptionsElement.querySelector('.selected') !== null;
      break;

    default:
      isValid = answer !== '';
  }

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

    
    const hintContent = document.getElementById('hintContent');
    const hintButton = document.getElementById('hintButton');
    hintContent.style.display = 'none';
    hintButton.classList.remove('active');
    hintButton.innerHTML = '<span>💡</span> Show Hint';

    submitButton.disabled = true;
    submitButton.classList.add('btn-disabled');

    if (question.skippable === false) {
      skipButton.disabled = true;
      skipButton.classList.add('btn-disabled');
    } else {
      skipButton.disabled = false;
      skipButton.classList.remove('btn-disabled');
    }

    switch (question.questionType) {
      case 'BOOLEAN':
        console.log('BOOLEAN case');
        answerInput.style.display = 'none';
        answerOptionsElement.style.display = 'flex';
        answerOptionsElement.className = 'answer-options boolean-options';
        answerOptionsElement.innerHTML = '';

        const options = ['TRUE', 'FALSE'];
        options.forEach(option => {
          const button = document.createElement('button');
          button.className = 'answer-button';
          button.textContent = option;
          button.setAttribute('data-value', option);
          button.onclick = () => {
            answerOptionsElement.querySelectorAll('.answer-button').forEach(btn => {
              btn.classList.remove('selected');
            });
            button.classList.add('selected');
            answerInput.value = option;
            console.log('BOOLEAN selection made:', option);
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
        answerOptionsElement.innerHTML = '';

        const mcqOptions = ['A', 'B', 'C', 'D'];
        mcqOptions.forEach(option => {
          const button = document.createElement('button');
          button.className = 'answer-button';
          button.textContent = option;
          button.onclick = () => {
            answerOptionsElement.querySelectorAll('.answer-button').forEach(btn => {
              btn.classList.remove('selected');
            });
            button.classList.add('selected');
            answerInput.value = option;
            validateAnswer();
          };
          answerOptionsElement.appendChild(button);
        });
        break;

      case 'INTEGER':
        console.log('INTEGER case');
        answerInput.style.display = 'block';
        answerOptionsElement.style.display = 'none';
        answerInput.value = '';
        answerInput.type = 'number';
        answerInput.pattern = '[0-9]*';
        answerInput.inputmode = 'numeric';
        answerInput.step = '1';
        break;

      case 'NUMERIC':
        console.log('NUMERIC case');
        answerInput.style.display = 'block';
        answerOptionsElement.style.display = 'none';
        answerInput.value = '';
        answerInput.type = 'number';
        answerInput.pattern = '[0-9]*\\.?[0-9]*';
        answerInput.inputmode = 'decimal';
        answerInput.step = 'any';
        break;

      case 'TEXT':
      default:
        console.log('TEXT or default case');
        answerInput.style.display = 'block';
        answerOptionsElement.style.display = 'none';
        answerInput.value = '';
        answerInput.type = 'text';
        answerInput.pattern = '';
        answerInput.inputmode = 'text';
        break;
    }

    const locationWarning = document.getElementById('locationWarning');
    if (question.requiresLocation) {
      locationWarning.style.display = 'block';
      locationService.startUpdates();
    } else {
      locationWarning.style.display = 'none';
    }

    startTimer();
  } catch (error) {
    console.error('Error fetching question:', error);
    questionTextElement.innerHTML = 'Error loading question. Please try again.';
  }
}

function initQRScanner() {
  const qrScanButton = document.getElementById('qrScanButton');
  const qrScannerModal = document.getElementById('qrScannerModal');
  const qrPreview = document.getElementById('qrPreview');
  const startScanBtn = document.getElementById('startScanBtn');
  const switchCameraBtn = document.getElementById('switchCameraBtn');
  const closeScanBtn = document.getElementById('closeScanBtn');
  const qrResult = document.getElementById('qrResult');
  const qrContent = document.getElementById('qrContent');

  if (!qrScanButton) return;

  const scannerOptions = {
    continuous: true,
    video: qrPreview,
    mirror: true,
    captureImage: false,
    backgroundScan: true,
    refractoryPeriod: 5000,
    scanPeriod: 1
  };

  qrScanButton.addEventListener('click', function () {
    qrScannerModal.style.display = 'flex';
    qrResult.style.display = 'none';
    qrPreview.style.display = 'none';

    if (qrScanner) {
      qrScanner.stop();
    }

    switchCameraBtn.disabled = true;
  });

  startScanBtn.addEventListener('click', function () {
    if (!qrScanner) {
      qrScanner = new Instascan.Scanner(scannerOptions);

      qrScanner.addListener('scan', function (content) {
        console.log('QR Code detected:', content);

        qrContent.textContent = content;
        qrResult.style.display = 'block';

        navigator.clipboard.writeText(content).catch(err => {
          console.error('Could not copy text: ', err);
        });

        const answerInput = document.getElementById('answer');
        if (answerInput) {
          answerInput.value = content;

          const inputEvent = new Event('input', { bubbles: true });
          answerInput.dispatchEvent(inputEvent);
        }

        qrScanner.stop();
        qrPreview.style.display = 'none';

        setTimeout(() => {
          qrScannerModal.style.display = 'none';
          qrResult.style.display = 'none';
        }, 3000);
      });
    }

    if (availableCameras.length === 0) {
      Instascan.Camera.getCameras().then(function (cameras) {
        availableCameras = cameras;

        if (cameras.length > 0) {
          switchCameraBtn.disabled = cameras.length <= 1;
          startQRScanner();
        } else {
          console.error('No cameras found.');
          qrResult.innerHTML = '<p style="color: #c62828;">No cameras found on your device.</p>';
          qrResult.style.display = 'block';
        }
      }).catch(function (error) {
        console.error('Error getting cameras:', error);
        qrResult.innerHTML = '<p style="color: #c62828;">Could not access the camera. Please allow camera permissions.</p>';
        qrResult.style.display = 'block';
      });
    } else {
      startQRScanner();
    }
  });

  function startQRScanner() {
    if (availableCameras.length > 0) {
      qrResult.style.display = 'none';
      qrPreview.style.display = 'block';

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

  switchCameraBtn.addEventListener('click', function () {
    if (availableCameras.length > 1) {
      qrScanner.stop();
      currentCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
      startQRScanner();
    }
  });

  closeScanBtn.addEventListener('click', function () {
    if (qrScanner) {
      qrScanner.stop();
    }
    qrScannerModal.style.display = 'none';
  });
}

async function updateScoreDisplay() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    const scoreData = await getScore(session);
    document.getElementById('scoreDisplay').textContent = scoreData.score;
  } catch (error) {
    console.error('Error updating score:', error);
  }
}

document.getElementById('submitButton').addEventListener('click', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');

  if (!validateAnswer()) {
    return;
  }

  let answer;
  if (currentQuestion.questionType === 'BOOLEAN' || currentQuestion.questionType === 'MCQ') {
    const selectedButton = answerOptionsElement.querySelector('.selected');
    if (selectedButton) {
      answer = selectedButton.textContent;
    } else {
      answer = document.getElementById('answer').value;
    }
  } else {
    answer = document.getElementById('answer').value;
  }

  console.log('Submitting answer:', answer);

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
    if (currentQuestion && currentQuestion.requiresLocation) {
      await locationService.getLocation();

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
          return;
        }
      } else {
        const feedbackElement = document.getElementById('answerFeedback');
        feedbackElement.textContent = "Unable to get your location. Please ensure location services are enabled.";
        feedbackElement.className = 'feedback-message incorrect';
        feedbackElement.style.display = 'block';

        setTimeout(() => {
          feedbackElement.style.display = 'none';
        }, 3000);
        return;
      }
    }

    console.log(`Submitting answer for session ${session}:`, answer);

    const result = await submitAnswer(session, answer);
    console.log('Submit result:', result);

    await updateScoreDisplay();

    const feedbackElement = document.getElementById('answerFeedback');
    feedbackElement.textContent = result.message || (result.correct ? 'Correct!' : 'Incorrect!');
    feedbackElement.className = `feedback-message ${result.correct ? 'correct' : 'incorrect'}`;
    feedbackElement.style.display = 'block';

    setTimeout(() => {
      feedbackElement.style.display = 'none';

      if (result.correct && !result.completed) {
        document.getElementById('answer').value = '';
        displayQuestion();
      } else if (result.completed) {
        window.location.href = `../leaderboard/index.html?session=${session}`;
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
  if (skipButton.disabled) {
    return;
  }

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

  document.getElementById('confirmSkip').addEventListener('click', async function () {
    document.body.removeChild(skipModal);

    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');

    try {
      const result = await skipQuestion(session);
      console.log('Skip result:', result);
      document.getElementById('answer').value = '';

      await updateScoreDisplay();

      const feedbackElement = document.getElementById('answerFeedback');
      feedbackElement.textContent = result.message || 'Question skipped!';
      feedbackElement.className = 'feedback-message';
      feedbackElement.style.display = 'block';

      setTimeout(() => {
        feedbackElement.style.display = 'none';
        displayQuestion();
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

  document.getElementById('cancelSkip').addEventListener('click', function () {
    document.body.removeChild(skipModal);
  });
});

window.addEventListener('beforeunload', function () {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  locationService.stopUpdates();
  if (qrScanner) {
    qrScanner.stop();
  }
});