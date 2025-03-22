import { startTreasureHunt } from '../../services/api.js';

let currentSession = null; // In-memory variable to store the session

document.getElementById('startGameButton').addEventListener('click', async function() {
  const playerName = document.getElementById('playerName').value;
  const treasureHuntUUID = localStorage.getItem('treasureHuntUUID');

  console.log('Player Name:', playerName);
  console.log('Treasure Hunt UUID:', treasureHuntUUID);

  try {
    const session = await startTreasureHunt(playerName, 'app', treasureHuntUUID);
    currentSession = session; // Store the session in the in-memory variable
    window.location.href = `../question/index.html?session=${session}`;
  } catch (error) {
    console.error('Error starting treasure hunt:', error);
  }
});
// ensure name is filled
document.getElementById('startGameButton').addEventListener('click', function() {
  const playerNameInput = document.getElementById('playerName');

  if (playerNameInput.value.trim() === '') {
    alert('Please enter player name.');
    return;
  }

  // continue with starting the game
  console.log('Game started with player name:', playerNameInput.value);
});

