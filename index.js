const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const qrcode = require('qrcode-terminal');
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

// Inisialisasi Express untuk health check (diperlukan Pterodactyl)
const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Konfigurasi WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsapp-session'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// Variabel untuk menyimpan status bot
let botStatus = {
    isReady: false,
    lastActivity: new Date(),
    totalMessages: 0
};

// Fungsi untuk mengirim pesan ke Gemini AI
async function askGemini(question, chatHistory = []) {
    try {
        console.log('🤖 Mengirim pertanyaan ke Gemini:', question);
        
        // Membuat prompt dengan konteks
        let prompt = `Kamu adalah asisten AI WhatsApp yang ramah dan membantu. Jawab pertanyaan berikut dalam bahasa Indonesia dengan informatif dan mudah dipahami:\n\n${question}`;
        
        // Tambahkan riwayat chat jika ada
        if (chatHistory.length > 0) {
            prompt = `Riwayat percakapan:\n${chatHistory.join('\n')}\n\nPertanyaan saat ini: ${question}`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Respons dari Gemini berhasil diterima');
        return text;
    } catch (error) {
        console.error('❌ Error saat menghubungi Gemini:', error);
        return 'Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.';
    }
}

// Event ketika QR Code siap
client.on('qr', (qr) => {
    console.log('📱 QR Code WhatsApp Bot:');
    qrcode.generate(qr, { small: true });
    console.log('\n🔍 Scan QR code di atas dengan WhatsApp Anda untuk menghubungkan bot');
});

// Event ketika client siap
client.on('ready', () => {
    console.log('🚀 WhatsApp Bot dengan Gemini AI berhasil terkoneksi!');
    botStatus.isReady = true;
});

// Event ketika ada pesan masuk
client.on('message', async (message) => {
    try {
        // Update statistik
        botStatus.lastActivity = new Date();
        botStatus.totalMessages++;

        // Abaikan pesan dari status atau grup (opsional)
        if (message.from.includes('@g.us') && !message.mentionedIds.includes(client.info.wid._serialized)) {
            return; // Abaikan pesan grup kecuali bot di-mention
        }

        // Abaikan pesan dari bot sendiri
        if (message.fromMe) return;

        console.log(`📩 Pesan dari ${message.from}: ${message.body}`);

        // Cek jika pesan berisi media
        if (message.hasMedia) {
            const media = await message.downloadMedia();
            await message.reply('📸 Maaf, saat ini bot hanya dapat memproses pesan teks. Fitur analisis gambar akan segera tersedia!');
            return;
        }

        // Proses pesan teks
        const messageBody = message.body.trim();
        
        // Perintah khusus
        if (messageBody.toLowerCase() === '/start' || messageBody.toLowerCase() === '/help') {
            const helpMessage = `🤖 *WhatsApp Bot dengan Gemini AI*

📋 *Perintah yang tersedia:*
• /start atau /help - Menampilkan bantuan
• /status - Status bot
• /info - Informasi bot

💬 *Cara menggunakan:*
Kirim pesan apa saja dan bot akan menjawab menggunakan kecerdasan buatan Gemini!

Contoh:
• "Jelaskan tentang AI"
• "Buatkan resep masakan sederhana"
• "Apa itu coding?"

Powered by Gemini AI 🌟`;
            
            await message.reply(helpMessage);
            return;
        }

        if (messageBody.toLowerCase() === '/status') {
            const statusMessage = `📊 *Status Bot*

✅ Status: ${botStatus.isReady ? 'Online' : 'Offline'}
🕒 Aktivitas terakhir: ${botStatus.lastActivity.toLocaleString('id-ID')}
📨 Total pesan: ${botStatus.totalMessages}
🚀 Uptime: ${process.uptime().toFixed(0)} detik`;
            
            await message.reply(statusMessage);
            return;
        }

        if (messageBody.toLowerCase() === '/info') {
            const infoMessage = `ℹ️ *Informasi Bot*

🤖 Nama: WhatsApp Gemini Bot
🏷️ Versi: 1.0.0
⚡ Engine: Gemini AI
👨‍💻 Dibuat oleh: Dmaz Alyxers
🏠 Host: Pterodactyl Panel

Bot ini menggunakan teknologi AI terdepan dari Google untuk memberikan jawaban yang akurat dan membantu!`;
            
            await message.reply(infoMessage);
            return;
        }

        // Jika bukan perintah khusus, proses dengan Gemini
        if (messageBody.length > 0) {
            // Tampilkan indikator mengetik
            await message.reply('🤔 Sedang berpikir...');
            
            // Dapatkan respons dari Gemini
            const response = await askGemini(messageBody);
            
            // Format respons
            const formattedResponse = `🤖 *Gemini AI*\n\n${response}\n\n_Powered by Google Gemini_`;
            
            // Kirim respons
            await message.reply(formattedResponse);
        }

    } catch (error) {
        console.error('❌ Error saat memproses pesan:', error);
        await message.reply('❌ Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.');
    }
});

// Event error handling
client.on('auth_failure', (msg) => {
    console.error('❌ Autentikasi gagal:', msg);
});

client.on('disconnected', (reason) => {
    console.log('❌ Bot terputus:', reason);
    botStatus.isReady = false;
});

// Health check endpoint untuk Pterodactyl
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        bot: {
            ready: botStatus.isReady,
            lastActivity: botStatus.lastActivity,
            totalMessages: botStatus.totalMessages,
            uptime: process.uptime()
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: botStatus.isReady ? 'healthy' : 'unhealthy',
        uptime: process.uptime()
    });
});

// Mulai server Express
app.listen(PORT, () => {
    console.log(`🌐 Health check server berjalan di port ${PORT}`);
});

// Mulai WhatsApp client
console.log('🚀 Memulai WhatsApp Bot dengan Gemini AI...');
client.initialize();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('⏹️ Menghentikan bot...');
    await client.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('⏹️ Menghentikan bot...');
    await client.destroy();
    process.exit(0);
});