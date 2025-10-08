# MindBloom Enhanced - Complete Setup Instructions

## 🌸 What You Have Now

You now have a complete, production-ready mental health chatbot with:

### ✅ Backend Features:
- **Flask Web Server** with SQLite database
- **User Authentication** (login/register)
- **Gemini AI Integration** for therapeutic conversations
- **Mood Tracking** with intensity levels
- **Conversation History** storage
- **Crisis Detection** and support resources
- **Sentiment Analysis** for user messages
- **Real-time Chat** with typing indicators

### ✅ Frontend Features:
- **Calming UI Design** with therapeutic colors
- **Working Avatar System** (user and bot avatars)
- **Voice Input** capability
- **Mood Selector** with emoji feedback
- **Responsive Design** (mobile-friendly)
- **Crisis Support Modal** with emergency resources
- **Quick Reply Buttons**
- **Character Counter** and input validation

## 🚀 How to Run It

### Step 1: Install Dependencies
```bash
# Install Python packages
pip install Flask Flask-SQLAlchemy Flask-Login Werkzeug google-generativeai textblob python-dotenv gunicorn

# Or use requirements.txt
pip install -r requirements.txt
```

### Step 2: Set Up Environment
1. Copy `.env.template` to `.env`
2. Get your Gemini API key from: https://aistudio.google.com/app/apikey
3. Add it to the `.env` file:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 3: Initialize Database
```bash
python -c "from app import app, db; app.app_context().push(); db.create_all(); print('Database created!')"
```

### Step 4: Run the Application
```bash
python app.py
```

Visit: **http://localhost:5000**

## 📁 Project Structure
```
mindbloom-enhanced/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env.template         # Environment variables template
├── templates/
│   ├── chat.html         # Main chat interface
│   ├── login.html        # Login page
│   └── register.html     # Registration page
├── static/
│   ├── css/
│   │   ├── style.css     # Main application styles
│   │   └── auth.css      # Authentication styles
│   └── js/
│       ├── app.js        # Main application JavaScript
│       └── auth.js       # Authentication JavaScript
└── mindbloom.db          # SQLite database (created automatically)
```

## 🔧 Key Features Working

### 1. User Authentication
- Users can register and login
- Sessions are maintained
- Password hashing for security

### 2. AI Chatbot (Gemini Integration)
- Empathetic, therapeutic responses
- Context-aware conversations
- Crisis detection and intervention
- CBT-style coping strategies

### 3. Mood Tracking
- 5 mood options with emojis
- Intensity slider (1-10)
- Historical mood data storage

### 4. Working Avatars
- User avatar (blue circle with person icon)
- Bot avatar (green flower design representing MindBloom)
- All SVG-based for crisp display

### 5. Voice Input
- Speech-to-text functionality
- Browser-based speech recognition
- Fallback for unsupported browsers

## 🎨 Design Philosophy

The interface follows mental health design principles:
- **Calming Colors**: Soft blues, greens, and warm grays
- **Therapeutic Typography**: Clean, readable fonts
- **Cognitive Load Reduction**: Minimal, uncluttered design
- **Empathetic Language**: Supportive, non-judgmental tone
- **Crisis Support**: Always-accessible emergency resources

## 🛠 Customization Options

### Change Bot Personality
Edit the `_build_therapy_context()` method in `app.py` to modify the bot's therapeutic approach.

### Add New Moods
Update both the HTML template and JavaScript to add new mood options.

### Modify Colors
Edit the CSS variables in `static/css/style.css` to change the color scheme.

### Database Configuration
Change `SQLALCHEMY_DATABASE_URI` in `app.py` to use PostgreSQL or MySQL instead of SQLite.

## 🚨 Important Notes

1. **API Key Security**: Never commit your actual Gemini API key to version control
2. **Crisis Situations**: The app detects crisis keywords and shows emergency resources
3. **Privacy**: Conversations are stored locally in your database
4. **Mobile Ready**: The interface works on all screen sizes
5. **Production Setup**: Use gunicorn for production deployment

## 🌟 Next Steps

You can enhance this further by adding:
- Email notifications
- Professional therapist referrals
- Group chat support
- Advanced analytics
- Mobile app version
- Multilingual support

Your MindBloom Enhanced chatbot is now ready to provide compassionate mental health support! 🌸
