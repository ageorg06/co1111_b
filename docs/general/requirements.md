# Treasure Hunt Web App Requirements

## MoSCoW Prioritization

### Must Have
- *Mobile-first Web App:* The app must be designed for mobile devices with a modern HTML5-compatible browser.
- *API Interaction:* The app must fetch and display questions one at a time, with answers submitted for checking.
- *Location Sensitivity:* Users must be in the vicinity of the correct location to answer questions.
- *Periodic Location Updates:* The app must update the server with the user's location periodically (e.g., every two minutes).
- *Question Types Support:* The app must support different types of questions (numerical, Boolean, text, multiple-choice).
- *Score and Leaderboard:* The app must display the user's current score and the leaderboard.
- *Time-Limited Sessions:* The app must handle time-limited sessions (e.g., 30 minutes) and return an error message after expiration.
- *Basic UI/UX Design:* The app must have a functional and usable design, with clear and intuitive controls.
- *Continuous Development and Collaboration:* Use GitHub for version control and collaboration, with regular commits and pull requests.
- *Teamwork Documentation:* Maintain a notes page (notes.md) with regular updates on team meetings and progress.
- *Personalization:* The app should allow for some personalization, such as custom player names.
- *Optimized UI for Mobile Users:* Limit the use of the keyboard where possible and optimize the UI for numeric input.
- *Clear Communication:* Provide clear messages and instructions to the user.
- *Request Confirmation:* Request confirmation from the user when performing irreversible actions.
- *Use of Pictures:* Use pictures instead of text where appropriate.
- *Consistent Branding:* Use consistent colors and logos for branding.
- *Cookies for Session Management:* Use cookies to store session IDs and other important information to allow users to resume the game after the browser crashes or is closed.
- *Effective Teamwork:* Emphasize the importance of effective communication, task coordination, and leveraging collaborative tools such as GitHub.

### Should Have
- *QR Code Reader:* Implement a QR code reader to scan and process QR codes included in questions.
- *Map View:* Show a map of the locations visited and the path taken.
- *Error Handling:* Gracefully handle errors, such as network issues, and provide clear user feedback.
- *Resume Functionality:* Allow users to resume the game after leaving the app.
- *Input Method Optimization:* Adjust input methods to match the expected answer types (e.g., numeric input for numerical questions).

### Could Have
- *Social Media Integration:* Allow users to share their scores on social media platforms like Twitter and Facebook.
- *Progressive Web App (PWA) Support:* Implement PWA features for offline use and better performance.
- *Animations and Visual Effects:* Add animations and visual effects to enhance the user experience.
- *Advanced Usability Features:* Implement advanced usability features, such as one-handed usage and skeleton views.

### Won't Have
- *Complex Animations:* Avoid complex animations that could impact performance on mobile devices.
- *Advanced Social Media Features:* Features like live updates or direct messaging within the app are not necessary for the initial release.
- *Multi-Platform Support:* Focus on mobile web app support rather than developing native apps for multiple platforms.

## Next Steps
- *Create the project structure.*
- *Implement the landing page (index.html).*
- *Develop the main app page (app.html).*
- *Set up the testing page (test.html).*
- *Create the notes page (notes.md).*
- *Start implementing the API interactions.*