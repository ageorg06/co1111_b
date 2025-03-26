document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('treasureHuntSession')) {
        var continueButton = document.createElement('a');
        continueButton.href = 'app.html?route=continue';
        continueButton.textContent = 'Continue';
        // continueButton.style.marginLeft = '10px'; // Add some spacing
        document.getElementById('continueButton').appendChild(continueButton);
        
        console.log('Session found, Continue button added.');
    } else {
        console.log('No session found.');
    }
});

window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('serviceWorker.js');
    }
}