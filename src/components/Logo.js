// Vector SVG Logo & Mascot Component for Bibibo

export function renderBibiboLogo(options = {}) {
  const size = options.size || 'normal'; // 'small', 'normal', 'large'
  const isInteractive = options.interactive !== false;
  
  const height = size === 'large' ? 90 : size === 'small' ? 44 : 64;

  return `
    <div class="bibibo-logo-container size-${size}" ${isInteractive ? 'title="Bibibo - Teman Belajar Anak"' : ''}>
      <svg class="bibibo-mascot-svg" height="${height}" viewBox="0 0 280 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Mascot Body Gradient -->
          <linearGradient id="bibiboBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FF5D8F" />
            <stop offset="50%" stop-color="#FF85A1" />
            <stop offset="100%" stop-color="#FFACC7" />
          </linearGradient>
          
          <!-- Text Gradient -->
          <linearGradient id="bibiboTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFC436" />
            <stop offset="100%" stop-color="#FF9800" />
          </linearGradient>

          <!-- Drop Shadow for 3D Game Effect -->
          <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#7209B7" flood-opacity="0.25"/>
          </filter>
        </defs>

        <!-- Cute Mascot Character (Bibibo Owl/Robot) -->
        <g class="mascot-group" filter="url(#dropShadow)">
          <!-- Wings / Ears -->
          <path class="wing-left" d="M12 28 C 4 35, 2 50, 14 58 C 20 54, 22 40, 18 30 Z" fill="#FF407D" />
          <path class="wing-right" d="M68 28 C 76 35, 78 50, 66 58 C 60 54, 58 40, 62 30 Z" fill="#FF407D" />

          <!-- Main Body Sphere -->
          <ellipse cx="40" cy="45" rx="28" ry="26" fill="url(#bibiboBodyGrad)" />
          
          <!-- White Belly Patch -->
          <ellipse cx="40" cy="53" rx="17" ry="14" fill="#FFFFFF" />

          <!-- Big Cute Eyes -->
          <circle cx="29" cy="38" r="10" fill="#FFFFFF" />
          <circle cx="51" cy="38" r="10" fill="#FFFFFF" />
          
          <!-- Pupils with Light Reflections -->
          <circle class="pupil-left" cx="30" cy="38" r="5.5" fill="#2B2D42" />
          <circle class="pupil-right" cx="50" cy="38" r="5.5" fill="#2B2D42" />
          
          <!-- Sparkle Dots in Eyes -->
          <circle cx="28" cy="35" r="2.2" fill="#FFFFFF" />
          <circle cx="48" cy="35" r="2.2" fill="#FFFFFF" />

          <!-- Cute Beak -->
          <polygon points="40,43 35,49 45,49" fill="#FF9800" rx="2" />

          <!-- Cheeks -->
          <ellipse cx="23" cy="45" rx="4" ry="2.5" fill="#FF85A1" opacity="0.8" />
          <ellipse cx="57" cy="45" rx="4" ry="2.5" fill="#FF85A1" opacity="0.8" />
          
          <!-- Small Feet -->
          <ellipse cx="32" cy="71" rx="5" ry="3" fill="#FF9800" />
          <ellipse cx="48" cy="71" rx="5" ry="3" fill="#FF9800" />
        </g>

        <!-- Bold Playful Typography "BIBIBO" -->
        <g class="text-group">
          <!-- Text 3D Shadow Backdrop -->
          <text x="82" y="62" font-family="'Fredoka', 'Segoe UI', cursive" font-size="46" font-weight="700" fill="#E65100">BIBIBO</text>
          <!-- Main Front Text -->
          <text x="80" y="58" font-family="'Fredoka', 'Segoe UI', cursive" font-size="46" font-weight="700" fill="url(#bibiboTextGrad)">BIBIBO</text>
          
          <!-- Shiny Highlight Strokes -->
          <text x="80" y="58" font-family="'Fredoka', 'Segoe UI', cursive" font-size="46" font-weight="700" fill="none" stroke="#FFF59D" stroke-width="1.5" stroke-dasharray="8 6">BIBIBO</text>
        </g>
        
        <!-- Floating Little Star Sparkle -->
        <path class="logo-sparkle" d="M 250 18 L 253 25 L 260 28 L 253 31 L 250 38 L 247 31 L 240 28 L 247 25 Z" fill="#FFD54F" />
      </svg>
    </div>
  `;
}
