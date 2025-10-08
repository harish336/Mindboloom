from dotenv import load_dotenv
import os
import secrets
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mindbloom.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Gemini API key config
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'YOUR_GEMINI_API_KEY_HERE')
if GEMINI_API_KEY != 'YOUR_GEMINI_API_KEY_HERE':
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("Warning: Gemini API key not configured. Using fallback responses.")

# Persistent system instruction
SYSTEM_PURPOSE = (
    "You are MindBloom, a compassionate and supportive AI assistant. "
    "Your role is to listen actively, validate feelings, and provide gentle mindfulness guidance. "
    "You are not a substitute for professional therapy. Keep answers empathetic and concise."
)

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    conversations = db.relationship('Conversation', backref='user', lazy=True, cascade='all, delete-orphan')
    mood_entries = db.relationship('MoodEntry', backref='user', lazy=True, cascade='all, delete-orphan')

class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), default='New Conversation')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    messages = db.relationship('Message', backref='conversation', lazy=True, cascade='all, delete-orphan')

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversation.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(10), nullable=False)  # 'user' or 'bot'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    sentiment_score = db.Column(db.Float, default=0.0)

class MoodEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mood = db.Column(db.String(20), nullable=False)
    intensity = db.Column(db.Integer, default=5)
    notes = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

# Therapy Bot Wrapper
class TherapyBot:
    def __init__(self):
        try:
            if GEMINI_API_KEY != 'YOUR_GEMINI_API_KEY_HERE':
                self.model = genai.GenerativeModel('gemini-2.5-flash')
            else:
                self.model = None
                print("Warning: Gemini API key not configured. Using fallback responses.")
        except Exception as e:
            print(f"Warning: Gemini API not configured properly: {e}")
            self.model = None

therapy_bot = TherapyBot()

# Routes and login/register/logout
@app.route('/')
def index():
    if current_user.is_authenticated:
        return render_template('chat.html', user=current_user)
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return jsonify({'success': True, 'message': 'Login successful'})
        else:
            return jsonify({'success': False, 'message': 'Invalid credentials'})
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if User.query.filter_by(username=username).first():
            return jsonify({'success': False, 'message': 'Username already exists'})
        if User.query.filter_by(email=email).first():
            return jsonify({'success': False, 'message': 'Email already registered'})

        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        db.session.add(user)
        db.session.commit()

        login_user(user)
        return jsonify({'success': True, 'message': 'Registration successful'})
    return render_template('register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/api/chat', methods=['POST'])
@login_required
def chat():
    data = request.get_json()
    user_message = data.get('message', '').strip()
    conversation_id = data.get('conversation_id')

    if not user_message:
        return jsonify({'error': 'Message cannot be empty'}), 400

    if conversation_id:
        conversation = Conversation.query.filter_by(id=conversation_id, user_id=current_user.id).first()
    else:
        conversation = Conversation(user_id=current_user.id, title=user_message[:50])
        db.session.add(conversation)
        db.session.flush()

    user_msg = Message(conversation_id=conversation.id, content=user_message, sender='user')
    db.session.add(user_msg)

    prompt = SYSTEM_PURPOSE + "\nUser: " + user_message + "\nAI:"
    try:
        if therapy_bot.model:
            gemini_response = therapy_bot.model.generate_content(prompt)
            bot_response = gemini_response.text
        else:
            bot_response = "Sorry, AI service not available now."
    except Exception:
        bot_response = "Sorry, I'm having trouble connecting to the AI service. Please try again later."

    bot_msg = Message(conversation_id=conversation.id, content=bot_response, sender='bot')
    db.session.add(bot_msg)
    db.session.commit()

    return jsonify({'response': bot_response, 'conversation_id': conversation.id})

def init_db():
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")

if __name__ == '__main__':
    init_db()
    print("Starting MindBloom Flask App on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
