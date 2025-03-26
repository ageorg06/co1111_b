import { getTreasureHunts } from '../../services/api.js';
import locationService from '../../services/locationService.js';

// Check if treasure hunt is active
function isTreasureHuntActive(startsOn, endsOn) {
  const now = Date.now();
  if (now < startsOn) {
    return 1; // Future
  } else if (now > endsOn) {
    return -1; // Past
  } else {
    return 0; // Current
  }
}



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
      listItem.classList.add('block-list');

      // Disable games that are finished or not in player's location
      const isActive = isTreasureHuntActive(treasureHunt.startsOn, treasureHunt.endsOn);
      const isAvailable = isActive === 0 // && locationService.isValidLocation(treasureHunt.location);
      listItem.classList.toggle('disabled', !isAvailable);
      listItem.classList.toggle('btn-disabled', !isAvailable);

      listItem.addEventListener('click', () => {
        if (isAvailable) { // For testing disable this condition
          localStorage.setItem('treasureHuntUUID', treasureHunt.uuid);
          window.location.href = '../userInfo/index.html';
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

