// Birthday Website JavaScript

// Initialize time synchronization
let timeSync;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize time synchronization with fallback mechanisms for GitHub Pages
    try {
        timeSync = new TimeSync({
            onSyncComplete: function(data) {
                console.log('Time synchronized with offset:', data.offset);
                // Check celebration date after time sync
                checkCelebrationDate();
                
                // Update countdown immediately after sync
                updateCountdown();
            }
        }).start();
    } catch (e) {
        console.error('Error initializing TimeSync:', e);
        // Create a dummy TimeSync object as fallback
        timeSync = {
            getTimeRemaining: function(targetDate) {
                return Math.max(0, targetDate - Date.now());
            }
        };
    }

    // Handle loading screen
    window.addEventListener('load', function() {
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                    
                    // After loading screen disappears, check if we should show content
                    checkCelebrationDate();
                }, 500);
            }
        }, 1500);
    });
    
    // Initial countdown update - make sure this runs regardless of TimeSync status
    updateCountdown();
    
    // Set up regular interval for countdown (every second)
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Ensure the interval keeps running even if there are errors
    window.addEventListener('error', function(e) {
        if (!countdownInterval) {
            console.log('Restarting countdown interval after error');
            setInterval(updateCountdown, 1000);
        }
    });
    
    // Set up the interval to check the date
    setInterval(checkCelebrationDate, 1000);
});

// Target date: September 5th, 2025 at 00:00:00
const TARGET_DATE = new Date('September 5, 2025 00:00:00').getTime();

// Check if we've reached the celebration date
function checkCelebrationDate() {
    // Use the synchronized time
    const timeRemaining = timeSync ? 
        timeSync.getTimeRemaining(TARGET_DATE) : 
        Math.max(0, TARGET_DATE - Date.now());
    
    const preCelebrationSection = document.getElementById('pre-celebration-section');
    const celebrationContent = document.getElementById('celebration-content');
    
    if (timeRemaining <= 0) {
        // It's celebration time!
        if (preCelebrationSection && !preCelebrationSection.classList.contains('content-transition-out')) {
            // Transition out the countdown
            preCelebrationSection.classList.add('content-transition-out');
            
            setTimeout(() => {
                // Hide countdown completely
                preCelebrationSection.style.display = 'none';
                
                // Show celebration content
                if (celebrationContent) {
                    celebrationContent.classList.remove('hidden-content');
                    celebrationContent.classList.add('fade-in');
                    
                    // Initialize celebration components
                    initCelebration();
                }
            }, 1000);
        }
    } else {
        // Not time yet, ensure countdown is visible and celebration is hidden
        if (preCelebrationSection) {
            preCelebrationSection.style.display = 'flex';
        }
        if (celebrationContent) {
            celebrationContent.classList.add('hidden-content');
        }
    }
}

// Update the countdown timer
function updateCountdown() {
    try {
        // Use the synchronized time with fallback to local time
        const timeRemaining = (timeSync && typeof timeSync.getTimeRemaining === 'function') ? 
            timeSync.getTimeRemaining(TARGET_DATE) : 
            Math.max(0, TARGET_DATE - Date.now());
        
        // If we've passed the target date
        if (timeRemaining <= 0) {
            document.getElementById('pre-days').textContent = '00';
            document.getElementById('pre-hours').textContent = '00';
            document.getElementById('pre-minutes').textContent = '00';
            document.getElementById('pre-seconds').textContent = '00';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Make sure all DOM elements exist before accessing them
        const preDaysElement = document.getElementById('pre-days');
        const preHoursElement = document.getElementById('pre-hours');
        const preMinutesElement = document.getElementById('pre-minutes');
        const preSecondsElement = document.getElementById('pre-seconds');
        
        // Only update if elements exist
        if (preDaysElement && preHoursElement && preMinutesElement && preSecondsElement) {
            preDaysElement.textContent = days.toString().padStart(2, '0');
            preHoursElement.textContent = hours.toString().padStart(2, '0');
            preMinutesElement.textContent = minutes.toString().padStart(2, '0');
            preSecondsElement.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Calculate and display remaining time in a more readable format
        const remainingTimeElement = document.getElementById('remaining-time-display');
        if (remainingTimeElement) {
            let timeDisplay = '';
            
            if (days > 0) {
                timeDisplay += `${days} day${days !== 1 ? 's' : ''}, `;
            }
            
            if (days > 0 || hours > 0) {
                timeDisplay += `${hours} hour${hours !== 1 ? 's' : ''}, `;
            }
            
            if (days > 0 || hours > 0 || minutes > 0) {
                timeDisplay += `${minutes} minute${minutes !== 1 ? 's' : ''}, `;
            }
            
            timeDisplay += `${seconds} second${seconds !== 1 ? 's' : ''}`;
            
            remainingTimeElement.textContent = timeDisplay;
        }
        
        // If we're close to the celebration time (within the last hour), check more frequently
        if (timeRemaining < 60 * 60 * 1000) {
            checkCelebrationDate();
        }
    } catch (e) {
        console.error('Error in updateCountdown:', e);
    }
}

// Initialize all celebration components
function initCelebration() {
    // Initialize countdown timer for the main celebration page
    initCountdownTimer();
    
    // Add smooth scroll behavior for internal links
    initSmoothScroll();

    // Use Intersection Observer for efficient animations
    initAnimationObserver();

    // Add random floating hearts
    createFloatingHearts();
    
    // Auto-trigger celebration after page load
    setTimeout(() => {
        showCelebration();
        createFireworks();
    }, 2000);
    
    // Initialize gallery lightbox
    initGalleryLightbox();
    
    // Initialize wish form
    initWishForm();
}

// Initialize smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Countdown Timer for the main celebration page
function initCountdownTimer() {
    // This function now just updates the engagement day countdown on the main celebration page
    const targetDate = TARGET_DATE;
    
    function updateMainCountdown() {
        // Use the synchronized time
        const timeRemaining = timeSync ? 
            timeSync.getTimeRemaining(targetDate) : 
            Math.max(0, targetDate - Date.now());
        
        // If the date has passed, show celebration message
        if (timeRemaining <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            
            // Show celebration message
            const countdownContainer = document.querySelector('.countdown-container:not(.large-countdown)');
            if (countdownContainer) {
                countdownContainer.innerHTML = '<div class="celebration-message">🎉 Happy Birthday & Engagement Day! 🎉</div>';
            }
            return;
        }
        
        // Time calculations
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Display the result
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update countdown every second
    updateMainCountdown(); // Run once immediately
    setInterval(updateMainCountdown, 1000);
}

// Efficient Animation Observer
function initAnimationObserver() {
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers that don't support IntersectionObserver
        const animatedElements = document.querySelectorAll('.message-card, .timeline-item, .wish-card, .gallery-item, .form-container');
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.message-card, .timeline-item, .wish-card, .gallery-item, .form-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
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

// Gallery Lightbox
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    if (!galleryItems.length || !lightbox || !lightboxImg || !lightboxCaption) return;
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-caption');
            
            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption ? caption.textContent : '';
            lightbox.style.display = 'flex';
            
            // Prevent body scrolling when lightbox is open
            document.body.style.overflow = 'hidden';
        });
        
        // Keyboard accessibility
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Close lightbox
    closeLightbox.addEventListener('click', closeLightboxFunction);
    lightbox.addEventListener('click', function(e) {
        if (e.target === this) {
            closeLightboxFunction();
        }
    });
    
    // Close with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightboxFunction();
        }
    });
    
    function closeLightboxFunction() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Wish Form Handling
function initWishForm() {
    const wishForm = document.getElementById('wishForm');
    const wishConfirmation = document.getElementById('wishConfirmation');
    
    if (!wishForm || !wishConfirmation) return;
    
    wishForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        const name = this.querySelector('#name').value.trim();
        const relationship = this.querySelector('#relationship').value;
        const message = this.querySelector('#wishMessage').value.trim();
        
        if (!name || !message) {
            alert('Please fill out all required fields.');
            return;
        }
        
        // In a real application, you would send this data to a server
        console.log('Wish submitted:', { name, relationship, message });
        
        // Show confirmation and reset form
        wishForm.style.display = 'none';
        wishConfirmation.classList.remove('hidden');
        
        // Create celebratory effect
        createFireworks();
        
        // Reset form for future submissions
        setTimeout(() => {
            this.reset();
            wishForm.style.display = 'flex';
            wishConfirmation.classList.add('hidden');
        }, 5000);
    });
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
    
    // Make this function accessible to the window scope for the button click
    window.closeBirthdayMessage = function() {
        overlay.style.opacity = '0';
        messageBox.style.transform = 'scale(0.8)';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    };
    
    // Trigger animations
    setTimeout(() => {
        overlay.style.opacity = '1';
        messageBox.style.transform = 'scale(1)';
    }, 10);
}

// Create floating hearts animation with performance optimization
function createFloatingHearts() {
    const heartColors = ['#ff6b6b', '#ff8e8e', '#ffa8a8', '#ffb3b3'];
    let activeHearts = 0;
    const maxHearts = 15; // Limit maximum hearts for performance
    
    setInterval(() => {
        if (Math.random() < 0.3 && activeHearts < maxHearts) { // 30% chance + limit
            activeHearts++;
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
                will-change: transform, opacity;
            `;
            
            document.body.appendChild(heart);
            
            // Remove heart after animation and update counter
            setTimeout(() => {
                heart.remove();
                activeHearts--;
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
    
    /* Animation class for Intersection Observer */
    .animated {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* Celebration message style */
    .celebration-message {
        background: linear-gradient(45deg, #ff6b6b, #f9ca24);
        color: white;
        padding: 15px 30px;
        border-radius: 30px;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
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
                will-change: transform, opacity;
            `;
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 3000);
        }, i * 200);
    }
}

// Add scroll effects with performance optimization
let lastScrollPosition = window.pageYOffset;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollPosition = window.pageYOffset;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            applyScrollEffects(lastScrollPosition);
            ticking = false;
        });
        
        ticking = true;
    }
});

function applyScrollEffects(scrolled) {
    const rate = scrolled * -0.5;
    
    // Parallax effect for floating hearts in hero section
    const floatingHearts = document.querySelector('.floating-hearts');
    if (floatingHearts) {
        floatingHearts.style.transform = `translateY(${rate}px)`;
    }
    
    // Add more scroll effects here if needed
}

// Add click effect to wish cards
document.querySelectorAll('.wish-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
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
            will-change: transform, opacity;
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
    
    @keyframes celebrate {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(miniSparkStyle);
