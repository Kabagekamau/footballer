document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

function downloadAllFiles() {
    const files = [
        { name: 'index.html', type: 'text/html' },
        { name: 'ajax.html', type: 'text/html' },
        { name: 'arsenal.html', type: 'text/html' },
        { name: 'kenya.html', type: 'text/html' },
        { name: 'styles.css', type: 'text/css' },
        { name: 'script.js', type: 'text/javascript' }
    ];

    files.forEach((file, index) => {
        setTimeout(() => {
            downloadFile(file.name, file.type);
        }, index * 200);
    });

    showNotification('Downloading all files...');
}

function downloadFile(filename, fileType) {
    fetch(filename)
        .then(response => response.text())
        .then(content => {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:' + fileType + ';charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        })
        .catch(error => {
            console.error('Error downloading file:', error);
            showNotification('Error downloading: ' + filename, true);
        });
}

function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${isError ? '#c41e3a' : '#1a472a'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.profile-card, .club-card, .info-box, .stat-card, .highlight-box');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 10) {
            navbar.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
        } else {
            navbar.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
        }
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

document.querySelectorAll('.club-card').forEach(card => {
    card.addEventListener('click', function() {
        const link = this.querySelector('.club-link');
        if (link) {
            window.location.href = link.getAttribute('href');
        }
    });
});

window.addEventListener('load', () => {
    document.querySelectorAll('.stat-value, .stat-number, .achievement-value').forEach(el => {
        if (el.textContent.match(/^\d+/)) {
            const finalValue = el.textContent;
            const finalNumber = parseInt(finalValue);
            if (!isNaN(finalNumber)) {
                animateNumber(el, 0, finalNumber, 2000);
            }
        }
    });
});

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const originalText = element.textContent;
    const suffix = originalText.replace(/\d+/g, '').trim();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString() + (suffix ? ' ' + suffix : '');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Stephen Kabage Kamau Profile - The G.O.A.T loaded successfully');
