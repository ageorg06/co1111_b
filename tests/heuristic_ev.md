## Landing Page

### H1: Visibility of System Status

#### Problem
The button Continue is misleading. It is not clear what state the system is in. Users have no clear instruction where this leads. 
Also this is visible only when a user has an active session saved. This makes it even more complicated, going to the same page twice and seeing a new button appear.

#### Solution
Change the description of the text from "Continue" to "Resume treasure hunt". Also make it disabled if no saved game exists.

### H2: Match Between System and Real World

#### Problem
The page is very minimal but also could be characterized as poor and/or empty. No logo, social proof, or any visuals to showcase the concept.

#### Solution
Develop a logo and include it. 
Add social media logos, with proper description. We already discussed the strategy for each social media. X is to let users post their experience with our game app, and TikTok to reach audience. Also add the avatar from /media.

### H6: Recognition Rather Than Recall

#### Problem
The page provides no information about what the game is about.

#### Solution
Include a button "How to Play" to redirect to src/pages/tutorial/


## List of adventures

### H3: User Control and Freedom

#### Problem
There is no way for users to navigate back to landing page.

#### Solution
Add a "Back" button redirecting to landing page or tutorial page.

### H1: Visibility of System Status

#### Problem
The disabled options are properly developed but there is no way to indicate whether it is a past or future hunt.

#### Solution
Add a clear status e.g. "Coming in X days"

### H10: Help and Documentation

#### Problem
Treasure Hunt object provides description which is not included on the UI to let users know what this is about.

#### Solution
Include a description under title. Additional information such as if treasure hunt has a prize could be added with an emoji.

## Information page

### H5: Error Prevention

#### Problem
The webapp validates the name only after submission, leading to modal error message.

#### Solution
- Implement real-time validation (That might be heavy on server-side, since we have to start a treasure hunt to get response if valid)
- If the username is already taken, add some random numbers to it to make it unique.

### H9: Help Users Recognize, Diagnose, and Recover from Errors

#### Problem
Error message contains "$[url] says:" and then the error message. This is meaningless to the user and should be avoided.

#### Solution
Remove technical message and add a user-friendly message such as "This username is taken..."

### H2: Match Between System and Real World

#### Problem
Title "Info" is vague and doesn't make much sense in real world. Also it doesn't give clear instructions to the user.

#### Solution
Use a description like "Create Your Player Profile"

### H3: User Control and Freedom

#### Problem
There is no way for users to navigate back to listing. Maybe users misclicked.

#### Solution
Add a "Back" button redirecting back.

## Question page

### H6: Recognition Rather Than Recall

#### Problem
There is no indication of question progress e.g. "Question 2 of 8"
#### Solution
Add a progress indication above the question description. Coding tip: This information could be fetched and stored when starting the treasure hunt. Then we need just an incrementer.

### H5: Error Prevention

#### Problem
When a question is not skippable, the button remains still active. It doesn't let users skip but shows an error message (which makes it an issue and not a bug).

#### Solution
Disable button when it is not skippable.

### H1: Visibility of System Status

#### Problem
When location is required, it doesn't let users know if it was accessed or not.

#### Solution
Instead of letting users know if it is required or not, show if the location was handled correctly or needs action from users.


## Leaderboard

### H1: Visibility of System Status

#### Problem
The leaderboard doesn't show user's position.
#### Solution
Indicate the user by changing the color of the item. Coding tip: Search by username when fetching the list.

### H7: Flexibility and Efficiency of Use

#### Problem
No flexibility for the user to see the leaderboard from other perspectives.

#### Solution
Include sorting/filtering options.

### H3: User Control and Freedom

#### Problem
There is no way for users to navigate back to landing page.

#### Solution
Add a "Back" button redirecting to landing page to play again.

### H2: Match Between System and Real World

#### Problem
The leaderboard lacks social media integration for marketing.
#### Solution
Add social media buttons like in landing page.