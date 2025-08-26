// Enhanced services.js for better review section functionality
document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.querySelector('.reviews-container');
    
    // Only run the script if the reviews container exists on the page
    if (reviewsContainer) {
        const reviewsScroller = reviewsContainer.querySelector('.reviews-scroller');
        
        if (reviewsScroller) {
            // Pause animation on hover for better user experience
            reviewsContainer.addEventListener('mouseenter', () => {
                reviewsScroller.style.animationPlayState = 'paused';
            });
            
            // Resume animation on mouse leave
            reviewsContainer.addEventListener('mouseleave', () => {
                reviewsScroller.style.animationPlayState = 'running';
            });
            
            // Touch/mobile support for pausing animation
            let touchTimeout;
            reviewsContainer.addEventListener('touchstart', () => {
                reviewsScroller.style.animationPlayState = 'paused';
                clearTimeout(touchTimeout);
            });
            
            reviewsContainer.addEventListener('touchend', () => {
                // Resume after a short delay to allow reading
                touchTimeout = setTimeout(() => {
                    reviewsScroller.style.animationPlayState = 'running';
                }, 3000);
            });
            
            // Handle reduced motion preferences
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                reviewsScroller.style.animation = 'none';
                reviewsScroller.style.flexWrap = 'wrap';
                reviewsScroller.style.justifyContent = 'center';
            }
            
            // Intersection Observer for performance optimization
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        reviewsScroller.style.animationPlayState = 'running';
                    } else {
                        reviewsScroller.style.animationPlayState = 'paused';
                    }
                });
            }, {
                threshold: 0.1
            });
            
            observer.observe(reviewsContainer);
            
            // Error handling for missing elements
        } else {
            console.warn('Reviews scroller element not found');
        }
    }
    
    // Smooth scrolling for service navigation links
    const serviceLinks = document.querySelectorAll('a[href^="#"]');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading animation for service images
    const serviceImages = document.querySelectorAll('.service-image img');
    serviceImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            this.alt = 'Image not available';
            this.style.background = '#f1f5f9';
            this.style.color = '#64748b';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.minHeight = '200px';
        });
    });
});