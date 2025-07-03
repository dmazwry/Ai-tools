# 🤖 WhatsApp Bot dengan Gemini AI

Bot WhatsApp yang terintegrasi dengan Google Gemini AI, dirancang khusus untuk deployment di **Pterodactyl Panel**.

## ✨ Fitur

- 🚀 **Integrasi Gemini AI** - Respons cerdas menggunakan AI terbaru dari Google
- 💬 **Chat Interaktif** - Bot merespons semua pesan teks secara otomatis
- 📊 **Monitoring Status** - Health check dan statistik penggunaan
- 🔧 **Easy Setup** - Konfigurasi mudah di Pterodactyl Panel
- 🛡️ **Error Handling** - Penanganan error yang robust
- 📱 **QR Code Scanner** - Koneksi WhatsApp melalui QR Code

## 📋 Persyaratan

### Sistem
- **Node.js** versi 16.0.0 atau lebih baru
- **RAM** minimal 512MB (direkomendasikan 1GB)
- **Storage** minimal 1GB
- **Pterodactyl Panel** dengan egg Node.js

### API Keys
- **Gemini API Key** dari Google AI Studio

## 🚀 Cara Install di Pterodactyl Panel

### 1. Persiapan API Key

1. Buka [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google
3. Klik "Create API Key"
4. Salin API Key yang dihasilkan

### 2. Setup di Pterodactyl Panel

1. **Buat Server Baru**
   - Login ke Pterodactyl Panel
   - Pilih "Create Server"
   - Pilih egg **Node.js** atau **Generic Node.js**

2. **Upload Files**
   - Upload semua file project ke direktori server
   - Pastikan semua file tersedia: `package.json`, `index.js`, `.env.example`, dll.

3. **Konfigurasi Environment**
   - Rename `.env.example` menjadi `.env`
   - Edit file `.env` dan isi:
   ```bash
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3000
   NODE_ENV=production
   ```

4. **Install Dependencies**
   - Buka console Pterodactyl
   - Jalankan perintah:
   ```bash
   npm install
   ```

5. **Start Bot**
   - Klik tombol "Start" di panel
   - Atau jalankan: `npm start`

### 3. Koneksi WhatsApp

1. **Lihat QR Code**
   - Setelah bot berjalan, QR Code akan muncul di console
   - Salin QR Code dari log

2. **Scan dengan WhatsApp**
   - Buka WhatsApp di HP
   - Menu → Linked Devices → Link a Device
   - Scan QR Code yang muncul

3. **Verifikasi Koneksi**
   - Tunggu pesan "WhatsApp Bot dengan Gemini AI berhasil terkoneksi!"
   - Bot siap digunakan!

## 🔧 Konfigurasi Lanjutan

### File .env
```bash
# Wajib diisi
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000

# Opsional
NODE_ENV=production
AI_TIMEOUT=30000
BOT_NAME=WhatsApp Gemini Bot
ADMIN_NUMBER=628xxxxxxxxx
ALLOW_GROUP_CHAT=false
```

### Startup Command untuk Pterodactyl
```bash
if [[ -d .git ]] && [[ "{{AUTO_UPDATE}}" == "1" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; /usr/local/bin/node /home/container/{{BOT_JS_FILE}}
```

## 📱 Cara Menggunakan Bot

### Perintah Dasar
- `/start` atau `/help` - Menampilkan bantuan
- `/status` - Cek status bot
- `/info` - Informasi bot

### Chat dengan AI
Cukup kirim pesan apa saja ke bot, contoh:
- "Jelaskan tentang artificial intelligence"
- "Buatkan resep nasi goreng"
- "Apa itu programming?"
- "Translate 'hello world' ke bahasa Indonesia"

### Contoh Interaksi
```
User: Hai bot!
Bot: 🤖 Halo! Saya adalah asisten AI WhatsApp. Ada yang bisa saya bantu?

User: Jelaskan tentang AI
Bot: 🤖 Gemini AI

Artificial Intelligence (AI) atau Kecerdasan Buatan adalah...
[respons lengkap dari Gemini]

Powered by Google Gemini
```

## 🔍 Monitoring & Debugging

### Health Check
Bot menyediakan endpoint untuk monitoring:
- `http://your-server:3000/` - Status lengkap
- `http://your-server:3000/health` - Health check

### Log Monitoring
Pantau log di Pterodactyl console untuk:
- Status koneksi WhatsApp
- Pesan masuk/keluar
- Error handling
- Statistik penggunaan

### Common Issues

**Bot tidak terkoneksi:**
- Pastikan QR Code sudah di-scan
- Cek koneksi internet server
- Restart bot jika diperlukan

**Gemini tidak merespons:**
- Verifikasi API Key valid
- Cek quota API Gemini
- Pastikan koneksi internet stabil

**Memory issues:**
- Allocate minimal 512MB RAM
- Monitor penggunaan memory
- Restart periodic jika diperlukan

## 📊 Struktur Project

```
whatsapp-gemini-bot/
├── package.json           # Dependencies & scripts
├── index.js              # Main bot application
├── .env.example          # Environment configuration template
├── .env                  # Your actual environment variables
├── start.sh              # Startup script
├── pterodactyl.json      # Pterodactyl Panel configuration
├── README.md             # Documentation
├── whatsapp-session/     # WhatsApp auth session (auto-generated)
└── logs/                 # Log files (auto-generated)
```

## 🛠️ Kustomisasi

### Menambah Fitur
Edit file `index.js` untuk menambah:
- Perintah khusus baru
- Integrasi API lain
- Handler media (gambar, dokumen)
- Database integration

### Mengubah Respons
Modifikasi function `askGemini()` untuk:
- Mengubah prompt AI
- Menambah context
- Format respons khusus

## 🚨 Keamanan

- **Jangan share** API Key Gemini
- **Gunakan** environment variables untuk kredensial
- **Batasi** akses admin jika diperlukan
- **Monitor** penggunaan API quota

## 📞 Support

Jika mengalami masalah:

1. **Cek dokumentasi** ini terlebih dahulu
2. **Periksa logs** di Pterodactyl console
3. **Verify** semua konfigurasi sudah benar
4. **Restart** bot jika diperlukan

## 📄 Lisensi

MIT License - bebas digunakan untuk project pribadi dan komersial.

## 🔗 Links

- [Google AI Studio](https://makersuite.google.com/)
- [Pterodactyl Panel](https://pterodactyl.io/)
- [WhatsApp Business API](https://business.whatsapp.com/)

---

**Dibuat dengan ❤️ oleh Dmaz Alyxers**

🌟 **Powered by Google Gemini AI & Pterodactyl Panel**