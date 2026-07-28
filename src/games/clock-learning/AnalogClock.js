// Interactive SVG Analog Clock with Dual Draggable Hands (Hour & Minute, 1-Min Precision, 12h/24h & AM/PM)

import { sound } from '../../core/audio.js';

export class AnalogClock {
  /**
   * @param {HTMLElement} container - DOM element to render clock into
   * @param {Object} options - Config options
   */
  constructor(container, options = {}) {
    this.container = container;
    this.interactive = options.interactive !== false;
    this.hours = options.hours || 10;   // 1 - 12
    this.minutes = options.minutes || 10; // 0 - 59
    this.isPM = options.isPM || false;
    this.is24h = options.is24h || false;
    this.onTimeChangeCallback = options.onTimeChange || null;
    
    this.isDragging = false;
    this.activeHand = null; // 'minute' or 'hour'
    this.svg = null;
    this.lastMinuteAngle = null;

    this.render();
    this.setupEvents();
  }

  render() {
    const html = `
      <div class="analog-clock-wrapper">
        <!-- Sky Scene & AM/PM Toggle Header -->
        <div class="clock-controls-top">
          <div class="sky-indicator" id="sky-indicator">
            <span class="sun-moon-icon" id="sun-moon">☀️</span>
            <span class="sky-text" id="sky-text">Pagi Hari</span>
          </div>

          <div class="ampm-toggle-group">
            <button class="ampm-btn ${!this.isPM ? 'active' : ''}" id="am-btn">AM (Pagi/Siang)</button>
            <button class="ampm-btn ${this.isPM ? 'active' : ''}" id="pm-btn">PM (Sore/Malam)</button>
          </div>
        </div>

        <svg class="analog-clock-svg" viewBox="0 0 300 300" id="clock-svg">
          <defs>
            <filter id="clockBezelShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#3A86EF" flood-opacity="0.2"/>
            </filter>
            
            <linearGradient id="bezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="100%" stop-color="#F1F5F9" />
            </linearGradient>

            <filter id="handGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
          </defs>

          <!-- Outer Ring Bezel -->
          <circle cx="150" cy="150" r="140" fill="url(#bezelGrad)" stroke="#3A86EF" stroke-width="10" filter="url(#clockBezelShadow)" />
          <circle cx="150" cy="150" r="128" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="3" />

          <!-- Minute Ticks & Numbers (1 to 12) -->
          <g class="clock-face-marks">
            ${this.generateFaceMarks()}
          </g>

          <!-- Hour Numbers 1 - 12 -->
          <g class="clock-numbers">
            ${this.generateNumbers()}
          </g>

          <!-- Hour Hand (Jarum Pendek - Pink/Coral) -->
          <g class="hand-group hour-hand-group" id="hour-hand-group" filter="url(#handGlow)" style="cursor: pointer;">
            <!-- Hand Shaft -->
            <line x1="150" y1="150" x2="150" y2="92" stroke="#FF5D8F" stroke-width="12" stroke-linecap="round" />
            <!-- Arrow Cap -->
            <polygon points="150,78 142,94 158,94" fill="#FF5D8F" />
            <!-- Touch/Drag Handle Knob -->
            <circle cx="150" cy="80" r="12" fill="#FF5D8F" stroke="#FFFFFF" stroke-width="3" class="drag-handle-hour" />
            <text x="150" y="84" text-anchor="middle" font-size="10" font-weight="bold" fill="#FFFFFF">JAM</text>
          </g>

          <!-- Minute Hand (Jarum Panjang - Electric Blue) -->
          <g class="hand-group minute-hand-group" id="minute-hand-group" filter="url(#handGlow)" style="cursor: pointer;">
            <!-- Hand Shaft -->
            <line x1="150" y1="150" x2="150" y2="48" stroke="#3A86EF" stroke-width="8" stroke-linecap="round" />
            <!-- Arrow Cap -->
            <polygon points="150,34 143,50 157,50" fill="#3A86EF" />
            <!-- Touch/Drag Handle Knob -->
            <circle cx="150" cy="38" r="12" fill="#3A86EF" stroke="#FFFFFF" stroke-width="3" class="drag-handle-minute" />
            <text x="150" y="42" text-anchor="middle" font-size="9" font-weight="bold" fill="#FFFFFF">MNT</text>
          </g>

          <!-- Center Pivot Knob -->
          <circle cx="150" cy="150" r="13" fill="#FFC436" stroke="#2B2D42" stroke-width="3" />
          <circle cx="150" cy="150" r="4" fill="#FFFFFF" />
        </svg>

        <!-- Digital Preview Badge with 12h/24h toggle -->
        <div class="digital-container">
          <div class="digital-badge" id="digital-badge">
            <span class="digital-time-text" id="digital-time-text">10:10 AM</span>
          </div>

          <button class="fmt-toggle-btn" id="fmt-toggle-btn">
            ${this.is24h ? 'Format: 24 Jam' : 'Format: 12 Jam (AM/PM)'}
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.svg = this.container.querySelector('#clock-svg');
    this.updateHands();
    this.setupFormatControls();
  }

  generateFaceMarks() {
    let marks = '';
    for (let i = 0; i < 60; i++) {
      const angle = i * 6; // 360 / 60
      const isMajor = i % 5 === 0;
      const r1 = isMajor ? 116 : 121;
      const r2 = 125;
      const rad = (angle - 90) * (Math.PI / 180);
      const x1 = 150 + r1 * Math.cos(rad);
      const y1 = 150 + r1 * Math.sin(rad);
      const x2 = 150 + r2 * Math.cos(rad);
      const y2 = 150 + r2 * Math.sin(rad);
      
      const width = isMajor ? 3.5 : 1.5;
      const color = isMajor ? '#2B2D42' : '#94A3B8';
      
      marks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" />`;
    }
    return marks;
  }

  generateNumbers() {
    let nums = '';
    for (let i = 1; i <= 12; i++) {
      const angle = i * 30; // 360 / 12
      const rad = (angle - 90) * (Math.PI / 180);
      const r = 98;
      const x = 150 + r * Math.cos(rad);
      const y = 150 + r * Math.sin(rad) + 8;

      nums += `
        <text x="${x}" y="${y}" text-anchor="middle" font-family="'Fredoka', cursive" font-size="21" font-weight="700" fill="#2B2D42">
          ${i}
        </text>
      `;
    }
    return nums;
  }

  updateHands() {
    const minuteAngle = (this.minutes / 60) * 360;
    const hourAngle = ((this.hours % 12) / 12) * 360 + (this.minutes / 60) * 30;

    const hourGroup = this.container.querySelector('#hour-hand-group');
    const minuteGroup = this.container.querySelector('#minute-hand-group');

    if (hourGroup) hourGroup.setAttribute('transform', `rotate(${hourAngle}, 150, 150)`);
    if (minuteGroup) minuteGroup.setAttribute('transform', `rotate(${minuteAngle}, 150, 150)`);

    // Digital text update
    const digitalEl = this.container.querySelector('#digital-time-text');
    if (digitalEl) {
      if (this.is24h) {
        let h24 = this.isPM ? (this.hours === 12 ? 12 : this.hours + 12) : (this.hours === 12 ? 0 : this.hours);
        digitalEl.textContent = `${String(h24).padStart(2, '0')}:${String(this.minutes).padStart(2, '0')}`;
      } else {
        const period = this.isPM ? 'PM' : 'AM';
        digitalEl.textContent = `${String(this.hours).padStart(2, '0')}:${String(this.minutes).padStart(2, '0')} ${period}`;
      }
    }

    // Sky scene update
    const skyIcon = this.container.querySelector('#sun-moon');
    const skyText = this.container.querySelector('#sky-text');
    
    if (skyIcon && skyText) {
      if (!this.isPM) {
        if (this.hours >= 6 && this.hours < 12) {
          skyIcon.textContent = '🌅';
          skyText.textContent = 'Pagi Hari (AM)';
        } else {
          skyIcon.textContent = '🌌';
          skyText.textContent = 'Dini Hari (AM)';
        }
      } else {
        if (this.hours >= 12 || this.hours < 3) {
          skyIcon.textContent = '☀️';
          skyText.textContent = 'Siang Hari (PM)';
        } else if (this.hours >= 3 && this.hours < 6) {
          skyIcon.textContent = '🌤️';
          skyText.textContent = 'Sore Hari (PM)';
        } else {
          skyIcon.textContent = '🌙';
          skyText.textContent = 'Malam Hari (PM)';
        }
      }
    }

    if (this.onTimeChangeCallback) {
      this.onTimeChangeCallback(this.hours, this.minutes, this.isPM, this.is24h);
    }
  }

  setupFormatControls() {
    const amBtn = this.container.querySelector('#am-btn');
    const pmBtn = this.container.querySelector('#pm-btn');
    const fmtBtn = this.container.querySelector('#fmt-toggle-btn');

    if (amBtn) {
      amBtn.addEventListener('click', () => {
        sound.playPop();
        this.isPM = false;
        amBtn.classList.add('active');
        if (pmBtn) pmBtn.classList.remove('active');
        this.updateHands();
      });
    }

    if (pmBtn) {
      pmBtn.addEventListener('click', () => {
        sound.playPop();
        this.isPM = true;
        pmBtn.classList.add('active');
        if (amBtn) amBtn.classList.remove('active');
        this.updateHands();
      });
    }

    if (fmtBtn) {
      fmtBtn.addEventListener('click', () => {
        sound.playPop();
        this.is24h = !this.is24h;
        fmtBtn.textContent = this.is24h ? 'Format: 24 Jam' : 'Format: 12 Jam (AM/PM)';
        this.updateHands();
      });
    }
  }

  setTime(h, m, isPM = false) {
    this.hours = h > 12 ? (h % 12 || 12) : (h === 0 ? 12 : h);
    this.minutes = m;
    this.isPM = isPM || (h >= 12);
    this.updateHands();
  }

  getTime() {
    return {
      hours: this.hours,
      minutes: this.minutes,
      isPM: this.isPM,
      hours24: this.isPM ? (this.hours === 12 ? 12 : this.hours + 12) : (this.hours === 12 ? 0 : this.hours)
    };
  }

  setupEvents() {
    if (!this.interactive || !this.svg) return;

    const hourGroup = this.container.querySelector('#hour-hand-group');
    const minuteGroup = this.container.querySelector('#minute-hand-group');

    const handlePointerDown = (e, handType) => {
      e.stopPropagation();
      this.isDragging = true;
      this.activeHand = handType;
      this.lastMinuteAngle = (this.minutes / 60) * 360;
      this.calculateAngleFromEvent(e);
    };

    if (hourGroup) {
      hourGroup.addEventListener('mousedown', (e) => handlePointerDown(e, 'hour'));
      hourGroup.addEventListener('touchstart', (e) => handlePointerDown(e, 'hour'), { passive: false });
    }

    if (minuteGroup) {
      minuteGroup.addEventListener('mousedown', (e) => handlePointerDown(e, 'minute'));
      minuteGroup.addEventListener('touchstart', (e) => handlePointerDown(e, 'minute'), { passive: false });
    }

    // Also fallback click anywhere on clock face
    this.svg.addEventListener('mousedown', (e) => {
      if (!this.isDragging) {
        // Decide which hand is closer to click point
        const pt = this.getClockPoint(e);
        const hourAngle = ((this.hours % 12) / 12) * 360 + (this.minutes / 60) * 30;
        const minuteAngle = (this.minutes / 60) * 360;

        const distToHourTip = Math.hypot(pt.x - (150 + 70 * Math.sin(hourAngle * Math.PI / 180)), pt.y - (150 - 70 * Math.cos(hourAngle * Math.PI / 180)));
        const distToMinuteTip = Math.hypot(pt.x - (150 + 110 * Math.sin(minuteAngle * Math.PI / 180)), pt.y - (150 - 110 * Math.cos(minuteAngle * Math.PI / 180)));

        const handType = distToHourTip < distToMinuteTip ? 'hour' : 'minute';
        handlePointerDown(e, handType);
      }
    });

    const handlePointerMove = (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      this.calculateAngleFromEvent(e);
    };

    const handlePointerUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.activeHand = null;
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);
  }

  getClockPoint(e) {
    const rect = this.svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (300 / rect.width),
      y: (clientY - rect.top) * (300 / rect.height)
    };
  }

  calculateAngleFromEvent(e) {
    const rect = this.svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angleDeg < 0) angleDeg += 360;

    if (this.activeHand === 'minute') {
      // 1-minute precision: 360 deg = 60 mins -> 6 deg per minute
      let mins = Math.round(angleDeg / 6);
      if (mins >= 60) mins = 0;

      // Handle continuous rotation hour step
      if (this.lastMinuteAngle !== null) {
        let currAngle = (mins / 60) * 360;
        let delta = currAngle - this.lastMinuteAngle;
        
        if (delta < -270) {
          // Wrapped clockwise 59 -> 0
          this.hours = (this.hours % 12) + 1;
        } else if (delta > 270) {
          // Wrapped counter-clockwise 0 -> 59
          this.hours = this.hours === 1 ? 12 : this.hours - 1;
        }
        this.lastMinuteAngle = currAngle;
      }

      if (mins !== this.minutes) {
        this.minutes = mins;
        sound.playTick();
        this.updateHands();
      }
    } else if (this.activeHand === 'hour') {
      // Hour hand drag: 360 deg = 12 hours -> 30 deg per hour
      let h = Math.round(angleDeg / 30);
      if (h === 0) h = 12;
      if (h > 12) h = 12;

      if (h !== this.hours) {
        this.hours = h;
        sound.playTick();
        this.updateHands();
      }
    }
  }
}
