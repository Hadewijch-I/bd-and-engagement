// Birthday Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add entrance animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.message-card, .timeline-item, .wish-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add random floating hearts
    createFloatingHearts();
    
    // Auto-trigger celebration after page load
    setTimeout(() => {
        showCelebration();
    }, 2000);
});

// Blow candle function
function blowCandle() {
    const flame = document.querySelector('.flame');
    const button = document.querySelector('.blow-candle-btn');
    
    if (flame && !flame.classList.contains('blown')) {
        // Blow out the candle
        flame.classList.add('blown');
        button.innerHTML = '<i class="fas fa-star"></i> Make another wish!';
        button.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
        
        // Show fireworks
        createFireworks();
        
        // Show celebration message
        showBirthdayMessage();
        
        // Add celebration class to cake
        document.querySelector('.cake').classList.add('celebration');
        
        setTimeout(() => {
            document.querySelector('.cake').classList.remove('celebration');
        }, 600);
        
    } else if (flame && flame.classList.contains('blown')) {
        // Relight the candle
        flame.classList.remove('blown');
        button.innerHTML = '<i class="fas fa-wind"></i> Make a wish and blow the candle!';
        button.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
    }
}

// Create fireworks animation
function createFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f093fb', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            firework.style.animationDelay = Math.random() * 0.5 + 's';
            
            fireworksContainer.appendChild(firework);
            
            // Remove firework after animation
            setTimeout(() => {
                firework.remove();
            }, 1000);
        }, i * 100);
    }
}

// Show birthday message
function showBirthdayMessage() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Create message box
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    messageBox.innerHTML = `
        <div style="color: #333; font-family: 'Dancing Script', cursive;">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px; color: #ff6b6b;">
                🎉 Wish Granted! 🎉
            </h2>
            <p style="font-size: 1.3rem; margin-bottom: 20px; font-family: 'Poppins', sans-serif;">
                Your wish has been sent to the stars! ✨
            </p>
            <p style="font-size: 1.1rem; margin-bottom: 30px; font-family: 'Poppins', sans-serif;">
                May this new year bring you endless joy, love, and beautiful memories together! 💕
            </p>
            <button onclick="closeBirthdayMessage()" style="
                background: linear-gradient(45deg, #4ecdc4, #44a08d);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 1rem;
                cursor: pointer;
                font-family: 'Poppins', sans-serif;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'" 
               onmouseout="this.style.transform='translateY(0)'">
                Continue Celebrating! 🎊
            </button>
        </div>
    `;
    
    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);
    
    // Trigger animations
    setTimeout(() => {
        overlay.style.opacity = '1';
        messageBox.style.transform = 'scale(1)';
    }, 10);
    
    // Store reference for closing
    window.birthdayMessageOverlay = overlay;
}

// Close birthday message
function closeBirthdayMessage() {
    const overlay = window.birthdayMessageOverlay;
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.querySelector('div').style.transform = 'scale(0.8)';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Create floating hearts animation
function createFloatingHearts() {
    const heartColors = ['#ff6b6b', '#ff8e8e', '#ffa8a8', '#ffb3b3'];
    
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 20 + 15}px;
                color: ${heartColors[Math.floor(Math.random() * heartColors.length)]};
                left: ${Math.random() * 100}vw;
                top: 100vh;
                pointer-events: none;
                z-index: 100;
                animation: floatUp 4s linear forwards;
                opacity: 0.7;
            `;
            
            document.body.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                heart.remove();
            }, 4000);
        }
    }, 2000);
}

// Add CSS for floating hearts animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Show celebration on page load
function showCelebration() {
    // Add a subtle entrance animation to the main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        mainTitle.style.animation = 'celebrate 0.8s ease';
    }
    
    // Create some initial floating hearts
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.cssText = `
                position: fixed;
                font-size: 25px;
                left: ${Math.random() * 100}vw;
                top: 100vh;
                pointer-events: none;
                z-index: 100;
                animation: floatUp 3s ease-out forwards;
            `;
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 200);
    }
}

// Add scroll effects
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Parallax effect for floating hearts in hero section
    const floatingHearts = document.querySelector('.floating-hearts');
    if (floatingHearts) {
        floatingHearts.style.transform = `translateY(${rate}px)`;
    }
});

// Add click effect to wish cards
document.querySelectorAll('.wish-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-5px)';
        }, 150);
        
        // Create small celebration
        createMiniFireworks(this);
    });
});

// Create mini fireworks for wish cards
function createMiniFireworks(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#ff6b6b', '#4ecdc4', '#feca57'];
    
    for (let i = 0; i < 5; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            pointer-events: none;
            z-index: 1000;
            animation: miniSpark 0.6s ease-out forwards;
        `;
        
        // Random direction
        const angle = (i / 5) * Math.PI * 2;
        const distance = 30;
        spark.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
        spark.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');
        
        document.body.appendChild(spark);
        
        setTimeout(() => {
            spark.remove();
        }, 600);
    }
}

// Add mini spark animation
const miniSparkStyle = document.createElement('style');
miniSparkStyle.textContent = `
    @keyframes miniSpark {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(miniSparkStyle);
