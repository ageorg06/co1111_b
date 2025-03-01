import { getTreasureHunts, updateLocation } from '../../api.js';

let currentSession = null; // In-memory variable to store the session
let userLocation = null;
const MAX_DIST = 0.01; // In degrees: roughly 1.1km (1 degree is around 111km)

function getSessionFromStorage() {
  currentSession = localStorage.getItem('treasureHuntSession');
  return currentSession;
}

// distance check using coordinate differences
function isAtLocation(userLat, userLon, huntLat, huntLon) {
  // Simple rectangular check
  const latDiff = Math.abs(userLat - huntLat);
  const lonDiff = Math.abs(userLon - huntLon);

  return latDiff < MAX_DIST && lonDiff < MAX_DIST;
}

// Check if player is at a specific location
function isValidLocation(huntLocation) {
  if (!userLocation || !huntLocation) return false;

  return isAtLocation(
      userLocation.latitude,
      userLocation.longitude,
      huntLocation.latitude,
      huntLocation.longitude
  );
}

// Get user current location
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            console.log("User location updated:", userLocation);
            resolve(userLocation);
          },
          (error) => {
            console.error("Error getting location:", error);
            reject(error);
          }
      );
    } else {
      const error = "Geolocation is not supported by this browser.";
      console.error(error);
      reject(new Error(error));
    }
  });
}

async function sendLocation() {
  if (currentSession && userLocation) {
    try {
      await updateLocation(currentSession, userLocation.latitude, userLocation.longitude);
    } catch (error) {
      console.error("Failed to update location on server:", error);
    }
  }
}


// Update location to server if session exists
let locationUpdate;

function startUpdates() {
  // Get session from storage
  getSessionFromStorage();

  // Clear any existing interval
  if (locationUpdate) {
    clearInterval(locationUpdate);
  }

  // Update location immediately
  getLocation().then(sendLocation);

  // Then update every 30 seconds
  locationUpdate = setInterval(async () => {
    try {
      await getLocation();
      await sendLocation();
    } catch (error) {
      console.error("Location update failed:", error);
    }
  }, 30000);
}

// Add a function to stop updates when needed
function stopUpdates() {
  if (locationUpdate) {
    clearInterval(locationUpdate);
    locationUpdate = null;
  }
}

// ensure location updates stop when page is unloaded
window.addEventListener('beforeunload', () => {
  stopUpdates();
});

async function displayTreasureHunts() {
  try {
    // First get user location
    await getLocation();

    const treasureHunts = await getTreasureHunts();
    console.log('Treasure Hunts:', treasureHunts); // Added log
    const treasureHuntList = document.getElementById('treasureHuntList');

    treasureHunts.forEach(treasureHunt => {
      const listItem = document.createElement('li');
      listItem.textContent = treasureHunt.name;

      // Disable games that are finished or not in player's location
      const isAvailable = treasureHunt.status === 'ACTIVE' && isValidLocation(treasureHunt.location);
      listItem.classList.toggle('disabled', !isAvailable);

      listItem.addEventListener('click', () => {
        if (isAvailable) {
          localStorage.setItem('treasureHuntUUID', treasureHunt.uuid);
          window.location.href = '../info/index.html';
        } else {
          if (treasureHunt.status !== 'ACTIVE') {
            alert('This game is not available');
          } else if (!isValidLocation(treasureHunt.location)) {
            alert('You must be at the game location to start');
          }
        }
      });
      treasureHuntList.appendChild(listItem);
    });
    // Start the location updates
    startUpdates();
  } catch (error) {
    console.error('Error fetching treasure hunts:', error);
  }
}

displayTreasureHunts();
