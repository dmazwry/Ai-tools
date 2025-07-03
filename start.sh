#!/bin/bash

# Script startup untuk Pterodactyl Panel
echo "🚀 Memulai WhatsApp Bot dengan Gemini AI..."

# Update package jika diperlukan
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Buat direktori session jika belum ada
mkdir -p whatsapp-session

# Set permissions
chmod +x start.sh

# Jalankan bot
echo "🤖 Starting bot..."
node index.js