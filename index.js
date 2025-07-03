import dotenv from 'dotenv';
dotenv.config();

import makeWABot, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import { GoogleGenerativeAI } from '@google/generative-ai';

const BOT_NAME = process.env.BOT_NAME || 'GeminiBot';

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const sock = makeWABot({
    auth: state,
    printQRInTerminal: true,
    logger: { level: 'silent' }
  });

  // Display QR in terminal
  sock.ev.on('connection.update', (update) => {
    const { connection, qr, lastDisconnect } = update;
    if (qr) qrcode.generate(qr, { small: true });
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason !== DisconnectReason.loggedOut) start(); // auto-reconnect
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Gemini client
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return; // ignore own messages

    const sender = msg.key.remoteJid;
    const textMsg = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!textMsg) return;

    try {
      const result = await model.generateContent(textMsg);
      const reply = result.response.text().replace(/\*\*/g, ''); // strip bold markdown

      await sock.sendMessage(sender, {
        text: reply || '(Maaf, saya tidak punya jawaban.)'
      }, { quoted: msg });
    } catch (e) {
      console.error(e);
      await sock.sendMessage(sender, { text: 'Terjadi kesalahan :(' }, { quoted: msg });
    }
  });

  console.log(`${BOT_NAME} sudah siap 🚀`);
}

start();