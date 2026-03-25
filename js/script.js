document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade-in elements on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .about-content, .comparison-table, .hero-text, .hero-visual, .section-title, .section-subtitle, .download-card, .opensource-visual, .opensource-text, .testimonials-text, .testimonials-visual, .faq-header, .faq-item, .community-content, .footer-content');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Cursor glow and dynamic background removed


    // 3D Tilt Effect removed


    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(13, 13, 16, 0.95)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(13, 13, 16, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });


    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
    // --- Performance Optimization: Pause Animations & Videos when out of view ---
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Function to handle video playback based on visibility
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const hasVideo = entry.target.querySelectorAll('video');
            if (entry.isIntersecting) {
                // Play if not reduced motion
                if (!reduceMotionQuery.matches) {
                    hasVideo.forEach(video => {
                        if (video.paused) {
                            video.play().catch(e => console.log("Auto-play prevented:", e));
                        }
                    });
                    entry.target.classList.remove('paused-animation');
                }
            } else {
                // Pause when out of view
                hasVideo.forEach(video => {
                    if (!video.paused) {
                        video.pause();
                    }
                });
                entry.target.classList.add('paused-animation');
            }
        });
    }, { threshold: 0.1 });

    // Target sections with heavy animations
    const animatedSections = document.querySelectorAll('.hero, .testimonials-section, .opensource-section');
    animatedSections.forEach(section => {
        videoObserver.observe(section);
    });

    // Handle Reduced Motion Change
    reduceMotionQuery.addEventListener('change', () => {
        if (reduceMotionQuery.matches) {
            document.querySelectorAll('video').forEach(v => v.pause());
            document.body.classList.add('paused-animation');
        } else {
            document.body.classList.remove('paused-animation');
            // Re-trigger playback if in view? IntersectionObserver will handle on next scroll
        }
    });

    // Initial check for reduced motion
    if (reduceMotionQuery.matches) {
        document.body.classList.add('paused-animation');
        document.querySelectorAll('video').forEach(v => v.pause());
    }
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle icon
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            });
        });
    }

    // Reels Carousel Controls
    const reelsCarousel = document.querySelector('.reels-carousel');
    const reelsNavButtons = document.querySelectorAll('.reels-nav');

    if (reelsCarousel && reelsNavButtons.length) {
        const getScrollDelta = () => {
            const firstCard = reelsCarousel.querySelector('.reel-card');
            if (!firstCard) return 300;

            const gap = parseFloat(getComputedStyle(reelsCarousel).gap || '0') || 0;
            const cardWidth = firstCard.getBoundingClientRect().width;
            return cardWidth + gap;
        };

        reelsNavButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.getAttribute('data-direction');
                const delta = getScrollDelta();
                reelsCarousel.scrollBy({
                    left: direction === 'left' ? -delta : delta,
                    behavior: 'smooth'
                });
            });
        });
    }
});
