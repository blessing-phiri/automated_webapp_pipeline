// Clients Carousel Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Clients Carousel
    const clientsCarousel = () => {
        const carousel = document.querySelector('.clients-carousel');
        if (!carousel) return;
        
        const slides = Array.from(carousel.children);
        const slideWidth = slides[0].getBoundingClientRect().width;
        
        // Duplicate slides for infinite loop
        const clonedSlides = slides.map(slide => slide.cloneNode(true));
        clonedSlides.forEach(slide => carousel.appendChild(slide));
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        const animationDuration = totalSlides * 5; // 5 seconds per slide
        
        // Set initial position
        carousel.style.transform = `translateX(0)`;
        
        // Animate the carousel
        function animateCarousel() {
            currentIndex++;
            const offset = -currentIndex * slideWidth;
            carousel.style.transition = 'transform 1s ease-in-out';
            carousel.style.transform = `translateX(${offset}px)`;
            
            // Reset to start when reaching the end
            if (currentIndex >= totalSlides) {
                setTimeout(() => {
                    carousel.style.transition = 'none';
                    currentIndex = 0;
                    carousel.style.transform = `translateX(0)`;
                }, 1000);
            }
        }
        
        // Start animation
        let animationInterval = setInterval(animateCarousel, 3000);
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(animationInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            animationInterval = setInterval(animateCarousel, 3000);
        });
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(animationInterval);
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            animationInterval = setInterval(animateCarousel, 3000);
        }, { passive: true });
        
        function handleSwipe() {
            const threshold = 50;
            if (touchStartX - touchEndX > threshold) {
                // Swipe left - next slide
                animateCarousel();
            } else if (touchEndX - touchStartX > threshold) {
                // Swipe right - previous slide
                currentIndex = Math.max(0, currentIndex - 1);
                const offset = -currentIndex * slideWidth;
                carousel.style.transition = 'transform 1s ease-in-out';
                carousel.style.transform = `translateX(${offset}px)`;
            }
        }
    };
    
    // Initialize carousels
    clientsCarousel();
    
    // Hero Image Animation
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.addEventListener('mouseenter', () => {
            heroImage.style.animation = 'pulse 1.5s ease infinite';
        });
        
        heroImage.addEventListener('mouseleave', () => {
            heroImage.style.animation = 'float 6s ease-in-out infinite';
        });
    }
    
    // Add responsive adjustments
    window.addEventListener('resize', () => {
        // Reinitialize carousels on resize
        clientsCarousel();
    });
    
    // Add styles for carousel
    const style = document.createElement('style');
    style.textContent = `
        .clients-carousel {
            display: flex;
            transition: transform 0.5s ease;
            will-change: transform;
        }
        .client-slide {
            flex: 0 0 auto;
            transition: all 0.3s ease;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});