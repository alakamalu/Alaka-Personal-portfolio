/**
 * Modern Portfolio JS Actions - Alaka P
 * --------------------------------------------------------------------------
 * Features:
 * - Scroll Progress & Sticky Navigation header states.
 * - Responsive Mobile Hamburger menu toggles.
 * - Interactive Neural Network canvas drawing on Hero.
 * - Intersection Observer scroll reveals.
 * - Interactive dynamic filter for skills.
 * - Simulated validation & submissions for the contact form.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. Initial Elements & Year Update
    // ---------------------------------------------------------
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ---------------------------------------------------------
    // 2. Scroll Progress & Sticky Navigation Header
    // ---------------------------------------------------------
    const scrollProgress = document.getElementById('scroll-progress');
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Calculate scroll progress percentage
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            const percentage = (window.scrollY / scrollHeight) * 100;
            scrollProgress.style.width = `${percentage}%`;
        }

        // Header background toggle on scroll
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting based on section scroll position
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    // ---------------------------------------------------------
    // 3. Mobile Hamburger Menu Toggle
    // ---------------------------------------------------------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close mobile drawer when link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // ---------------------------------------------------------
    // 4. Intersection Observer for Scroll Reveals
    // ---------------------------------------------------------
    const revealItems = document.querySelectorAll('.reveal-item');
    
    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once animated in
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null, // viewport
            threshold: 0.1, // trigger when 10% visible
            rootMargin: '0px 0px -50px 0px' // offset triggers slightly
        });

        revealItems.forEach(item => {
            revealObserver.observe(item);
        });
    } else {
        // Fallback for older browsers
        revealItems.forEach(item => item.classList.add('revealed'));
    }

    // ---------------------------------------------------------
    // 5. Interactive Neural Network / Data Particles Canvas
    // ---------------------------------------------------------
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        let particles = [];
        const maxParticles = width < 400 ? 35 : 55; // adaptive density
        const connectDistance = 75;

        // Track Mouse Coords
        let mouse = {
            x: null,
            y: null,
            radius: 95
        };

        const wrapper = canvas.closest('.canvas-wrapper');
        if (wrapper) {
            wrapper.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            });

            wrapper.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });
        }

        // Particle Class
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2.5 + 1.5;
            }

            update() {
                // Bounds wrapping
                if (this.x < 0 || this.x > width) this.vx = -this.vx;
                if (this.y < 0 || this.y > height) this.vy = -this.vy;

                // Simple magnetic attraction to mouse cursor
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= dx * force * 0.03;
                        this.y -= dy * force * 0.03;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(37, 99, 235, 0.7)'; // primary blue alpha
                ctx.fill();
            }
        }

        // Initialize points array
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        // Canvas animation frame loop
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw connection segments
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectDistance) {
                        const alpha = (connectDistance - dist) / connectDistance;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.25})`; // Cyan lines
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Connect to mouse pointer
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const alpha = (mouse.radius - dist) / mouse.radius;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.35})`; // blue mouse connection
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        animate();

        // Responsive resize scaling
        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            particles.forEach(p => p.reset());
        });
    }

    // ---------------------------------------------------------
    // 6. Skills Category Filters
    // ---------------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const skillBadges = document.querySelectorAll('.skill-badge');
    const skillCatCards = document.querySelectorAll('.skill-cat-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all tabs, add to current
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');

            // 1. Filter floating badges
            skillBadges.forEach(badge => {
                const badgeCategory = badge.getAttribute('data-category');
                if (selectedCategory === 'all' || badgeCategory === selectedCategory) {
                    badge.style.display = 'inline-flex';
                    // Animation trigger scale-in
                    setTimeout(() => {
                        badge.style.opacity = '1';
                        badge.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    badge.style.opacity = '0';
                    badge.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        badge.style.display = 'none';
                    }, 200);
                }
            });

            // 2. Filter categorized cards (lowering opacity of non-matches for layout preservation)
            skillCatCards.forEach(card => {
                const cardMatches = card.getAttribute('data-cat-match').split(',');
                if (selectedCategory === 'all' || cardMatches.includes(selectedCategory)) {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'all';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.opacity = '0.25';
                    card.style.pointerEvents = 'none';
                    card.style.transform = 'translateY(5px)';
                }
            });
        });
    });

    // ---------------------------------------------------------
    // 7. Contact Form Handling
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('btn-submit-form');
    const submitText = document.getElementById('submit-text');

    if (contactForm && formFeedback && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const message = document.getElementById('form-message').value.trim();

            // Validate fields
            if (!name || !email || !message) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitText.textContent = 'Sending Message...';
            const icon = submitBtn.querySelector('i');
            icon.className = 'fa-solid fa-spinner fa-spin';

            // Simulate server network submit latency
            setTimeout(() => {
                // Success actions
                showFeedback(`Thank you, ${name}! Your message has been sent successfully. Alaka will contact you soon.`, 'success');
                contactForm.reset();

                // Reset button states
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitText.textContent = 'Send Message';
                icon.className = 'fa-solid fa-paper-plane';
            }, 1200);
        });

        function showFeedback(text, type) {
            formFeedback.textContent = text;
            formFeedback.className = 'form-message-container'; // clear previous state
            
            if (type === 'success') {
                formFeedback.classList.add('form-message-success');
            } else {
                formFeedback.classList.add('form-message-error');
            }

            // Scroll feedback into view
            formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Self-dismiss after 6 seconds
            setTimeout(() => {
                formFeedback.style.opacity = '0';
                setTimeout(() => {
                    formFeedback.className = 'form-message-container';
                    formFeedback.style.opacity = '1';
                    formFeedback.textContent = '';
                }, 400);
            }, 6000);
        }
    }
});
