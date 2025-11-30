// Services Page Animations
document.addEventListener('DOMContentLoaded', function() {
    // Animated Text for Hero
    const animatedText = document.querySelector('.animated-text');
    if (animatedText) {
        const text = animatedText.textContent;
        animatedText.innerHTML = '';
        
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${i * 0.05}s`;
            span.classList.add('animate-popIn');
            animatedText.appendChild(span);
        });
    }

    // Scroll Down Button
    const scrollDown = document.querySelector('.scroll-down');
    if (scrollDown) {
        scrollDown.addEventListener('click', function() {
            window.scrollTo({
                top: document.querySelector('.services-overview').offsetTop - 80,
                behavior: 'smooth'
            });
        });
    }

    // Counter Animation for Stats
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(document.querySelector('.service-stats'));
    }

    function animateCounters() {
        statValues.forEach(stat => {
            const target = +stat.getAttribute('data-count');
            const count = +stat.innerText;
            const increment = target / 30;
            
            if (count < target) {
                stat.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 30);
            } else {
                stat.innerText = target;
            }
        });
    }

    // Service Card Hover Effects
    const serviceCards = document.querySelectorAll('.category-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
        });
    });

    // Testimonial Carousel Animation
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
        let currentIndex = 0;
        const testimonials = Array.from(testimonialCarousel.children);
        const totalTestimonials = testimonials.length;
        
        function rotateTestimonials() {
            currentIndex = (currentIndex + 1) % totalTestimonials;
            const offset = -currentIndex * 100;
            testimonialCarousel.style.transform = `translateX(${offset}%)`;
        }
        
        // Set initial positions
        testimonials.forEach((testimonial, index) => {
            testimonial.style.left = `${index * 100}%`;
        });
        
        // Start auto-rotation
        setInterval(rotateTestimonials, 5000);
    }

    // Process Step Animation
    const processSteps = document.querySelectorAll('.process-step');
    if (processSteps.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-step');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        processSteps.forEach(step => {
            observer.observe(step);
        });
    }

    // Tech Card Hover Effects
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const glow = document.createElement('div');
            glow.className = 'tech-glow';
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
            this.appendChild(glow);
            
            setTimeout(() => {
                glow.remove();
            }, 500);
        });
    });

    // Add CSS for tech card glow effect
    const style = document.createElement('style');
    style.textContent = `
        .tech-glow {
            position: absolute;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0) 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 0;
            animation: fadeOut 0.5s forwards;
        }
        
        @keyframes fadeOut {
            to { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
        
        @keyframes animate-step {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        
        .process-step.animate-step {
            animation: animate-step 0.6s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
});