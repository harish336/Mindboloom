// MindBloom Enhanced - Authentication JavaScript
// Handles login, registration, and form validation with therapeutic design principles

class AuthManager {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupVisualEnhancements();
        console.log('MindBloom Auth Manager initialized 🌸');
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Real-time input validation
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('focus', () => this.clearInputError(input));
        });
    }

    setupFormValidation() {
        // Therapeutic validation messages
        this.validationMessages = {
            username: {
                required: 'Please choose a username that feels right for you',
                minLength: 'Your username should be at least 3 characters',
                maxLength: 'Please keep your username under 20 characters',
                invalid: 'Usernames can only contain letters, numbers, and underscores'
            },
            email: {
                required: "We'll need your email address to keep your account secure",
                invalid: 'Please enter a valid email address'
            },
            password: {
                required: 'Please create a password to protect your private conversations',
                minLength: 'For your security, please use at least 8 characters',
                weak: 'Consider adding numbers or symbols to make your password stronger'
            }
        };
    }

    setupVisualEnhancements() {
        // Add gentle animations
        const authCard = document.querySelector('.auth-card');
        if (authCard) {
            authCard.style.animation = 'gentleAppear 0.8s ease-out';
        }

        // Enhanced focus effects
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('input-focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentNode.classList.remove('input-focused');
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get('username')?.trim();
        const password = formData.get('password');
        
        // Validate inputs
        if (!this.validateLoginForm(username, password)) {
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.setLoadingState(submitBtn, true, 'Signing you in...');

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('Welcome back! Redirecting to your safe space...', 'success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                this.showMessage(data.message || "We couldn't sign you in. Please check your credentials.", 'error');
                this.shakeForm(e.target);
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showMessage("We're having trouble connecting right now. Please try again in a moment.", 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const username = formData.get('username')?.trim();
        const email = formData.get('email')?.trim();
        const password = formData.get('password');
        
        if (!this.validateRegisterForm(username, email, password)) {
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.setLoadingState(submitBtn, true, 'Creating your account...');

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (data.success) {
                this.showMessage('Welcome to MindBloom! Your safe space is ready...', 'success');
                this.celebrateRegistration();
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                this.showMessage(data.message || "We couldn't create your account. Please try again.", 'error');
                this.shakeForm(e.target);
            }

        } catch (error) {
            console.error('Registration error:', error);
            this.showMessage("We're having trouble connecting right now. Please try again in a moment.", 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    validateLoginForm(username, password) {
        let isValid = true;

        if (!username) {
            this.showInputError('username', this.validationMessages.username.required);
            isValid = false;
        }

        if (!password) {
            this.showInputError('password', this.validationMessages.password.required);
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(username, email, password) {
        let isValid = true;

        // Username validation
        if (!username) {
            this.showInputError('username', this.validationMessages.username.required);
            isValid = false;
        } else if (username.length < 3) {
            this.showInputError('username', this.validationMessages.username.minLength);
            isValid = false;
        } else if (username.length > 20) {
            this.showInputError('username', this.validationMessages.username.maxLength);
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            this.showInputError('username', this.validationMessages.username.invalid);
            isValid = false;
        }

        // Email validation
        if (!email) {
            this.showInputError('email', this.validationMessages.email.required);
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showInputError('email', this.validationMessages.email.invalid);
            isValid = false;
        }

        // Password validation
        if (!password) {
            this.showInputError('password', this.validationMessages.password.required);
            isValid = false;
        } else if (password.length < 8) {
            this.showInputError('password', this.validationMessages.password.minLength);
            isValid = false;
        }

        return isValid;
    }

    validateInput(input) {
        const value = input.value.trim();
        const name = input.name;
        
        this.clearInputError(input);

        switch (name) {
            case 'username':
                if (value && (value.length < 3 || value.length > 20)) {
                    this.showInputError(name, 
                        value.length < 3 ? 
                        this.validationMessages.username.minLength : 
                        this.validationMessages.username.maxLength
                    );
                } else if (value && !/^[a-zA-Z0-9_]+$/.test(value)) {
                    this.showInputError(name, this.validationMessages.username.invalid);
                } else if (value) {
                    this.showInputSuccess(input);
                }
                break;
                
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showInputError(name, this.validationMessages.email.invalid);
                } else if (value) {
                    this.showInputSuccess(input);
                }
                break;
                
            case 'password':
                if (value && value.length < 8) {
                    this.showInputError(name, this.validationMessages.password.minLength);
                } else if (value && this.getPasswordStrength(value) < 3) {
                    this.showInputWarning(name, this.validationMessages.password.weak);
                } else if (value) {
                    this.showInputSuccess(input);
                }
                break;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    getPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    }

    showInputError(fieldName, message) {
        const input = document.querySelector(`input[name="${fieldName}"]`);
        if (!input) return;

        input.classList.add('input-error');
        input.classList.remove('input-success', 'input-warning');
        this.showFieldMessage(input, message, 'error');
    }

    showInputWarning(fieldName, message) {
        const input = document.querySelector(`input[name="${fieldName}"]`);
        if (!input) return;

        input.classList.add('input-warning');
        input.classList.remove('input-error', 'input-success');
        this.showFieldMessage(input, message, 'warning');
    }

    showInputSuccess(input) {
        input.classList.add('input-success');
        input.classList.remove('input-error', 'input-warning');
        this.clearFieldMessage(input);
    }

    clearInputError(input) {
        input.classList.remove('input-error', 'input-success', 'input-warning');
        this.clearFieldMessage(input);
    }

    showFieldMessage(input, message, type) {
        this.clearFieldMessage(input);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `field-message field-message-${type}`;
        messageDiv.textContent = message;
        
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            formGroup.appendChild(messageDiv);
        }
    }

    clearFieldMessage(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const existingMessage = formGroup.querySelector('.field-message');
            if (existingMessage) {
                existingMessage.remove();
            }
        }
    }

    showMessage(text, type) {
        const existingMessages = document.querySelectorAll('.auth-message');
        existingMessages.forEach(msg => msg.remove());

        const message = document.createElement('div');
        message.className = `auth-message auth-message-${type}`;
        message.textContent = text;

        const form = document.querySelector('.auth-form');
        if (form) {
            form.insertBefore(message, form.firstChild);
            
            if (type === 'success') {
                setTimeout(() => {
                    if (message.parentNode) {
                        message.style.animation = 'gentleFadeOut 0.5s ease-out';
                        setTimeout(() => message.remove(), 500);
                    }
                }, 4000);
            }
        }
    }

    setLoadingState(button, loading, loadingText = 'Please wait...') {
        if (loading) {
            button.disabled = true;
            button.classList.add('btn-loading');
            button.dataset.originalText = button.textContent;
            button.innerHTML = `
                <div class="loading-spinner"></div>
                <span>${loadingText}</span>
            `;
        } else {
            button.disabled = false;
            button.classList.remove('btn-loading');
            button.textContent = button.dataset.originalText || 'Submit';
        }
    }

    shakeForm(form) {
        form.style.animation = 'gentleShake 0.5s ease-in-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }

    celebrateRegistration() {
        const authCard = document.querySelector('.auth-card');
        if (authCard) {
            authCard.style.animation = 'gentleCelebrate 1s ease-out';
            this.createFloatingElements();
        }
    }

    createFloatingElements() {
        const container = document.body;
        const elements = ['🌸', '✨', '💚', '🌱'];
        
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = 'floating-element';
                element.textContent = elements[Math.floor(Math.random() * elements.length)];
                element.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}vw;
                    top: 100vh;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 9999;
                    animation: floatUp 3s ease-out forwards;
                `;
                
                container.appendChild(element);
                setTimeout(() => element.remove(), 3000);
            }, i * 200);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Add therapeutic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes gentleAppear {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    @keyframes gentleShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes gentleCelebrate {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    @keyframes floatUp {
        from { transform: translateY(0) rotate(0deg); opacity: 1; }
        to { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    
    @keyframes gentleFadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
    
    .input-focused {
        transform: translateY(-1px);
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);

console.log('🌸 MindBloom Auth System ready - Creating safe spaces for healing');
