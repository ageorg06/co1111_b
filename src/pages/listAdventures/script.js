import { getTreasureHunts } from '../../api.js';

let currentSession = null; // In-memory variable to store the session

async function displayTreasureHunts() {
  try {
    const treasureHunts = await getTreasureHunts();
    console.log('Treasure Hunts:', treasureHunts); // Added log
    const treasureHuntList = document.getElementById('treasureHuntList');

    treasureHunts.forEach(treasureHunt => {
      const listItem = document.createElement('li');
      listItem.textContent = treasureHunt.name;
      listItem.addEventListener('click', () => {
        localStorage.setItem('treasureHuntUUID', treasureHunt.uuid);
        window.location.href = '../info/index.html';
      });
      treasureHuntList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching treasure hunts:', error);
  }
}

displayTreasureHunts();
