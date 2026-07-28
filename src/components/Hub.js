// Main Hub / Menu Component for Bibibo Mini-Games Selection

import { registry } from '../core/registry.js';
import { sound } from '../core/audio.js';

export function renderHub(container, onSelectGame) {
  const games = registry.getAllGames();

  const html = `
    <section class="hub-hero">
      <h1 class="hub-title">Ayo Belajar & Bermain! 🎈</h1>
      <p class="hub-subtitle">Pilih petualangan serumu hari ini bersama Bibibo!</p>
    </section>

    <section class="games-grid">
      ${games.map(game => `
        <div class="game-card" data-game-id="${game.id}">
          ${game.badge ? `<span class="game-card-badge">${game.badge}</span>` : ''}
          
          <div class="game-card-icon">
            ${game.icon}
          </div>
          
          <h2 class="game-card-title">${game.title}</h2>
          <p class="game-card-desc">${game.description}</p>
          
          <button class="btn-primary btn-yellow game-card-play">
            Main Sekarang 🚀
          </button>
        </div>
      `).join('')}

      <!-- Coming Soon Card for Modular Expansion -->
      <div class="game-card coming-soon" style="opacity: 0.75; cursor: default;">
        <span class="game-card-badge" style="background: #8338EC;">Segera Hadir</span>
        
        <div class="game-card-icon" style="background: #F3E8FF;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8338EC" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        
        <h2 class="game-card-title">Mewarnai & Berhitung</h2>
        <p class="game-card-desc">Mini game seru berikutnya sedang disiapkan oleh Bibibo!</p>
        
        <button class="btn-primary" style="background: #CBD5E1; box-shadow: none; cursor: default;" disabled>
          🔒 Dikunci
        </button>
      </div>
    </section>
  `;

  container.innerHTML = html;

  // Add click listeners to cards
  const cards = container.querySelectorAll('.game-card[data-game-id]');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => sound.playPop());
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-game-id');
      sound.playPop();
      if (onSelectGame) {
        onSelectGame(gameId);
      }
    });
  });
}
