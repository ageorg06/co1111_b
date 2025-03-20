import { startTreasureHunt } from '../../services/api.js';
const teamId = 'TEAM-B'; // For tresaure hunt on 26/03/2025
let currentSession = null; // In-memory variable to store the session

document.getElementById('startGameButton').addEventListener('click', async function() {
  const playerName = document.getElementById('playerName').value;
  const treasureHuntUUID = localStorage.getItem('treasureHuntUUID');

  console.log('Player Name:', playerName);
  console.log('Treasure Hunt UUID:', treasureHuntUUID);

  try {
    const session = await startTreasureHunt(playerName, teamId, treasureHuntUUID);
    currentSession = session; // Store the session in the in-memory variable
    localStorage.setItem('treasureHuntSession', session); // Store the session in localStorage
    window.location.href = `../question/index.html?session=${session}`;
  } catch (error) {
    console.error('Error starting treasure hunt:', error);
    alert(error.message);
  }
});
