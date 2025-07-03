# 🚀 Setup Local - WhatsApp Gemini Bot

Panduan setup bot WhatsApp dengan Gemini AI di komputer lokal untuk testing sebelum deploy ke Pterodactyl Panel.

## 📋 Persyaratan

- **Node.js** versi 16+ ([Download](https://nodejs.org/))
- **Git** untuk clone repository
- **Gemini API Key** dari [Google AI Studio](https://makersuite.google.com/app/apikey)

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Clone repository (jika menggunakan Git)
git clone <repository-url>
cd whatsapp-gemini-bot

# Atau download ZIP dan extract

# Install dependencies
npm install
```

### 2. Konfigurasi Environment

```bash
# Copy file environment
cp .env.example .env

# Edit file .env dengan editor favorit
nano .env
# atau
code .env
```

Isi file `.env`:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

### 3. Jalankan Bot

```bash
# Development mode (dengan auto-restart)
npm run dev

# Atau production mode
npm start
```

### 4. Koneksi WhatsApp

1. Setelah bot berjalan, QR Code akan muncul di terminal
2. Buka WhatsApp di HP → Menu → Linked Devices → Link a Device
3. Scan QR Code yang muncul di terminal
4. Tunggu pesan "WhatsApp Bot dengan Gemini AI berhasil terkoneksi!"

### 5. Test Bot

Kirim pesan ke nomor WhatsApp yang sudah terkoneksi:
- `/start` - Lihat bantuan
- `/status` - Cek status bot
- "Hai bot!" - Chat dengan AI

## 🔧 Development Tips

### Auto-Restart dengan Nodemon
```bash
npm run dev
```

### Debugging
```bash
# Set log level untuk debugging
NODE_ENV=development npm start
```

### Health Check
Buka browser: `http://localhost:3000`

### Stop Bot
Tekan `Ctrl + C` di terminal

## 🚨 Troubleshooting

### QR Code tidak muncul
- Pastikan terminal mendukung ASCII art
- Coba install: `npm install qrcode-terminal`

### Error "puppeteer not found"
```bash
npm install puppeteer
```

### Error koneksi Gemini
- Verifikasi API Key valid
- Cek koneksi internet
- Pastikan quota API tidak habis

### Bot tidak merespons
- Cek log di terminal
- Restart bot: `Ctrl + C` → `npm start`
- Verifikasi WhatsApp masih terkoneksi

## 📁 File yang dihasilkan

Setelah running, akan terbuat:
- `whatsapp-session/` - Session WhatsApp
- `logs/` - File log (jika dikonfigurasi)

## ➡️ Deploy ke Pterodactyl

Setelah testing lokal berhasil:

1. **Upload files** ke server Pterodactyl
2. **Konfigurasi** environment di panel
3. **Install** dependencies di server
4. **Start** bot di Pterodactyl Panel

Lihat `README.md` untuk panduan lengkap Pterodactyl deployment.

## 🆘 Bantuan

Jika ada masalah:
1. Cek log error di terminal
2. Pastikan semua dependencies terinstall
3. Verifikasi file `.env` sudah benar
4. Restart bot dan coba lagi

---

**Happy coding! 🎉**