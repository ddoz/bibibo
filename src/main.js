// Main Application Shell & Entry Point for Bibibo

import './style.css';
import { renderBibiboLogo } from './components/Logo.js';
import { renderHub } from './components/Hub.js';
import { registry } from './core/registry.js';
import { progress } from './core/progress.js';
import { sound } from './core/audio.js';

// Register All Mini-Games Here (Modular Architecture)
import clockGame from './games/clock-learning/index.js';

registry.register(clockGame);

function initApp() {
  const appContainer = document.getElementById('app');

  function renderShell() {
    appContainer.innerHTML = `
      <!-- App Top Navigation Bar -->
      <header class="app-header">
        <div class="brand-section" id="brand-logo-btn">
          ${renderBibiboLogo({ size: 'normal' })}
        </div>

        <div class="header-actions">
          <!-- Total Earned Stars Counter -->
          <div class="star-counter" id="star-counter-display">
            <svg class="star-icon" viewBox="0 0 24 24" fill="#FFC436">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span id="star-count-num">${progress.getStars()}</span>
          </div>

          <!-- Mute / Unmute Audio Toggle -->
          <button class="icon-btn" id="toggle-sound-btn" title="Suara On/Off">
            🔊
          </button>

          <!-- Back to Home Button (Shown inside games) -->
          <button class="icon-btn" id="home-btn" style="display: none;" title="Kembali ke Menu Utama">
            🏠
          </button>
        </div>
      </header>

      <!-- Main Game View Container -->
      <main class="main-content" id="main-view"></main>
    `;

    setupGlobalControls();
    showHubScreen();
  }

  function setupGlobalControls() {
    const brandBtn = appContainer.querySelector('#brand-logo-btn');
    const homeBtn = appContainer.querySelector('#home-btn');
    const soundBtn = appContainer.querySelector('#toggle-sound-btn');

    brandBtn.addEventListener('click', () => {
      sound.playPop();
      showHubScreen();
    });

    homeBtn.addEventListener('click', () => {
      sound.playPop();
      showHubScreen();
    });

    soundBtn.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      soundBtn.textContent = isMuted ? '🔇' : '🔊';
    });
  }

  function updateStarsUI() {
    const starNumEl = appContainer.querySelector('#star-count-num');
    if (starNumEl) {
      starNumEl.textContent = progress.getStars();
    }
  }

  function showHubScreen() {
    registry.exitCurrentGame();
    
    const homeBtn = appContainer.querySelector('#home-btn');
    if (homeBtn) homeBtn.style.display = 'none';

    const mainView = appContainer.querySelector('#main-view');
    renderHub(mainView, (gameId) => {
      launchGame(gameId);
    });

    updateStarsUI();
  }

  async function launchGame(gameId) {
    const mainView = appContainer.querySelector('#main-view');
    const homeBtn = appContainer.querySelector('#home-btn');
    
    if (homeBtn) homeBtn.style.display = 'flex';

    await registry.launchGame(gameId, mainView, {
      goHome: showHubScreen,
      updateStars: updateStarsUI
    });
  }

  renderShell();
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
