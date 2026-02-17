// ============================================
// A.I.M Website Professional JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // Hamburger Menu Toggle
    // ============================================
    const hamburger = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');
    const navMobileLinks = document.querySelectorAll('.nav-mobile-link');

    if (hamburger && navMobile) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMobile.classList.toggle('active');
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });

        navMobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
                hamburger.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // Smooth Scrolling
    // ============================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Scroll Animations - Intersection Observer
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    // ============================================
    // Header Background on Scroll
    // ============================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                category: document.getElementById('category').value,
                message: document.getElementById('message').value
            };

            if (!formData.name || !formData.email || !formData.category || !formData.message) {
                alert('必須項目を入力してください。');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('有効なメールアドレスを入力してください。');
                return;
            }

            try {
                console.log('Form submitted:', formData);

                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';

                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    contactForm.reset();
                }, 3000);

            } catch (error) {
                console.error('Form submission error:', error);
                alert('送信中にエラーが発生しました。もう一度お試しください。');
            }
        });
    }

    // ============================================
    // Number Counter Animation
    // ============================================
    const animateNumber = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    };

    const formatNumber = (num) => {
        const originalText = arguments[1];
        if (originalText && originalText.includes('万')) {
            return Math.floor(num / 10000) + '万+';
        } else if (originalText && originalText.includes('+')) {
            return num + '+';
        } else if (originalText && originalText.includes('%')) {
            return num + '%';
        }
        return num;
    };

    // Stats Counter
    const statNumbers = document.querySelectorAll('.stat-compact-number, .result-stat-number');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                const text = entry.target.textContent;
                const match = text.match(/(\d+)/);
                
                if (match) {
                    const number = parseInt(match[1]);
                    let target = number;
                    
                    if (text.includes('万')) {
                        target = number * 10000;
                    }
                    
                    if (number > 10) {
                        entry.target.textContent = '0';
                        setTimeout(() => {
                            animateNumber(entry.target, target, 1500);
                        }, 200);
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statObserver.observe(stat));

    // ============================================
    // Parallax Effect for Hero
    // ============================================
    const heroSection = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-bg-image');

    if (heroSection && heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            if (scrolled < heroSection.offsetHeight) {
                heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
        });
    }

    // ============================================
    // Image Loading Optimization
    // ============================================
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }

    // ============================================
    // Smooth Reveal on Load
    // ============================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-text > *');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 150);
        });
    });

    // ============================================
    // Enhanced Button Hover Effects
    // ============================================
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--x', `${x}px`);
            this.style.setProperty('--y', `${y}px`);
        });
    });

    // ============================================
    // Result Cards Hover Effect
    // ============================================
    const resultCards = document.querySelectorAll('.result-card-large');
    
    resultCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ============================================
    // Service Cards Interaction
    // ============================================
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach((item, index) => {
        item.style.setProperty('--delay', `${index * 0.1}s`);
    });

    // ============================================
    // Accessibility Enhancement
    // ============================================
    const skipLink = document.createElement('a');
    skipLink.href = '#services';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-blue);
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 8px 0;
        font-weight: 600;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ============================================
    // Console Message
    // ============================================
    console.log(
        '%c株式会社A.I.M', 
        'font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #0066FF, #00D4FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
    );
    console.log(
        '%c誰もが"好き"と"感謝"で生きていける社会を。', 
        'font-size: 16px; color: #334155;'
    );
    console.log('%cWebsite crafted with ❤️ by A.I.M Team', 'font-size: 12px; color: #0066FF;');
});
