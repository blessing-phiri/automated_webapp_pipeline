// Marketplace Interactive Elements
document.addEventListener('DOMContentLoaded', function() {
    // Toggle Advanced Filters
    const filterToggle = document.querySelector('.advanced-filter-toggle');
    const advancedFilters = document.querySelector('.advanced-filters');
    
    if (filterToggle && advancedFilters) {
        filterToggle.addEventListener('click', function() {
            advancedFilters.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-sliders-h');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Price Range Slider
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = `Up to $${this.value}`;
        });
    }
    
    // View Toggle
    const viewOptions = document.querySelectorAll('.view-option');
    const listingsContainer = document.querySelector('.listings-container');
    
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            viewOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Change view mode
            const view = this.dataset.view;
            listingsContainer.className = 'listings-container ' + view + '-view';
        });
    });
    
    // Quick View Modal
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.querySelector('.quick-view-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalContent = document.querySelector('.modal-product-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            
            // Get product data (in a real app, this would come from an API)
            const productName = productCard.querySelector('h3').textContent;
            const farmerName = productCard.querySelector('.farmer-info span').textContent;
            const farmerAvatar = productCard.querySelector('.farmer-avatar').src;
            const productImage = productCard.querySelector('.product-image img').src;
            const rating = productCard.querySelector('.rating').innerHTML;
            const stock = productCard.querySelector('.stock').textContent;
            const currentPrice = productCard.querySelector('.current-price').textContent;
            const originalPrice = productCard.querySelector('.original-price')?.textContent || '';
            
            // Create modal content
            modalContent.innerHTML = `
                <div class="modal-product-image">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="modal-product-info">
                    <h2>${productName}</h2>
                    
                    <div class="modal-farmer-info">
                        <img src="${farmerAvatar}" alt="Farmer" class="modal-farmer-avatar">
                        <div class="modal-farmer-details">
                            <h4>Sold by ${farmerName}</h4>
                            <p class="modal-farmer-location">
                                <i class="fas fa-map-marker-alt"></i> Mashonaland East, Zimbabwe
                            </p>
                        </div>
                    </div>
                    
                    <div class="modal-product-meta">
                        <div class="modal-rating">
                            ${rating}
                        </div>
                        <div class="modal-stock">
                            ${stock}
                        </div>
                    </div>
                    
                    <div class="modal-price">
                        ${currentPrice}
                        ${originalPrice ? `<span class="modal-original-price">${originalPrice}</span>` : ''}
                    </div>
                    
                    <div class="modal-description">
                        <p>Freshly harvested premium quality produce, grown using sustainable farming practices. This product is ${productCard.querySelector('.product-badge') ? productCard.querySelector('.product-badge').textContent.toLowerCase() : ''} and comes directly from the farm to your table.</p>
                        <p>Available for immediate delivery or farm pickup. Minimum order quantity may apply.</p>
                    </div>
                    
                    <div class="modal-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="1" min="1" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="add-to-cart-large">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
            
            // Show modal
            quickViewModal.classList.add('active');
            
            // Add event listeners to new modal elements
            const minusBtn = modalContent.querySelector('.quantity-btn.minus');
            const plusBtn = modalContent.querySelector('.quantity-btn.plus');
            const quantityInput = modalContent.querySelector('.quantity-input');
            
            minusBtn.addEventListener('click', function() {
                let value = parseInt(quantityInput.value);
                if (value > 1) {
                    quantityInput.value = value - 1;
                }
            });
            
            plusBtn.addEventListener('click', function() {
                let value = parseInt(quantityInput.value);
                quantityInput.value = value + 1;
            });
        });
    });
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            quickViewModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    quickViewModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // Farmer Spotlight Carousel Navigation
    const spotlightCarousel = document.querySelector('.spotlight-carousel');
    if (spotlightCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        spotlightCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - spotlightCarousel.offsetLeft;
            scrollLeft = spotlightCarousel.scrollLeft;
            spotlightCarousel.style.cursor = 'grabbing';
            spotlightCarousel.style.scrollBehavior = 'auto';
        });
        
        spotlightCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            spotlightCarousel.style.cursor = 'grab';
        });
        
        spotlightCarousel.addEventListener('mouseup', () => {
            isDown = false;
            spotlightCarousel.style.cursor = 'grab';
            spotlightCarousel.style.scrollBehavior = 'smooth';
        });
        
        spotlightCarousel.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - spotlightCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            spotlightCarousel.scrollLeft = scrollLeft - walk;
        });
    }
    
    // Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Create notification
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i> ${productName} added to cart
            `;
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        });
    });
    
    // Pagination
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            // Remove active class from all buttons
            pageButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real app, this would load new products
            // For demo, we'll just simulate loading
            const listingsContainer = document.querySelector('.listings-container');
            listingsContainer.style.opacity = '0.5';
            
            setTimeout(() => {
                listingsContainer.style.opacity = '1';
            }, 500);
        });
    });
    
    // Add cart notification styles
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: var(--border-radius);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .cart-notification.show {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        
        .cart-notification i {
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
});