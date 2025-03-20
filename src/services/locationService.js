// locationService.js
import { updateLocation } from './api.js';

class LocationService {
  constructor() {
    this.currentSession = null;
    this.userLocation = null;
    this.locationUpdate = null;
    this.MAX_DIST = 0.01; // In degrees: roughly 1.1km (1 degree is around 111km)
    this.useFixedLocation = true; // Flag to use fixed location instead of real GPS
    this.fixedLocation = {
        latitude: 35.00825961835311, 
        longitude: 33.69677821277413
    };
    
    // Bind methods to ensure 'this' context is preserved
    this.getLocation = this.getLocation.bind(this);
    this.sendLocation = this.sendLocation.bind(this);
    this.startUpdates = this.startUpdates.bind(this);
    this.stopUpdates = this.stopUpdates.bind(this);
    
    // Add event listener for page unload
    window.addEventListener('beforeunload', this.stopUpdates);
  }

  // Get session from storage
  getSessionFromStorage() {
    this.currentSession = localStorage.getItem('treasureHuntSession');
    return this.currentSession;
  }

  // distance check using coordinate differences
  isAtLocation(userLat, userLon, huntLat, huntLon) {
    // Simple rectangular check
    const latDiff = Math.abs(userLat - huntLat);
    const lonDiff = Math.abs(userLon - huntLon);

    return latDiff < this.MAX_DIST && lonDiff < this.MAX_DIST;
  }

  // Check if player is at a specific location
  isValidLocation(huntLocation) {
    if (!this.userLocation || !huntLocation) return false;

    return this.isAtLocation(
      this.userLocation.latitude,
      this.userLocation.longitude,
      huntLocation.latitude,
      huntLocation.longitude
    );
  }

  // Get user current location
  getLocation() {
    // If using fixed location, return it immediately
    if (this.useFixedLocation) {
      return new Promise((resolve) => {
        this.userLocation = this.fixedLocation;
        console.log("Using fixed location:", this.userLocation);
        resolve(this.userLocation);
      });
    }
    
    // Otherwise use real GPS
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            console.log("User location updated:", this.userLocation);
            resolve(this.userLocation);
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

  // Send location to server
  async sendLocation() {
    if (this.currentSession && this.userLocation) {
      try {
        await updateLocation(
          this.currentSession, 
          this.userLocation.latitude, 
          this.userLocation.longitude
        );
      } catch (error) {
        console.error("Failed to update location on server:", error);
      }
    }
  }

  // Start regular location updates
  startUpdates() {
    // Get session from storage
    this.getSessionFromStorage();

    // Clear any existing interval
    this.stopUpdates();

    // Update location immediately
    this.getLocation().then(this.sendLocation);

    // Then update every 30 seconds
    this.locationUpdate = setInterval(async () => {
      try {
        await this.getLocation();
        await this.sendLocation();
      } catch (error) {
        console.error("Location update failed:", error);
      }
    }, 30000);
  }

  // Stop location updates
  stopUpdates() {
    if (this.locationUpdate) {
      clearInterval(this.locationUpdate);
      this.locationUpdate = null;
    }
  }

  // Get current location (returns current location if available or fetches new)
  async getCurrentLocation() {
    if (this.userLocation) {
      return this.userLocation;
    } else {
      return await this.getLocation();
    }
  }
  
  // Enable or disable fixed location mode
  setUseFixedLocation(enabled) {
    this.useFixedLocation = enabled;
    console.log(`Fixed location mode ${enabled ? 'enabled' : 'disabled'}`);
    if (enabled) {
      console.log(`Using fixed coordinates: (${this.fixedLocation.latitude}, ${this.fixedLocation.longitude})`);
    }
  }
  
  // Set custom fixed location coordinates
  setFixedLocation(latitude, longitude) {
    this.fixedLocation = {
      latitude: latitude,
      longitude: longitude
    };
    console.log(`Fixed location updated to: (${latitude}, ${longitude})`);
  }
}

const locationService = new LocationService();
export default locationService;