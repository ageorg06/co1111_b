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
    alert(error.message);
  }
});
