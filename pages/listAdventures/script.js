import { getTreasureHunts } from '../../services/api.js';
import locationService from '../../services/locationService.js';

async function displayTreasureHunts() {
  try {
    // First get user location
    await locationService.getLocation();

    const treasureHunts = await getTreasureHunts();
    console.log('Treasure Hunts:', treasureHunts);
    const treasureHuntList = document.getElementById('treasureHuntList');

    treasureHunts.forEach(treasureHunt => {
      const listItem = document.createElement('li');
      listItem.textContent = treasureHunt.name;

      // Disable games that are finished or not in player's location
      const isAvailable = treasureHunt.status === 'ACTIVE' && 
                          locationService.isValidLocation(treasureHunt.location);
      listItem.classList.toggle('disabled', !isAvailable);

      listItem.addEventListener('click', () => {
        if (!isAvailable) { // For testing disable this condition
          localStorage.setItem('treasureHuntUUID', treasureHunt.uuid);
          window.location.href = '../info/index.html';
        } else {
          if (treasureHunt.status !== 'ACTIVE') {
            alert('This game is not available');
          } else if (!locationService.isValidLocation(treasureHunt.location)) {
            alert('You must be at the game location to start');
          }
        }
      });
      treasureHuntList.appendChild(listItem);
    });
    
    // Start the location updates
    locationService.startUpdates();
  } catch (error) {
    console.error('Error fetching treasure hunts:', error);
  }
}

// Initialize the page
displayTreasureHunts();

// Show location on console for debugging
setTimeout(() => {
  const userLocation = locationService.userLocation;
  if (userLocation) {
    console.log("Current user location:", userLocation);
  } else {
    console.log("User location not yet available.");
  }
}, 1000); // Small delay to allow location to be fetched