#!/bin/bash
# MindBloom Enhanced - Quick Start Script

echo "🌸 MindBloom Enhanced - Mental Health Chatbot 🌸"
echo "=============================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📚 Installing dependencies..."
    pip install -r requirements.txt
fi

# Check if .env exists, if not create from template
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env file from template..."
    if [ -f ".env.template" ]; then
        cp .env.template .env
        echo "📝 Please edit .env file and add your Gemini API key"
        echo "   Get one at: https://aistudio.google.com/app/apikey"
    fi
fi

echo ""
echo "🚀 Starting MindBloom Enhanced..."
echo "📍 Available at: http://localhost:5000"
echo ""

# Run the application
python app.py
