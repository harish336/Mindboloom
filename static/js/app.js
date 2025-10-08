class MindBloomChat {
  constructor() {
    this.currentMood = null;
    this.isTyping = false;
    this.messageInput = document.getElementById('messageInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.chatMessages = document.getElementById('chatMessages');
    this.newCheckinBtn = document.getElementById('newCheckinBtn');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupAutoResize();
    this.scrollToBottom();
    this.setupQuickReplies();
    this.setupMoodSelector();
    this.setupNavigation();
  }

  setupEventListeners() {
    this.sendBtn.addEventListener('click', async () => await this.sendMessage());
    this.messageInput.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        await this.sendMessage();
      }
    });
    this.messageInput.addEventListener('input', () => this.validateInput());
    document.querySelector('.voice-btn')?.addEventListener('click', () => this.handleVoiceInput());
    if (this.newCheckinBtn) {
      this.newCheckinBtn.addEventListener('click', () => this.startNewCheckin());
    }
  }

  setupAutoResize() {
    this.messageInput.addEventListener('input', () => {
      this.messageInput.style.height = 'auto';
      this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    });
  }

  setupQuickReplies() {
    document.addEventListener('click', async (e) => {
      if (e.target.classList.contains('quick-reply-btn')) {
        const replyText = e.target.textContent;
        this.addMessage('user', replyText, this.getCurrentTime());
        await this.generateBotResponse(replyText);
      }
    });
  }

  setupMoodSelector() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        this.selectMood(btn);
        if (btn.dataset.mood) {
          await this.sendMoodUpdate(btn.dataset.mood);
        }
      });
    });
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNavigation(link);
      });
    });
  }

  selectMood(selectedBtn) {
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
    selectedBtn.classList.add('active');
    this.currentMood = selectedBtn.dataset.mood;
  }

  async sendMoodUpdate(mood) {
    const moodMessages = {
      'Anxious': "I'm feeling anxious right now",
      'Calm': "I'm feeling calm at the moment",
      'Sad': "I'm feeling sad today",
      'Happy': "I'm feeling happy right now",
      'Neutral': "I'm feeling neutral today"
    };
    if (moodMessages[mood]) {
      this.addMessage('user', moodMessages[mood], this.getCurrentTime());
      await this.generateBotResponse(moodMessages[mood]);
    }
  }

  validateInput() {
    const hasText = this.messageInput.value.trim().length > 0;
    this.sendBtn.disabled = !hasText;
    this.sendBtn.style.opacity = hasText ? '1' : '0.5';
  }

  async sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message) return;
    this.addMessage('user', message, this.getCurrentTime());
    this.messageInput.value = '';
    this.messageInput.style.height = 'auto';
    this.validateInput();
    await this.generateBotResponse(message);
  }

  async generateBotResponse(userMessage) {
    this.showTypingIndicator();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      this.hideTypingIndicator();
      this.addMessage('bot', data.response, this.getCurrentTime());
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('bot', "Sorry, I'm having trouble responding right now. Please try again.", this.getCurrentTime());
    }
  }

  addMessage(sender, text, time) {
    // Find the .message-group container inside .chat-messages
    let messageGroup = this.chatMessages.querySelector('.message-group');
    if (!messageGroup) {
      // If none exists, create one
      messageGroup = document.createElement('div');
      messageGroup.className = 'message-group';
      this.chatMessages.appendChild(messageGroup);
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    // For bot, also include avatar
    if (sender === 'bot') {
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'message-avatar';
      avatarDiv.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#E8F5E8"/>
          <g transform="translate(12,12)">
            <circle cx="0" cy="0" r="1.5" fill="#81C784"/>
          </g>
        </svg>
      `;
      messageDiv.appendChild(avatarDiv);
    }
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `
      <div class="message-text">${text}</div>
      <div class="message-time">${time}</div>
    `;
    messageDiv.appendChild(contentDiv);
    messageGroup.appendChild(messageDiv);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
  }

  showTypingIndicator() {
    // Optionally, implement a .typing-indicator bubble if desired
  }

  hideTypingIndicator() {
    // Optionally, remove .typing-indicator bubble if desired
  }

  handleVoiceInput() {
    alert("Voice input feature is not implemented yet.");
  }

  startNewCheckin() {
    this.messageInput.value = '';
    this.validateInput();
  }

  handleNavigation(link) {
    alert(`Navigated to: ${link.textContent}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new MindBloomChat();
});
