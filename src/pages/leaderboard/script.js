import { getLeaderboard } from '../../services/api.js';

document.getElementById('AcceptanceTestBtn').addEventListener('click', () => {
  window.open('https://forms.gle/72eZhEUBsHFdV9FT6')
})

async function displayLeaderboard() {
  const urlParams = new URLSearchParams(window.location.search);
  const session = urlParams.get('session');

  try {
    const leaderboard = await getLeaderboard(session, undefined, true, 100);
    console.log('Leaderboard object:', leaderboard);

    const leaderboardList = document.getElementById('leaderboardList');

    if (leaderboard && leaderboard.leaderboard) { // Check if leaderboard.leaderboard exists
      leaderboard.leaderboard.forEach(player => {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.player}: ${player.score}`;
        leaderboardList.appendChild(listItem);
        listItem.classList.add('block-list');
      });
    } else {
      console.error('Leaderboard data is not in the expected format.');
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

displayLeaderboard();
