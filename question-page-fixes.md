# Question Page Fixes

## Issues Identified

1. **Duplicate Buttons**:
   - Multiple QR scan buttons with the same ID
   - Multiple hint buttons with the same ID
   - Multiple exit buttons with the same ID
   - Duplicate exit modals

2. **JavaScript Error**:
   - Error at line 151: `hintContent.style.display = 'none';`
   - The element with ID 'hintContent' doesn't exist in the HTML

## Implementation Plan

### 1. HTML Changes

Replace the current HTML with the following structure:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Question</title>
  <link rel="stylesheet" href="./styles.css" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="text/javascript" src="../../services/instascan.js"></script>
</head>
<body>
  <!-- Background animation element -->
  <div class="animated-bg"></div>

  <nav class="nav-icon-container">
    <button id="leaderboardButton" class="nav-icon">
      <span style="margin-right: 5px;">🏆</span> Leaderboard
    </button>
    <!-- Exit button with confirmation -->
    <div class="exit-button-container">
      <button id="exitButton" class="btn-alert">Exit Game</button>
    </div>
  </nav>

  <!-- Confirmation modal - hidden by default -->
  <div id="exitModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Are you sure?</h2>
      <p>Your progress will be saved.</p>
      <div class="modal-buttons">
        <button id="confirmExit" class="btn-alert">Yes, Exit</button>
        <button id="cancelExit" class="btn-secondary">Cancel</button>
      </div>
    </div>
  </div>

  <div class="question-container">
    <div class="question-card">
      <!-- Location warning alert -->
      <div id="locationWarning" style="display: none;" class="location-alert">
        <span class="icon">📍</span> 
        <span>This question requires your current location</span>
      </div>
      
      <!-- Status bar with score and timer -->
      <div class="status-bar">
        <div class="status-item">
          <span>Score:</span>
          <span id="scoreDisplay" class="status-value">0</span>
        </div>
        <div class="status-item">
          <span>Time:</span>
          <span id="timerDisplay" class="status-value">05:00</span>
        </div>
      </div>

      <!-- Avatar Assistant -->
      <div class="assistant-container">
        <div class="assistant-buttons">
          <button id="hintButton" class="btn-secondary">
            <span style="margin-right: 5px;">💡</span> Hint
          </button>
          <button id="qrScanButton" class="btn-secondary">
            <span style="margin-right: 5px;">📷</span> Scan QR
          </button>
        </div>

        <img src="/src/media/pirate-robot-20.png" alt="Assistant" class="avatar-image">
      </div>

      <!-- Hint content area - hidden by default -->
      <div id="hintContent" class="hint-content" style="display: none;">
        No hint available for this question
      </div>

      <!-- Question content -->
      <div id="questionText" class="question-text">Loading your challenge...</div>
      
      <!-- Answer options area -->
      <div id="answerOptions" class="answer-options"></div>
      
      <!-- Answer input area -->
      <input type="text" id="answer" name="answer" class="answer-input" placeholder="Type your answer here...">
      
      <!-- Answer feedback message - hidden by default -->
      <div id="answerFeedback" class="feedback-message" style="display: none;"></div>
      
      <!-- Action buttons -->
      <div class="button-group">
        <button id="submitButton" class="btn-primary">Submit</button>
        <button id="skipButton" class="btn-secondary">Skip</button>
      </div>
    </div>

    <!-- QR Scanner Modal -->
    <div id="qrScannerModal" class="modal-overlay">
      <div class="modal-content qr-scanner-modal">
        <h2>Scan QR Code</h2>
        <p>Position the QR code within the camera view</p>
        
        <!-- Hidden by default, will be shown when scanning -->
        <video id="qrPreview" style="display: none;"></video>
        
        <div id="qrResult" class="scan-result" style="display: none;">
          <p>QR Code scanned: <span id="qrContent"></span></p>
          <p>Content copied to clipboard!</p>
        </div>
        
        <div class="modal-buttons">
          <button id="startScanBtn" class="btn-primary">Start Camera</button>
          <button id="switchCameraBtn" class="btn-secondary" disabled>Switch Camera</button>
          <button id="closeScanBtn" class="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
  
  <script src="script.js" type="module"></script>
</body>
</html>
```

### 2. JavaScript Changes

No JavaScript changes are needed. The error will be fixed by adding the missing `hintContent` element to the HTML.

## Key Changes Made

1. **Removed Duplicate Buttons**:
   - Kept QR scan button only in the assistant section
   - Kept hint button only in the assistant section
   - Kept exit button only in the nav bar
   - Removed duplicate exit modals

2. **Added Missing Elements**:
   - Added the `hintContent` div with the class "hint-content" and initial display set to "none"

3. **Improved Structure**:
   - Organized buttons according to the preferred layout
   - Simplified the action buttons section to only include submit and skip buttons

## Implementation Instructions

1. Switch to Code mode
2. Replace the entire content of `src/pages/question/index.html` with the HTML provided above
3. No changes needed for the JavaScript file as the error will be fixed by adding the missing element