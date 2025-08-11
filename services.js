// START OF FILE: services.js
document.addEventListener('DOMContentLoaded', () => {
    const reviewsContainer = document.querySelector('.reviews-container');

    // Only run the script if the reviews container exists on the page
    if (reviewsContainer) {
        const reviewsScroller = reviewsContainer.querySelector('.reviews-scroller');

        // Pause animation on hover
        reviewsContainer.addEventListener('mouseenter', () => {
            reviewsScroller.style.animationPlayState = 'paused';
        });
        
        // Resume animation on mouse leave
        reviewsContainer.addEventListener('mouseleave', () => {
            reviewsScroller.style.animationPlayState = 'running';
        });
    }
});