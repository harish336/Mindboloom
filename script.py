# Let's create the integrated version that combines your frontend with the complete backend system

# First, let's create an updated HTML template that matches your structure but works with Flask
updated_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MindBloom Enhanced - Mental Health Support</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>
    <div class="app-container">
        <!-- Left Sidebar -->
        <aside class="sidebar">
            <!-- User Profile Section -->
            <div class="user-profile">
                <div class="user-avatar">
                    <img src="https://via.placeholder.com/60x60/4A90E2/FFFFFF?text={{ current_user.username[0].upper() if current_user.is_authenticated else 'G' }}" alt="{{ current_user.username if current_user.is_authenticated else 'Guest' }}" class="avatar-image">
                </div>
                <div class="user-info">
                    <h3 class="user-name">{{ current_user.username if current_user.is_authenticated else 'Alex Chen' }}</h3>
                    <p class="user-greeting">Hello, {{ current_user.username if current_user.is_authenticated else 'Alex' }}!</p>
                    <p class="user-subtext">How are you today?</p>
                </div>
            </div>

            <!-- Mood Selector -->
            <div class="mood-selector">
                <h4 class="mood-title">Current Mood</h4>
                <div class="mood-buttons">
                    <button class="mood-btn mood-anxious" data-mood="Anxious" title="Anxious"></button>
                    <button class="mood-btn mood-calm" data-mood="Calm" title="Calm"></button>
                    <button class="mood-btn mood-sad" data-mood="Sad" title="Sad"></button>
                    <button class="mood-btn mood-happy" data-mood="Happy" title="Happy"></button>
                    <button class="mood-btn mood-neutral" data-mood="Neutral" title="Neutral"></button>
                </div>
            </div>

            <!-- Navigation Menu -->
            <nav class="sidebar-nav">
                <ul class="nav-list">
                    <li class="nav-item active">
                        <a href="#chat" class="nav-link">
                            <span class="nav-icon">💬</span>
                            <span class="nav-text">Chat</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#journal" class="nav-link">
                            <span class="nav-icon">📔</span>
                            <span class="nav-text">Journal</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#resources" class="nav-link">
                            <span class="nav-icon">📚</span>
                            <span class="nav-text">Resources</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#settings" class="nav-link">
                            <span class="nav-icon">⚙️</span>
                            <span class="nav-text">Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <!-- New Check-in Button -->
            <div class="sidebar-footer">
                <button class="checkin-btn" id="newCheckinBtn">
                    <span class="checkin-icon">✨</span>
                    <span class="checkin-text">New Check-in</span>
                </button>
            </div>
        </aside>

        <!-- Main Chat Area -->
        <div class="chat-area">
            <!-- Chat Header -->
            <header class="chat-header">
                <div class="chat-title">
                    <div class="bot-info">
                        <div class="bot-avatar">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="16" r="16" fill="#E8F5E8"/>
                                <g transform="translate(16,16)">
                                    <path d="M0-6 L2-4 L0-2 L-2-4 Z" fill="#4CAF50" opacity="0.7"/>
                                    <path d="M6 0 L4 2 L2 0 L4-2 Z" fill="#4CAF50" opacity="0.7"/>
                                    <path d="M0 6 L-2 4 L0 2 L2 4 Z" fill="#4CAF50" opacity="0.7"/>
                                    <path d="M-6 0 L-4-2 L-2 0 L-4 2 Z" fill="#4CAF50" opacity="0.7"/>
                                    <circle cx="0" cy="0" r="2" fill="#81C784"/>
                                </g>
                            </svg>
                        </div>
                        <div class="bot-details">
                            <h2 class="bot-name">MindBloom</h2>
                            <div class="bot-status">
                                <div class="status-indicator online"></div>
                                <span class="status-text">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-actions">
                    <button class="action-btn crisis-btn" title="Crisis Support">
                        <span>🆘</span>
                    </button>
                </div>
            </header>

            <!-- Messages Container -->
            <div class="chat-messages" id="chatMessages">
                <!-- Date Separator -->
                <div class="date-separator">
                    <span class="date-text">Today</span>
                </div>

                <!-- Sample conversation to match your design -->
                <div class="message-group">
                    <div class="message user-message">
                        <div class="message-content">
                            <div class="message-text">I've been feeling really overwhelmed lately</div>
                            <div class="message-time">10:00 AM</div>
                        </div>
                    </div>

                    <div class="message bot-message">
                        <div class="message-avatar">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="12" fill="#E8F5E8"/>
                                <g transform="translate(12,12)">
                                    <circle cx="0" cy="0" r="1.5" fill="#81C784"/>
                                </g>
                            </svg>
                        </div>
                        <div class="message-content">
                            <div class="message-text">I'm sorry you're feeling overwhelmed, Alex. That sounds really difficult. Take a deep breath with me - what's one small thing that's been weighing on your mind?</div>
                            <div class="message-time">10:01 AM</div>
                        </div>
                    </div>

                    <div class="message user-message">
                        <div class="message-content">
                            <div class="message-text">I'm worried about everything</div>
                            <div class="message-time">10:02 AM</div>
                        </div>
                    </div>

                    <div class="message bot-message">
                        <div class="message-avatar">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="12" fill="#E8F5E8"/>
                                <g transform="translate(12,12)">
                                    <circle cx="0" cy="0" r="1.5" fill="#81C784"/>
                                </g>
                            </svg>
                        </div>
                        <div class="message-content">
                            <div class="message-text">MindBloom understands that anxiety can make everything feel urgent. Let's try a grounding technique together - can you name 3 things you can see right now?</div>
                            <div class="message-time">10:03 AM</div>
                        </div>
                    </div>
                </div>

                <!-- Typing indicator -->
                <div class="typing-indicator" id="typingIndicator" style="display: none;">
                    <div class="message-avatar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="12" fill="#E8F5E8"/>
                            <g transform="translate(12,12)">
                                <circle cx="0" cy="0" r="1.5" fill="#81C784"/>
                            </g>
                        </svg>
                    </div>
                    <div class="typing-content">
                        <div class="typing-dots">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                        <div class="typing-text">MindBloom is thinking...</div>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="chat-input">
                <div class="input-container">
                    <button class="voice-btn" id="voiceBtn" title="Voice Input">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M9 11C10.1046 11 11 10.1046 11 9V3C11 1.89543 10.1046 1 9 1C7.89543 1 7 1.89543 7 3V9C7 10.1046 7.89543 11 9 11Z" fill="currentColor"/>
                            <path d="M14 9V10C14 12.7614 11.7614 15 9 15C6.23858 15 4 12.7614 4 10V9H3V10C3 13.3137 5.68629 16 9 16C12.3137 16 15 13.3137 15 10V9H14Z" fill="currentColor"/>
                        </svg>
                    </button>
                    <textarea 
                        id="messageInput" 
                        placeholder="Type your message..."
                        rows="1"
                        maxlength="1000"
                    ></textarea>
                    <button class="send-btn" id="sendBtn" title="Send Message">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M1 9L17 1L15 9L17 17L1 9Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Footer -->
            <footer class="chat-footer">
                <div class="footer-content">
                    <div class="footer-links">
                        <a href="#privacy" class="footer-link">Privacy Policy</a>
                        <a href="#terms" class="footer-link">Terms of Service</a>
                    </div>
                    <div class="footer-info">
                        <span>Priage 5+ Octs</span>
                    </div>
                </div>
            </footer>
        </div>
    </div>

    <!-- Crisis Modal -->
    <div class="modal" id="crisisModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Crisis Support Resources</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="crisis-resources">
                    <div class="resource-item urgent">
                        <h4>🚨 Immediate Help</h4>
                        <p><strong>National Suicide Prevention Lifeline:</strong> <a href="tel:988">988</a></p>
                        <p><strong>Crisis Text Line:</strong> Text HOME to <a href="sms:741741">741741</a></p>
                    </div>
                    <div class="resource-item">
                        <h4>📞 24/7 Support</h4>
                        <p><strong>SAMHSA National Helpline:</strong> <a href="tel:1-800-662-4357">1-800-662-HELP</a></p>
                        <p>Free, confidential, 24/7 treatment referral service</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="{{ url_for('static', filename='js/app.js') }}"></script>
</body>
</html>"""

# Save the updated HTML template
with open('templates/chat.html', 'w', encoding='utf-8') as f:
    f.write(updated_html)

print("✅ Updated HTML template with your design integrated!")