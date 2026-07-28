# 🎈 Bibibo - Modular Interactive Kids Educational Web Games

<div align="center">

![Bibibo Banner](https://img.shields.io/badge/BIBIBO-Kids%20Web%20Game-FF5D8F?style=for-the-badge&logo=gamepad&logoColor=white)
[![Domain](https://img.shields.io/badge/Live_Domain-bibibo.my.id-3A86EF?style=for-the-badge&logo=google-chrome&logoColor=white)](https://bibibo.my.id)
[![License](https://img.shields.io/badge/License-MIT-06D6A0?style=for-the-badge)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-5.x-FFC436?style=for-the-badge&logo=vite&logoColor=black)](https://vitejs.dev/)

**Platform web game edukasi interaktif ramah anak dengan UI terang (*light theme*), penuh warna, ramah sentuhan, dan arsitektur modular yang dirancang untuk terus diperbarui dengan mini-game baru.**

[🌐 Live Demo (bibibo.my.id)](https://bibibo.my.id) • [📖 Panduan Pengembang](#-panduan-pengembangan-mini-game-baru) • [🚀 Cara Menjalankan](#-cara-menjalankan-proyek)

</div>

---

## 🌟 Fitur Utama

- 🎨 **Desain Light & Child-Friendly**: Antarmuka terang dengan warna pastel cerah (Sky Blue, Sunshine Yellow, Bubblegum Pink, Mint Green), tipografi bulat yang ramah anak (*Fredoka* & *Outfit*), serta efek tombol bouncy 3D.
- 🧩 **Arsitektur Modular Extensible**: Sistem *Mini-Game Registry Engine* yang memungkinkan penambahan atau pembaruan mini-game baru dengan sangat mudah tanpa mengubah kode inti aplikasi.
- ⏰ **Mini-Game 1: Belajar Membaca Jam (Clock Learning Adventure)**:
  - **Dual Draggable Hands**: Jarum pendek (jam) dan jarum panjang (menit) interaktif berbasis SVG yang dapat diputar langsung dengan drag sentuhan/mouse.
  - **Presisi 1 Menit**: Pergerakan jarum menit kontinyu per 1 menit ($0 - 59$).
  - **Bilingual (2 Bahasa)**: Mode Bahasa Indonesia 🇮🇩 (*"Jam 8 Pas"*, *"Setengah Sembilan"*, *"Jam 8 Seperempat"*) dan English 🇬🇧 (*"8 o'clock"*, *"Half past 8"*, *"Quarter past 8"*).
  - **Format 12-Jam & 24-Jam**: Sakelar AM/PM dan pemandangan langit dinamis (Pagi, Siang, Sore, Malam).
  - **3 Mode Permainan**: *Tebak Jam*, *Atur Jam*, dan *Dengar & Tebak*.
  - **5 Tingkat Kesulitan**: *Jam Pas*, *Setengah*, *Seperempat*, *5-Menit*, dan *1-Menit Detail*.
- 🔊 **Zero External Audio Assets**: Efek suara sintetis (suara *pop*, chime benar, wobble salah, *fanfare* selebrasi) menggunakan **Web Audio API** dan pembacaan suara menggunakan **Web Speech API** (TTS Bahasa Indonesia & Inggris).
- 🌟 **Sistem Bintang & Rekap Progres**: Hadiah bintang dan pencapaian level tersimpan secara lokal (*localStorage*).

---

## 🏗️ Arsitektur Proyek

Proyek ini dibangun menggunakan **Vite**, **Vanilla ES Modules**, dan **Vanilla CSS** untuk menjamin performa super cepat dan waktu muat instan tanpa dependensi framework yang berat.

```
bibibo/
├── index.html                  # Main SPA entry point & viewport setup
├── package.json                # Project manifest & build scripts
├── .gitignore                  # Git exclusion rules
├── README.md                   # Dokumentasi proyek profesional
└── src/
    ├── style.css               # Design system token & CSS utama
    ├── main.js                 # App initialization, router shell & event setup
    ├── core/
    ├── audio.js            # Synthesizer Web Audio API & TTS (ID/EN)
    ├── progress.js         # Manager bintang & progress (localStorage)
    └── registry.js         # Engine registrasi mini-game modular
    ├── components/
    │   ├── Logo.js             # SVG Mascot Vector & Typography BIBIBO
    │   └── Hub.js              # Tampilan Menu Utama (Grid Pilihan Game)
    └── games/
        └── clock-learning/     # MINI-GAME 1: Belajar Membaca Jam
            ├── index.js        # Entry point & game loop
            ├── AnalogClock.js  # Komponen SVG Jam Analog (Dual Draggable Hands)
            ├── modes.js        # Generator kuis bilingual ID/EN & format 12h/24h
            └── style.css       # Visual & kontrol game jam
```

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
- [Node.js](https://nodejs.org/) v18 atau lebih baru.
- `npm` atau `pnpm` / `yarn`.

### Langkah-Langkah

1. **Clone repositori**:
   ```bash
   git clone https://github.com/ddoz/bibibo.git
   cd bibibo
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan dev server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173`.

4. **Build untuk produksi**:
   ```bash
   npm run build
   ```
   Hasil build siap deploy akan berada di folder `dist/`.

---

## 🛠️ Panduan Pengembangan Mini-Game Baru

Proyek Bibibo dirancang sangat modular. Untuk menambahkan game edukasi baru (misalnya `mewarnai-angka`):

### 1. Buat Modul Game Baru
Buat folder di `src/games/mewarnai-angka/index.js` dengan struktur standar berikut:

```javascript
export default {
  id: 'mewarnai-angka',
  title: 'Mewarnai & Berhitung',
  description: 'Belajar berhitung sambil mewarnai gambar lucu bersama Bibibo!',
  icon: `🎨`,
  category: 'Kreativitas & Angka',
  badge: 'Baru',
  color: '#8338EC',

  init(container, context) {
    // Render UI Game ke dalam container
    container.innerHTML = `
      <div class="my-game-view">
        <h2>Selamat Datang di Game Mewarnai!</h2>
        <!-- Elemen game kamu di sini -->
      </div>
    `;

    return {
      destroy() {
        // Cleanup event listeners saat meninggalkan game
      }
    };
  }
};
```

### 2. Registrasikan Modul di `src/main.js`
Cukup tambahkan 2 baris di `src/main.js`:

```javascript
import mewarnaiGame from './games/mewarnai-angka/index.js';

// Registrasikan game ke registry
registry.register(mewarnaiGame);
```

Game baru akan secara otomatis muncul di menu utama (**Hub**) lengkap dengan kartu interaktif dan tombol main!

---

## 🌐 Deploy ke Custom Domain (`bibibo.my.id`)

Aplikasi ini dapat langsung di-deploy secara gratis ke **Cloudflare Pages**, **Vercel**, atau **Netlify**:

### Deploy via Cloudflare Pages
1. Hubungkan repositori GitHub ke Cloudflare Pages.
2. Set **Build command**: `npm run build`
3. Set **Build output directory**: `dist`
4. Di bagian **Custom Domains**, tambahkan `bibibo.my.id` dan arahkan CNAME ke Cloudflare Pages.

### Deploy via Vercel / Netlify
1. Import repositori GitHub.
2. Pilih preset **Vite**.
3. Hubungkan custom domain `bibibo.my.id` pada pengaturan domain.

---

## 🤝 Open Contribution & Komunitas

Kami mengundang **developer, pendidik, desainer, dan kreator** untuk bergabung memajukan pendidikan anak usia dini berbasis teknologi web interaktif! Proyek **Bibibo** sepenuhnya bersifat *Open Source*.

### 💡 Ide Mini-Game yang Bisa Kamu Buat:
- 🔤 **Membaca & Abjad**: Mengenal huruf, menyusun kata, dan membaca kalimat sederhana.
- ➕ **Matematika Dasar**: Berhitung benda, penjumlahan/pengurangan visual yang menyenangkan.
- 🎨 **Mewarnai & Bentuk**: Mengenal warna, geometri, dan mengasah kreativitas motorik anak.
- 🧩 **Logika & Puzzle**: Mencocokkan pola, memori kartu, dan teka-teki visual.
- 🕌 **Hijaiyah & Doa**: Pembelajaran huruf Hijaiyah interaktif dan doa harian anak.
- 🎵 **Musik & Lagu**: Bermain alat musik sederhana (pianika/xylophone) dan mengenal suara hewan.

### 📋 Cara Berkontribusi:

1. **Fork Repositori**: Klik button **Fork** di pojok kanan atas repositori `https://github.com/ddoz/bibibo`.
2. **Buat Branch Fitur Baru**:
   ```bash
   git checkout -b feature/mini-game-nama-game
   ```
3. **Kembangkan Mini-Game**: Ikuti [Panduan Pengembangan Mini-Game Baru](#-panduan-pengembangan-mini-game-baru).
4. **Commit & Push**:
   ```bash
   git commit -m "feat: menambah mini-game belajar mewarnai"
   git push origin feature/mini-game-nama-game
   ```
5. **Buat Pull Request (PR)**: Ajukan Pull Request ke branch `main` repositori utama dengan deskripsi game dan screenshot/GIF fitur.

---

## 📜 Lisensi

Hak Cipta © 2026 **Bibibo Team**.  
Proyek ini didistribusikan di bawah lisensi [MIT License](LICENSE).

