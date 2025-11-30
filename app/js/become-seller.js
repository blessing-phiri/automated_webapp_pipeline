// Seller Registration Form
document.addEventListener('DOMContentLoaded', function() {
    // Multi-step form navigation
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const form = document.getElementById('sellerApplicationForm');
    
    let currentStep = 0;
    
    // Show initial step
    showStep(currentStep);
    
    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep >= formSteps.length - 1) return;
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
                scrollToStep();
            }
        });
    });
    
    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep <= 0) return;
            
            currentStep--;
            showStep(currentStep);
            scrollToStep();
        });
    });
    
    // Show specific step
    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        
        // Update progress indicator (if you have one)
        updateProgressIndicator();
    }
    
    // Validate step before proceeding
    function validateStep(stepIndex) {
        const currentStep = formSteps[stepIndex];
        const inputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#f44336';
                input.addEventListener('input', function() {
                    this.style.borderColor = '#ddd';
                });
                isValid = false;
            }
        });
        
        if (!isValid) {
            alert('Please fill in all required fields');
        }
        
        return isValid;
    }
    
    // Scroll to current step
    function scrollToStep() {
        formSteps[currentStep].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Update progress indicator
    function updateProgressIndicator() {
        // Implement if you have a visual progress indicator
    }
    
    // Business type toggle
    const businessType = document.getElementById('businessType');
    const registrationNumberGroup = document.getElementById('registrationNumberGroup');
    const businessDocumentsGroup = document.getElementById('businessDocumentsGroup');
    
    if (businessType) {
        businessType.addEventListener('change', function() {
            if (this.value === 'individual') {
                registrationNumberGroup.style.display = 'none';
                businessDocumentsGroup.style.display = 'none';
                document.getElementById('registrationNumber').removeAttribute('required');
            } else {
                registrationNumberGroup.style.display = 'block';
                businessDocumentsGroup.style.display = 'block';
                document.getElementById('registrationNumber').setAttribute('required', '');
            }
        });
    }
    
    // File upload display
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileNameDisplay = this.nextElementSibling.nextElementSibling;
            
            if (this.files.length > 1) {
                fileNameDisplay.textContent = `${this.files.length} files selected`;
            } else if (this.files.length === 1) {
                fileNameDisplay.textContent = this.files[0].name;
            } else {
                fileNameDisplay.textContent = 'No file chosen';
            }
        });
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all steps before submission
            let allValid = true;
            formSteps.forEach((step, index) => {
                if (!validateStep(index)) {
                    allValid = false;
                }
            });
            
            if (allValid) {
                // Simulate form submission
                const submitBtn = form.querySelector('.btn-submit');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                // In a real app, you would send data to server here
                setTimeout(() => {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success-message';
                    successMessage.innerHTML = `
                        <div class="success-content">
                            <i class="fas fa-check-circle"></i>
                            <h3>Application Submitted Successfully!</h3>
                            <p>We've received your seller application. Our team will review your information and contact you within 2 business days.</p>
                            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">OK</button>
                        </div>
                    `;
                    
                    form.parentElement.appendChild(successMessage);
                    
                    // Reset form
                    form.reset();
                    currentStep = 0;
                    showStep(currentStep);
                    submitBtn.innerHTML = 'Submit Application';
                    submitBtn.disabled = false;
                    
                    // Add styles for success message
                    const style = document.createElement('style');
                    style.textContent = `
                        .form-success-message {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0, 0, 0, 0.8);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 9999;
                        }
                        
                        .success-content {
                            background-color: white;
                            padding: 40px;
                            border-radius: var(--border-radius);
                            text-align: center;
                            max-width: 500px;
                            animation: fadeIn 0.3s ease-out;
                        }
                        
                        .success-content i {
                            font-size: 3rem;
                            color: #4CAF50;
                            margin-bottom: 20px;
                        }
                        
                        .success-content h3 {
                            margin-bottom: 15px;
                            color: var(--dark-color);
                        }
                        
                        .success-content p {
                            margin-bottom: 25px;
                            color: var(--text-light);
                        }
                    `;
                    document.head.appendChild(style);
                }, 1500);
            }
        });
    }
    
    // Dashboard tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Add product modal
    const addProductBtns = document.querySelectorAll('.add-product-btn, .add-product-card');
    const addProductModal = document.querySelector('.add-product-modal');
    const closeModalBtn = document.querySelector('.add-product-modal .close-modal');
    
    addProductBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            addProductModal.classList.add('active');
        });
    });
    
    closeModalBtn.addEventListener('click', function() {
        addProductModal.classList.remove('active');
    });
    
    addProductModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // Testimonials carousel
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    if (testimonialsCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        testimonialsCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - testimonialsCarousel.offsetLeft;
            scrollLeft = testimonialsCarousel.scrollLeft;
            testimonialsCarousel.style.cursor = 'grabbing';
            testimonialsCarousel.style.scrollBehavior = 'auto';
        });
        
        testimonialsCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialsCarousel.style.cursor = 'grab';
        });
        
        testimonialsCarousel.addEventListener('mouseup', () => {
            isDown = false;
            testimonialsCarousel.style.cursor = 'grab';
            testimonialsCarousel.style.scrollBehavior = 'smooth';
        });
        
        testimonialsCarousel.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsCarousel.scrollLeft = scrollLeft - walk;
        });
    }
    
    // Product listing actions
    const productActions = document.querySelectorAll('.product-actions .action-btn');
    
    productActions.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-listing');
            const productName = productCard.querySelector('h4').textContent;
            const action = this.classList.contains('edit') ? 'edit' : 
                          this.classList.contains('stats') ? 'stats' :
                          this.classList.contains('pause') ? 'pause' : 'activate';
            
            // In a real app, this would trigger the appropriate action
            const notification = document.createElement('div');
            notification.className = 'action-notification';
            
            let message = '';
            switch(action) {
                case 'edit':
                    message = `${productName} ready for editing`;
                    break;
                case 'stats':
                    message = `Showing statistics for ${productName}`;
                    break;
                case 'pause':
                    message = `${productName} listing paused`;
                    productCard.querySelector('.product-status').className = 'product-status paused';
                    productCard.querySelector('.product-status').textContent = 'Paused';
                    this.className = 'action-btn activate';
                    this.innerHTML = '<i class="fas fa-play"></i> Activate';
                    break;
                case 'activate':
                    message = `${productName} listing activated`;
                    productCard.querySelector('.product-status').className = 'product-status active';
                    productCard.querySelector('.product-status').textContent = 'Active';
                    this.className = 'action-btn pause';
                    this.innerHTML = '<i class="fas fa-pause"></i> Pause';
                    break;
            }
            
            notification.textContent = message;
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
            
            // Add styles for notification
            const style = document.createElement('style');
            style.textContent = `
                .action-notification {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(100px);
                    background-color: var(--primary-color);
                    color: white;
                    padding: 15px 25px;
                    border-radius: var(--border-radius);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    z-index: 9999;
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                
                .action-notification.show {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        });
    });
    
    // Add product form submission
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                addProductModal.classList.remove('active');
                
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'action-notification';
                notification.textContent = 'Product added successfully!';
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
                
                // Reset form
                this.reset();
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
                submitBtn.disabled = false;
            }, 1500);
        });
    }
});