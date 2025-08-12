document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURATION ROUTER ---
    const pageConfigs = {
        '/index.html': {
            title: 'eFix iLab - Professional Device Repair',
        },
        '/service-centre.html': {
            title: 'Our Service Centres - eFix iLab',
        },
        '/services.html': {
            title: 'Our Repair Services - eFix iLab',
        },
        '/contact.html': {
            title: 'Contact Us - eFix iLab',
        },
        '/faq.html': { title: 'FAQ - eFix iLab' }
    };

    const currentPage = window.location.pathname === '/' ? '/index.html' : window.location.pathname;
    const pageConfig = pageConfigs[currentPage] || pageConfigs['/index.html'];

    /** 
     * Dynamically populates the <head> with the title and Font Awesome.
     * OG tags and the main stylesheet are now linked directly in each HTML file.
     */
    const loadHeadContent = (config) => {
        // Set the browser tab title
        if (config && config.title) {
            document.title = config.title;
        }

        // Create and append Font Awesome stylesheet
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    };

    /** Fetches and injects an HTML component. */
    const loadComponent = (url, placeholderId, callback) => {
        fetch(url)
            .then(response => response.ok ? response.text() : Promise.reject(`Failed to load ${url}`))
            .then(data => {
                document.getElementById(placeholderId).innerHTML = data;
                if (callback) callback();
            })
            .catch(error => console.error(`Error loading component: ${error}`));
    };
    
    /** Initializes all interactive event listeners. */
    const initializePageEventListeners = () => {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Scroll animations
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        const elementsToAnimate = document.querySelectorAll('.service-card, .service-category, .contact-card, .location-card, .hours-card, .social-card, .feature-card');
        elementsToAnimate.forEach(el => observer.observe(el));


        // Smooth scrolling & close mobile menu on link click
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (header) {
                const scrolled = window.scrollY > 50;
                header.style.background = scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = scrolled ? '0 2px 30px rgba(0, 0, 0, 0.15)' : '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });
    };

    // --- INITIALIZATION ---
    loadHeadContent(pageConfig);
    loadComponent('header.html', 'header-placeholder', initializePageEventListeners);
    loadComponent('footer.html', 'footer-placeholder');
});