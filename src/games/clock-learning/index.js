// Main Entry point for Mini-Game: Belajar Membaca Jam (Bilingual ID/EN, Dual Draggable Hands, 12h/24h)

import { AnalogClock } from './AnalogClock.js';
import { generateClockQuestion, getTimePhrase, formatDigitalTime } from './modes.js';
import { sound } from '../../core/audio.js';
import { progress } from '../../core/progress.js';

export default {
  id: 'clock-learning',
  title: 'Belajar Membaca Jam',
  description: 'Petualangan seru mengenal jam analog & digital bersama Bibibo! Putar jarum jam pendek & panjang dengan presisi 1 menit.',
  icon: `
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#FF5D8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10" fill="#FFF0F5" />
      <polyline points="12 6 12 12 16 14" stroke="#3A86EF" stroke-width="2.5" />
      <circle cx="12" cy="12" r="1.5" fill="#FFC436" />
    </svg>
  `,
  category: 'Matematika & Waktu',
  badge: 'Favorit',
  color: '#FF5D8F',

  init(container, context) {
    let mode = 'tebak'; // 'tebak', 'atur', 'suara'
    let level = 1;      // 1: Pas, 2: Setengah, 3: Seperempat, 4: 5-Mnt, 5: 1-Mnt Detail
    let lang = 'id';    // 'id' (Bahasa Indonesia) or 'en' (English)
    let is24h = false;  // 12-Hour vs 24-Hour format
    
    let currentQuestion = null;
    let clockInstance = null;
    let score = 0;
    let targetScore = 5;

    function renderGameView() {
      const isEn = lang === 'en';

      container.innerHTML = `
        <div class="clock-game-container">
          <!-- Top Control Toolbar (Language & Format Toggles) -->
          <div class="clock-toolbar-top">
            <div class="lang-toggle-group">
              <button class="lang-btn ${lang === 'id' ? 'active' : ''}" data-lang="id">🇮🇩 Indonesia</button>
              <button class="lang-btn ${lang === 'en' ? 'active' : ''}" data-lang="en">🇬🇧 English</button>
            </div>

            <div class="fmt-select-group">
              <button class="fmt-pill ${!is24h ? 'active' : ''}" id="fmt-12h-btn">12-Hour (AM/PM)</button>
              <button class="fmt-pill ${is24h ? 'active' : ''}" id="fmt-24h-btn">24-Hour</button>
            </div>
          </div>

          <!-- Mode & Level Selection Sub Nav -->
          <div class="game-sub-nav">
            <div class="mode-tabs">
              <button class="tab-btn ${mode === 'tebak' ? 'active' : ''}" data-mode="tebak">
                ${isEn ? 'Guess Time 🧩' : 'Tebak Jam 🧩'}
              </button>
              <button class="tab-btn ${mode === 'atur' ? 'active' : ''}" data-mode="atur">
                ${isEn ? 'Set Clock ⏰' : 'Atur Jam ⏰'}
              </button>
              <button class="tab-btn ${mode === 'suara' ? 'active' : ''}" data-mode="suara">
                ${isEn ? 'Listen & Quiz 🔊' : 'Dengar & Tebak 🔊'}
              </button>
            </div>

            <div class="level-pills">
              <button class="level-pill ${level === 1 ? 'active' : ''}" data-level="1">
                ${isEn ? "o'clock" : 'Jam Pas'}
              </button>
              <button class="level-pill ${level === 2 ? 'active' : ''}" data-level="2">
                ${isEn ? 'Half' : 'Setengah'}
              </button>
              <button class="level-pill ${level === 3 ? 'active' : ''}" data-level="3">
                ${isEn ? 'Quarter' : 'Seperempat'}
              </button>
              <button class="level-pill ${level === 4 ? 'active' : ''}" data-level="4">
                ${isEn ? '5-Min' : '5 Menit'}
              </button>
              <button class="level-pill ${level === 5 ? 'active' : ''}" data-level="5">
                ${isEn ? '1-Min Detail' : '1 Mnt Detail'}
              </button>
            </div>
          </div>

          <!-- Main Playing Card -->
          <div class="clock-play-card">
            <div class="question-banner">
              <h2 class="question-title">
                <span id="question-text">
                  ${isEn ? 'What time is shown on the clock?' : 'Pukul berapa jam ini?'}
                </span>
                <button class="voice-btn" id="speak-question-btn" title="${isEn ? 'Listen Voice' : 'Dengarkan Suara'}">🔊</button>
              </h2>
              <div style="font-size: 0.95rem; color: #6C757D; font-weight: 600;">
                ${isEn ? 'Score' : 'Skor'}: <span id="score-text" style="color: #FF5D8F; font-size: 1.2rem;">${score}</span> / ${targetScore}
              </div>
            </div>

            <!-- Clock Area -->
            <div id="clock-mount-area"></div>

            <!-- Options or Action Buttons Area -->
            <div id="interaction-area" style="width: 100%; display: flex; flex-direction: column; align-items: center;"></div>
          </div>
        </div>
      `;

      setupToolbarEvents();
      loadNewQuestion();
    }

    function setupToolbarEvents() {
      // Language Toggle Buttons
      container.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          sound.playPop();
          lang = e.target.dataset.lang;
          renderGameView();
        });
      });

      // Format Buttons
      const fmt12 = container.querySelector('#fmt-12h-btn');
      const fmt24 = container.querySelector('#fmt-24h-btn');
      if (fmt12) {
        fmt12.addEventListener('click', () => {
          sound.playPop();
          is24h = false;
          renderGameView();
        });
      }
      if (fmt24) {
        fmt24.addEventListener('click', () => {
          sound.playPop();
          is24h = true;
          renderGameView();
        });
      }

      // Mode Buttons
      container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          sound.playPop();
          mode = e.target.dataset.mode;
          score = 0;
          renderGameView();
        });
      });

      // Level Buttons
      container.querySelectorAll('.level-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          sound.playPop();
          level = parseInt(e.target.dataset.level);
          score = 0;
          renderGameView();
        });
      });

      // Voice Button
      const speakBtn = container.querySelector('#speak-question-btn');
      if (speakBtn) {
        speakBtn.addEventListener('click', () => {
          sound.playPop();
          speakQuestion();
        });
      }
    }

    function speakQuestion() {
      if (!currentQuestion) return;
      const langCode = lang === 'en' ? 'en-US' : 'id-ID';
      
      if (mode === 'tebak') {
        const promptText = lang === 'en' 
          ? `What time is shown on the clock? ${currentQuestion.targetPhrase}`
          : `Pukul berapa jam ini? ${currentQuestion.targetPhrase}`;
        sound.speak(promptText, langCode);
      } else if (mode === 'atur') {
        const promptText = lang === 'en'
          ? `Set the clock hands to ${currentQuestion.targetPhrase}`
          : `Putarlah jarum jam hingga menunjukkan ${currentQuestion.targetPhrase}`;
        sound.speak(promptText, langCode);
      } else if (mode === 'suara') {
        sound.speak(currentQuestion.targetPhrase, langCode);
      }
    }

    function loadNewQuestion() {
      currentQuestion = generateClockQuestion(mode, level, lang, is24h);
      
      const clockMount = container.querySelector('#clock-mount-area');
      const interactionArea = container.querySelector('#interaction-area');
      const questionText = container.querySelector('#question-text');

      const isEn = lang === 'en';

      if (mode === 'tebak') {
        questionText.textContent = isEn ? 'What time is shown on the clock?' : 'Pukul berapa jam pada gambar?';
        
        clockInstance = new AnalogClock(clockMount, {
          hours: currentQuestion.targetHour,
          minutes: currentQuestion.targetMinute,
          isPM: currentQuestion.isPM,
          is24h: is24h,
          interactive: false
        });

        // Multiple choice options
        interactionArea.innerHTML = `
          <div class="choices-grid">
            ${currentQuestion.choices.map(choice => `
              <button class="choice-btn" data-choice="${choice}">
                ${choice}
              </button>
            `).join('')}
          </div>
        `;

        interactionArea.querySelectorAll('.choice-btn').forEach(btn => {
          btn.addEventListener('click', (e) => handleAnswerClick(e, btn.dataset.choice));
        });

      } else if (mode === 'atur') {
        const setLabel = isEn ? 'Set Clock to' : 'Atur Jam ke';
        questionText.textContent = `${setLabel}: ${currentQuestion.targetPhrase}`;
        
        // Randomize initial clock hands offset
        let startH = (currentQuestion.targetHour + 3) % 12 || 12;
        let startM = (currentQuestion.targetMinute + 17) % 60;
        
        clockInstance = new AnalogClock(clockMount, {
          hours: startH,
          minutes: startM,
          isPM: currentQuestion.isPM,
          is24h: is24h,
          interactive: true
        });

        interactionArea.innerHTML = `
          <div class="clock-action-bar">
            <button class="btn-primary btn-yellow" id="check-hand-btn">
              ${isEn ? 'Check Answer ✔️' : 'Cek Jawaban ✔️'}
            </button>
          </div>
        `;

        const checkBtn = interactionArea.querySelector('#check-hand-btn');
        checkBtn.addEventListener('click', handleCheckHands);

      } else if (mode === 'suara') {
        questionText.textContent = isEn ? 'Listen to the audio & pick the right time!' : 'Dengarkan suara & pilih jam yang tepat!';
        
        clockInstance = new AnalogClock(clockMount, {
          hours: currentQuestion.targetHour,
          minutes: currentQuestion.targetMinute,
          isPM: currentQuestion.isPM,
          is24h: is24h,
          interactive: false
        });

        interactionArea.innerHTML = `
          <div class="choices-grid">
            ${currentQuestion.choices.map(choice => `
              <button class="choice-btn" data-choice="${choice}">
                ${choice}
              </button>
            `).join('')}
          </div>
        `;

        interactionArea.querySelectorAll('.choice-btn').forEach(btn => {
          btn.addEventListener('click', (e) => handleAnswerClick(e, btn.dataset.choice));
        });

        setTimeout(() => speakQuestion(), 300);
      }
    }

    function handleAnswerClick(e, selectedChoice) {
      const isCorrect = selectedChoice === currentQuestion.correctChoice;
      const targetBtn = e.currentTarget;

      if (isCorrect) {
        sound.playCorrect();
        targetBtn.classList.add('correct');
        score++;
        updateScoreUI();

        if (score >= targetScore) {
          triggerVictory();
        } else {
          setTimeout(() => loadNewQuestion(), 1000);
        }
      } else {
        sound.playWrong();
        targetBtn.classList.add('wrong');
        setTimeout(() => targetBtn.classList.remove('wrong'), 800);
      }
    }

    function handleCheckHands() {
      const current = clockInstance.getTime();
      const hMatch = (current.hours % 12) === (currentQuestion.targetHour % 12);
      // Precision within 1 minute
      const mMatch = Math.abs(current.minutes - currentQuestion.targetMinute) <= 1;

      if (hMatch && mMatch) {
        sound.playCorrect();
        score++;
        updateScoreUI();

        if (score >= targetScore) {
          triggerVictory();
        } else {
          setTimeout(() => loadNewQuestion(), 1000);
        }
      } else {
        sound.playWrong();
        const hintText = lang === 'en'
          ? 'Check the short (hour) and long (minute) hands again!'
          : 'Coba perhatikan jarum pendek dan jarum panjangnya lagi ya!';
        sound.speak(hintText, lang === 'en' ? 'en-US' : 'id-ID');
      }
    }

    function updateScoreUI() {
      const scoreEl = container.querySelector('#score-text');
      if (scoreEl) scoreEl.textContent = score;
    }

    function triggerVictory() {
      sound.playFanfare();
      progress.recordLevelCompletion('clock-learning', `mode_${mode}_lvl_${level}`, 3);
      if (context && context.updateStars) {
        context.updateStars();
      }

      const isEn = lang === 'en';

      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-card">
          <div style="font-size: 4rem; margin-bottom: 8px;">🎉 ⭐⭐⭐</div>
          <h2 style="font-size: 2rem; color: #2B2D42; margin-bottom: 8px;">
            ${isEn ? 'GREAT JOB!' : 'HEBAT BANGET!'}
          </h2>
          <p style="font-size: 1.1rem; color: #6C757D; margin-bottom: 24px;">
            ${isEn 
              ? `You mastered Level ${level} in ${mode.toUpperCase()} mode!` 
              : `Kamu berhasil menyelesaikan level ${level} dalam mode ${mode.toUpperCase()}!`
            }
          </p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn-primary btn-yellow" id="modal-next-btn">
              ${isEn ? 'Keep Playing 🚀' : 'Lanjut Bermain 🚀'}
            </button>
            <button class="btn-primary btn-blue" id="modal-hub-btn">
              ${isEn ? 'Main Menu 🏠' : 'Kembali ke Menu 🏠'}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector('#modal-next-btn').addEventListener('click', () => {
        sound.playPop();
        modal.remove();
        score = 0;
        loadNewQuestion();
      });

      modal.querySelector('#modal-hub-btn').addEventListener('click', () => {
        sound.playPop();
        modal.remove();
        if (context && context.goHome) {
          context.goHome();
        }
      });
    }

    renderGameView();

    return {
      destroy() {
        // Cleanup if needed
      }
    };
  }
};
