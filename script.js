/* ==========================================================================
   PORTFOLIO INTERACTION SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME CONTROLLER (Dark/Light)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlElement = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        const defaultTheme = systemPrefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', defaultTheme);
        updateThemeIcon(defaultTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }


    /* ==========================================================================
       MOBILE NAVIGATION HAMBURGER MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });


    /* ==========================================================================
       TYPEWRITER SEQUENCE (Hero Subtitle)
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter-text');
    const phrases = ['Java Applications', 'Python Systems', 'Full-stack Solutions', 'Interactive Frontends'];
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function handleTypewriter() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            typingSpeed = 50; // Speed up deletion
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            typingSpeed = 120; // Normal typing speed
        }

        // State shifts
        if (!isDeleting && characterIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(handleTypewriter, typingSpeed);
    }

    if (typewriterElement) {
        setTimeout(handleTypewriter, 1000);
    }


    /* ==========================================================================
       SCROLL REVEALS & ACTIVE STATE TRACKER
       ========================================================================== */
    const animScrollElements = document.querySelectorAll('.animate-on-scroll');
    const sections = document.querySelectorAll('.section');
    const progressBars = document.querySelectorAll('.skill-bar-fill');


    // Reveal elements on scroll
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');

                // If it contains progress bars, animate their widths
                if (entry.target.classList.contains('skills-category')) {
                    const bars = entry.target.querySelectorAll('.skill-bar-fill');
                    bars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }


                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animScrollElements.forEach(el => revealObserver.observe(el));

    // Active Section Link Tracker
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.35,
        rootMargin: '-10% 0px -50% 0px'
    });

    sections.forEach(sec => navObserver.observe(sec));



    /* ==========================================================================
       PROJECTS PORTFOLIO FILTER
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state class on filter buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    // Smooth re-fade
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });


    /* ==========================================================================
       PROJECT DETAIL MODALS (Data Store & Actions)
       ========================================================================== */
    const projectsData = {
        anka: {
            title: "Anka Personal Assistant",
            badge: "Python System",
            desc: "An intelligent, voice-activated desktop personal assistant engineered in Python. Anka streamlines tasks by listening to voice instructions, processing instructions using NLP patterns, and replying with custom text-to-speech audio outputs.",
            features: [
                "Voice Command Recognition: Integrated SpeechRecognition API parsing commands dynamically.",
                "Custom Text-to-Speech: Adjustable speech rates and male/female vocals configured via pyttsx3.",
                "Operational Automation: Launches local programs, directories, files, and handles web queries.",
                "API Orchestrations: Direct integrations requesting weather details, Wikipedia snippets, and custom feeds.",
                "Workflow Utilities: Configures alarms, handles notes dictation, and runs terminal commands."
            ],
            tech: ["Python", "SpeechRecognition", "pyttsx3", "Wikipedia API", "JSON", "OS Automation"]
        },
        library: {
            title: "Library Management System",
            badge: "Java SE Application",
            desc: "A structural backend application developed in Java for library management. Organizes catalog directories, indexes members, registers checkouts/returns, and records transaction logs to standard databases.",
            features: [
                "Full CRUD capabilities handling book categories, member accounts, and lending records.",
                "Relational Database Integration: Robust connectivity utilizing SQLite/MySQL storage engines.",
                "Prepared Statements Architecture: Strict SQL queries prevention layers securing SQL injection risks.",
                "Modular Property Settings: Dynamically parses databases logins using separate config.properties.",
                "Automated Builds: Maven integration defining compilation tasks and dependencies."
            ],
            tech: ["Java", "JDBC", "SQLite / MySQL", "Properties Manager", "Maven"]
        },
        student: {
            title: "Student Management System",
            badge: "Java Database Application",
            desc: "An administrative Java utility tailored for schools and universities to manage enrollments. Houses profiles, tracks course assignments, grades examinations, and updates accounts ledgers.",
            features: [
                "Profile management tracking enrollments details, emails, and photos.",
                "GPA computation scripts automatically indexing letters grades and term scores.",
                "Finance Ledgers: Manages fee schedules, outstanding balances, and processes invoices.",
                "Multi-criteria searches querying students details by IDs, specific courses, or names."
            ],
            tech: ["Java SE", "SQL Server", "Database Design", "Swing / Console UI", "CRUD Patterns"]
        }
    };

    const modalOverlay = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-project-details');
    const modalTriggers = document.querySelectorAll('.btn-modal-trigger');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const projectKey = trigger.getAttribute('data-project');
            const data = projectsData[projectKey];

            if (data) {
                // Populate content inside modal card
                modalContent.innerHTML = `
                    <div class="modal-header-block">
                        <span class="modal-project-badge">${data.badge}</span>
                        <h2>${data.title}</h2>
                    </div>
                    <div class="modal-body-block">
                        <div>
                            <h3>Project Summary</h3>
                            <p class="modal-desc">${data.desc}</p>
                        </div>
                        <div>
                            <h3>Core Features</h3>
                            <ul class="modal-features-list">
                                ${data.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> <span>${f}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <h3>Technologies & Tools</h3>
                            <div class="modal-tech-pills">
                                ${data.tech.map(t => `<span class="tag">${t}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `;

                // Open modal overlay
                modalOverlay.classList.add('open');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            }
        });
    });

    function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Resume background scrolling
    }

    modalCloseBtn.addEventListener('click', closeModal);

    // Close modal by clicking outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal on escape press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
            closeModal();
        }
    });


    /* ==========================================================================
       CONTACT FORM VALIDATION & TOAST FEEDBACK
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast-container');

    const formInputs = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };

    const errors = {
        name: document.getElementById('name-error'),
        email: document.getElementById('email-error'),
        subject: document.getElementById('subject-error'),
        message: document.getElementById('message-error')
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isFormValid = true;

        // Reset errors
        Object.keys(formInputs).forEach(key => {
            formInputs[key].parentElement.classList.remove('invalid');
        });

        // 1. Name Check
        if (formInputs.name.value.trim() === '') {
            showError('name', 'Please enter your name');
            isFormValid = false;
        }

        // 2. Email Check
        const emailValue = formInputs.email.value.trim();
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (emailValue === '') {
            showError('email', 'Please enter your email');
            isFormValid = false;
        } else if (!emailPattern.test(emailValue)) {
            showError('email', 'Please enter a valid email address');
            isFormValid = false;
        }

        // 3. Subject Check
        if (formInputs.subject.value.trim() === '') {
            showError('subject', 'Please enter a subject');
            isFormValid = false;
        }

        // 4. Message Check
        if (formInputs.message.value.trim() === '') {
            showError('message', 'Please enter your message');
            isFormValid = false;
        }

        if (isFormValid) {
            // Trigger Toast success element
            toast.classList.add('show');

            // Clean values
            contactForm.reset();

            // Clear floating label states by resetting placeholder settings if needed
            Object.values(formInputs).forEach(input => {
                input.blur();
            });

            // Dismiss Toast after 4 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    });

    function showError(fieldKey, message) {
        const inputParent = formInputs[fieldKey].parentElement;
        const errorText = errors[fieldKey];

        inputParent.classList.add('invalid');
        errorText.textContent = message;
    }

    // Clear error states on input keypress
    Object.keys(formInputs).forEach(key => {
        formInputs[key].addEventListener('input', () => {
            if (formInputs[key].value.trim() !== '') {
                formInputs[key].parentElement.classList.remove('invalid');
            }
        });
    });

});
