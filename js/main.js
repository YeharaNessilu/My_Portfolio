        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile Navigation Toggle
            const mobileToggle = document.getElementById('mobileToggle');
            const nav = document.getElementById('nav');

            mobileToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                mobileToggle.classList.toggle('active');
                if (mobileToggle.classList.contains('active')) {
                    mobileToggle.innerHTML = '<i class="icon i-xmark" aria-hidden="true"></i>';
                } else {
                    mobileToggle.innerHTML = '<i class="icon i-bars" aria-hidden="true"></i>';
                }
            });

            // Smooth Scrolling for Anchor Links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        mobileToggle.classList.remove('active');
                        mobileToggle.innerHTML = '<i class="icon i-bars" aria-hidden="true"></i>';
                    }

                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Scroll Indicator Click
            document.getElementById('scrollIndicator').addEventListener('click', () => {
                const aboutSection = document.getElementById('about');
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });

            // Active Navigation Link on Scroll
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');

            function setActiveLink() {
                const scrollPosition = window.scrollY;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            }

            // Scroll Progress Bar
            const scrollProgress = document.getElementById('scrollProgress');
            
            function updateScrollProgress() {
                const scrollTop = window.scrollY;
                const docHeight = document.body.offsetHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                scrollProgress.style.width = scrollPercent + '%';
            }

            window.addEventListener('scroll', () => {
                setActiveLink();
                updateScrollProgress();
            });

            // Header Scroll Effect
            const header = document.querySelector('.header');
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // Scroll to Top Button
            const scrollTopBtn = document.getElementById('scrollTop');
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    scrollTopBtn.classList.add('active');
                } else {
                    scrollTopBtn.classList.remove('active');
                }
            });
            
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Contact form
            // Messages are sent through FormSubmit (https://formsubmit.co): no backend needed.
            // The FIRST message triggers an activation email to the address below; click the link once and it works.
            // To use Formspree instead, replace FORM_ENDPOINT with your https://formspree.io/f/xxxxxxx URL.
            const CONTACT_EMAIL = 'yeharanessilu123@gmail.com';
            const FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + CONTACT_EMAIL;
            const contactForm = document.getElementById('contactForm');
            const submitBtn = document.getElementById('submitBtn');
            const statusEl = document.getElementById('formStatus');

            function setStatus(msg, type) {
                statusEl.textContent = msg;
                statusEl.className = 'form-status' + (type ? ' ' + type : '');
            }

            function openMailApp(name, email, subject, message) {
                const body = message + '\n\n- ' + name + ' (' + email + ')';
                window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            }

            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const data = new FormData(contactForm);
                if (data.get('_honey')) return; // bot trap

                const name = (data.get('name') || '').trim();
                const email = (data.get('email') || '').trim();
                const subject = (data.get('subject') || '').trim();
                const message = (data.get('message') || '').trim();

                if (!name || !email || !subject || !message) {
                    setStatus('Please fill in all fields.', 'error');
                    return;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setStatus('Please enter a valid email address.', 'error');
                    return;
                }

                submitBtn.disabled = true;
                setStatus('Sending...', '');
                try {
                    const res = await fetch(FORM_ENDPOINT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({
                            name, email, subject, message,
                            _subject: 'Portfolio message: ' + subject,
                            _replyto: email,
                            _template: 'table',
                            _captcha: 'false'
                        })
                    });
                    const out = await res.json().catch(() => ({}));
                    if (res.ok && String(out.success) !== 'false') {
                        contactForm.reset();
                        setStatus("Thank you! Your message has been sent. I'll get back to you soon.", 'success');
                    } else {
                        throw new Error('send failed');
                    }
                } catch (err) {
                    setStatus('Could not send directly, opening your email app instead...', 'error');
                    openMailApp(name, email, subject, message);
                } finally {
                    submitBtn.disabled = false;
                }
            });


            // Parallax Effect
            const parallaxElements = document.querySelectorAll('.floating-shape');
            
            window.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                parallaxElements.forEach(element => {
                    const speed = 0.05;
                    const x = (window.innerWidth - mouseX * speed) / 100;
                    const y = (window.innerHeight - mouseY * speed) / 100;
                    
                    element.style.transform = `translateX(${x}px) translateY(${y}px)`;
                });
            });

            // Typed Text Effect
            const typedText = document.querySelector('.typed-text');
            const texts = ['Yehara Nethsilu', 'Full Stack Developer', 'Software Engineering Undergraduate', 'Java & Spring Boot Developer'];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typingSpeed = 100;

            function type() {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    typedText.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                    typingSpeed = 50;
                } else {
                    typedText.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                    typingSpeed = 100;
                }
                
                if (!isDeleting && charIndex === currentText.length) {
                    isDeleting = true;
                    typingSpeed = 1000; // Pause at the end
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    typingSpeed = 500; // Pause before typing next
                }
                
                setTimeout(type, typingSpeed);
            }

            setTimeout(type, 1000);

            // Fade Up Animation
            function checkFadeAnimations() {
                const fadeElements = document.querySelectorAll('.fade-up, .fade-right, .fade-left, .fade-in, .scale-up');
                
                fadeElements.forEach(element => {
                    const elementPosition = element.getBoundingClientRect().top;
                    const screenPosition = window.innerHeight / 1.2;
                    
                    if (elementPosition < screenPosition) {
                        element.classList.add('active');
                    }
                });
            }
            
            window.addEventListener('scroll', checkFadeAnimations);
            checkFadeAnimations(); // Check on load
        });
    
