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
        '/faq.html': { 
            title: 'FAQ - eFix iLab' 
        }
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
        fontAwesome.onerror = () => {
            console.warn('Font Awesome failed to load');
        };
        document.head.appendChild(fontAwesome);
    };

    /** Fetches and injects an HTML component with error handling. */
    const loadComponent = (url, placeholderId, callback) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            console.error(`Placeholder element with id '${placeholderId}' not found`);
            return;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;
                if (callback) callback();
            })
            .catch(error => {
                console.error(`Error loading component ${url}:`, error);
                // Provide fallback content
                if (placeholderId === 'header-placeholder') {
                    placeholder.innerHTML = `
                        <header class="header">
                            <div class="nav-container">
                                <a href="index.html">eFix iLab</a>
                                <nav>Error loading navigation</nav>
                            </div>
                        </header>
                    `;
                } else if (placeholderId === 'footer-placeholder') {
                    placeholder.innerHTML = `
                        <footer class="footer">
                            <div class="container">
                                <p>&copy; 2025 eFix iLab. All rights reserved.</p>
                            </div>
                        </footer>
                    `;
                }
            });
    };
    
    /** Initializes all interactive event listeners with improved mobile handling. */
    const initializePageEventListeners = () => {
        // Mobile menu toggle with proper state management
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;
        
        if (mobileMenuBtn && navMenu) {
            let isMenuOpen = false;
            
            const toggleMobileMenu = () => {
                isMenuOpen = !isMenuOpen;
                navMenu.classList.toggle('active', isMenuOpen);
                mobileMenuBtn.classList.toggle('active', isMenuOpen);
                body.classList.toggle('mobile-menu-open', isMenuOpen);
                
                // Update ARIA attributes for accessibility
                mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
            };
            
            const closeMobileMenu = () => {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    body.classList.remove('mobile-menu-open');
                    mobileMenuBtn.setAttribute('aria-expanded', false);
                }
            };
            
            // Mobile menu button click handler
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileMenu();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    closeMobileMenu();
                }
            });
            
            // Close menu on window resize if mobile breakpoint is exceeded
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && isMenuOpen) {
                    closeMobileMenu();
                }
            });
            
            // Close menu when navigation links are clicked
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    // Small delay to allow link to register
                    setTimeout(closeMobileMenu, 100);
                }
            });
            
            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isMenuOpen) {
                    closeMobileMenu();
                }
            });
        }

        // Enhanced scroll animations with better performance
        const observerOptions = { 
            threshold: 0.1, 
            rootMargin: '0px 0px -50px 0px' 
        };
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll(
            '.service-card, .service-category, .contact-card, .location-card, .hours-card, .social-card, .feature-card'
        );
        elementsToAnimate.forEach(el => observer.observe(el));

        // Smooth scrolling with mobile menu closure
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    // Close mobile menu first if open
                    const navMenu = document.querySelector('.nav-menu');
                    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                    
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileMenuBtn?.classList.remove('active');
                        document.body.classList.remove('mobile-menu-open');
                    }
                    
                    // Scroll to target with offset for fixed header
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Enhanced header scroll effect with better performance
        let ticking = false;
        
        const updateHeader = () => {
            const header = document.querySelector('.header');
            if (header) {
                const scrolled = window.scrollY > 50;
                const newBackground = scrolled ? 
                    'rgba(255, 255, 255, 0.98)' : 
                    'rgba(255, 255, 255, 0.95)';
                const newShadow = scrolled ? 
                    '0 2px 30px rgba(0, 0, 0, 0.15)' : 
                    '0 2px 20px rgba(0, 0, 0, 0.1)';
                
                // Only update if values have changed to improve performance
                if (header.style.background !== newBackground) {
                    header.style.background = newBackground;
                    header.style.boxShadow = newShadow;
                }
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });

        // Form validation and handling (if forms exist)
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                // Basic form validation can be added here
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    console.warn('Please fill in all required fields');
                }
            });
        });

        // Image lazy loading for better performance
        const images = document.querySelectorAll('img[data-src]');
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }

        // Initialize any page-specific functionality
        const currentPageName = document.body.className || 
                                document.querySelector('main')?.className || 
                                'default';
        
        // Page-specific initializations can be added here
        console.log(`Initialized page: ${currentPageName}`);
    };

    // --- INITIALIZATION SEQUENCE ---
    // Load head content first
    loadHeadContent(pageConfig);
    
    // Load header and initialize events after it's loaded
    loadComponent('header.html', 'header-placeholder', () => {
        // Initialize events after header is loaded
        setTimeout(initializePageEventListeners, 100);
    });
    
    // Load footer (no callback needed)
    loadComponent('footer.html', 'footer-placeholder');
    
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });
});