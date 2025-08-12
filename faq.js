// START OF FILE: faq.js
document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('faqContainer');
    if (!faqContainer) return; // Exit if not on the FAQ page

    const faqQuestions = faqContainer.querySelectorAll('.faq-question');
    const searchInput = document.getElementById('searchInput');
    const faqItems = faqContainer.querySelectorAll('.faq-item');
    const noResults = document.getElementById('noResults');
    const faqCategories = faqContainer.querySelectorAll('.faq-category');
    const backToTopButton = document.getElementById('backToTop');

    // 1. Accordion Functionality
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Close all other items before opening the new one
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('active');
                q.querySelector('.toggle-icon').classList.remove('rotated');
            });

            // If it wasn't already active, open it
            if (!isActive) {
                question.classList.add('active');
                answer.classList.add('active');
                question.querySelector('.toggle-icon').classList.add('rotated');
            }
        });
    });

    // 2. Search and Filter Functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleItemsCount = 0;

        faqItems.forEach(item => {
            const questionText = item.querySelector('.question-text');
            const answerText = item.querySelector('.answer-text');
            const questionContent = questionText.textContent.toLowerCase();
            const answerContent = answerText.textContent.toLowerCase();

            // First, remove previous highlights
            removeHighlights(questionText);
            removeHighlights(answerText);

            const isMatch = questionContent.includes(searchTerm) || answerContent.includes(searchTerm);
            
            if (isMatch) {
                item.classList.remove('hidden');
                visibleItemsCount++;
                if (searchTerm) {
                    highlightKeywords(questionText, searchTerm);
                    highlightKeywords(answerText, searchTerm);
                }
            } else {
                item.classList.add('hidden');
            }
        });

        updateCategoryVisibility();
        toggleNoResults(visibleItemsCount);
    });

    function updateCategoryVisibility() {
        faqCategories.forEach(category => {
            const visibleItems = category.querySelectorAll('.faq-item:not(.hidden)');
            category.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
    }

    function toggleNoResults(count) {
        noResults.classList.toggle('show', count === 0);
    }

    function highlightKeywords(element, term) {
        const text = element.textContent;
        const regex = new RegExp(`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
    }

    function removeHighlights(element) {
        element.innerHTML = element.textContent;
    }

    // 3. Back to Top Button Functionality
    window.addEventListener('scroll', () => {
        backToTopButton.classList.toggle('show', window.scrollY > 300);
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});