document.addEventListener('DOMContentLoaded', function() {

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });
        
        function performSearch(query) {
            const products = document.querySelectorAll('.product-item');
            const categories = document.querySelectorAll('.product-category');
            let matchedProducts = [];
            
            if (query.trim() === '') {
                // Show all products
                products.forEach(product => {
                    product.classList.remove('hidden');
                    product.classList.add('visible');
                });
                categories.forEach(category => {
                    category.style.display = 'block';
                });
                searchResults.innerHTML = '';
                return;
            }
            
            const searchTerm = query.toLowerCase();
            
            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                const productDesc = product.querySelector('p') ? 
                    product.querySelector('p').textContent.toLowerCase() : '';
                
                if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                    product.classList.remove('hidden');
                    product.classList.add('visible');
                    matchedProducts.push({
                        element: product,
                        name: product.querySelector('h3').textContent
                    });
                } else {
                    product.classList.add('hidden');
                    product.classList.remove('visible');
                }
            });
            
            // Hide empty categories
            categories.forEach(category => {
                const categoryProducts = category.querySelectorAll('.product-item.visible');
                if (categoryProducts.length === 0) {
                    category.style.display = 'none';
                } else {
                    category.style.display = 'block';
                }
            });
            
            // Update search results with clickable product names
            if (matchedProducts.length === 0) {
                searchResults.innerHTML = `<span style="color: #ef4444;">No products found for "${query}"</span>`;
            } else {
                const productLinks = matchedProducts.map(product => 
                    `<span class="search-result-item" data-product-name="${product.name}" style="color: var(--accent-color); cursor: pointer; text-decoration: underline; margin-right: 1rem;">${product.name}</span>`
                ).join('');
                
                searchResults.innerHTML = `<div style="margin-top: 1rem;">
                    <div style="color: var(--text-light); margin-bottom: 0.5rem;">Found ${matchedProducts.length} product${matchedProducts.length !== 1 ? 's' : ''}:</div>
                    <div>${productLinks}</div>
                </div>`;
                
                // Add click handlers to search result items
                document.querySelectorAll('.search-result-item').forEach(item => {
                    item.addEventListener('click', function() {
                        const productName = this.getAttribute('data-product-name');
                        scrollToProduct(productName);
                    });
                });
            }
        }
        
        function scrollToProduct(productName) {
            const products = document.querySelectorAll('.product-item');
            products.forEach(product => {
                const name = product.querySelector('h3').textContent;
                if (name === productName) {
                    product.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Add highlight effect
                    product.style.border = '2px solid var(--accent-color)';
                    product.style.boxShadow = '0 0 20px rgba(129, 230, 217, 0.5)';
                    
                    setTimeout(() => {
                        product.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                        product.style.boxShadow = '';
                    }, 3000);
                }
            });
        }
    }
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced button click animations and ripple effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousedown', function(e) {
            // Add pressed state with smooth animation
            this.style.transform = 'scale(0.96) translateY(-1px)';
            this.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        button.addEventListener('mouseup', function(e) {
            // Remove pressed state
            this.style.transform = 'scale(1) translateY(-2px)';
            this.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        button.addEventListener('mouseleave', function(e) {
            // Reset to normal state
            this.style.transform = 'scale(1) translateY(0)';
            this.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        button.addEventListener('mouseenter', function(e) {
            // Hover state
            this.style.transform = 'scale(1) translateY(-2px)';
            this.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        button.addEventListener('click', function(e) {
            // Create enhanced ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 2;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out forwards;
                pointer-events: none;
                z-index: 1;
            `;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation keyframes to head
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Improved scroll animations that work continuously
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is entering viewport
                entry.target.classList.add('animate');
                entry.target.classList.add('visible');
                entry.target.classList.remove('hide');
                entry.target.classList.remove('hidden');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Element is leaving viewport
                entry.target.classList.remove('animate');
                entry.target.classList.remove('visible');
                entry.target.classList.add('hide');
                entry.target.classList.add('hidden');
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
            }
        });
    }, observerOptions);

    // Initialize elements as hidden (but completely skip products page)
    const isProductsPage = window.location.pathname === '/products' || window.location.pathname.includes('/products');
    
    if (!isProductsPage) {
        // Only apply scroll animations on non-products pages
        document.querySelectorAll('.feature-card, .step-card, .review-card, .scroll-fade-in, .faq-item, .reason-card, .page-header, .search-container, .review-form-container').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // FAQ accordion functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const arrow = this.querySelector('.faq-arrow');

            // Toggle active class
            faqItem.classList.toggle('active');

            // Rotate arrow
            if (faqItem.classList.contains('active')) {
                arrow.style.transform = 'rotate(180deg)';
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                arrow.style.transform = 'rotate(0deg)';
                answer.style.maxHeight = '0';
            }
        });
    });

    // Review form functionality
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        const stars = document.querySelectorAll('.star');
        let currentRating = 0;

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                currentRating = index + 1;
                updateStars();
                document.getElementById('rating').value = currentRating;
            });

            star.addEventListener('mouseover', () => {
                highlightStars(index + 1);
            });
        });

        document.querySelector('.star-rating').addEventListener('mouseleave', () => {
            updateStars();
        });

        function highlightStars(rating) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }

        function updateStars() {
            stars.forEach((star, index) => {
                if (index < currentRating) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            });
        }

        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const displayName = document.getElementById('displayName').value;
            const rating = document.getElementById('rating').value;
            const reviewText = document.getElementById('reviewText').value;

            if (!displayName || !rating || !reviewText) {
                alert('Please fill in all fields and select a rating.');
                return;
            }

            // Submit to server
            fetch('/submit_review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    displayName: displayName,
                    rating: rating,
                    reviewText: reviewText
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Create review element
                    const reviewElement = document.createElement('div');
                    reviewElement.className = 'review-card scroll-fade-in';
                    reviewElement.innerHTML = `
                        <div class="review-header">
                            <h4>${displayName}</h4>
                            <div class="review-stars">
                                ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}
                            </div>
                        </div>
                        <p>${reviewText}</p>
                        <small>Just now</small>
                    `;

                    // Add to reviews container
                    const reviewsContainer = document.querySelector('.reviews-container');
                    if (reviewsContainer) {
                        reviewsContainer.insertBefore(reviewElement, reviewsContainer.firstChild);

                        // Trigger animation
                        setTimeout(() => {
                            reviewElement.classList.add('visible');
                        }, 100);
                    }

                    // Reset form
                    reviewForm.reset();
                    currentRating = 0;
                    updateStars();
                    document.getElementById('rating').value = '';

                    alert('Thank you for your review!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error submitting review. Please try again.');
            });
        });
    }
});