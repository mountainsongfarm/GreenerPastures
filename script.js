document.addEventListener('DOMContentLoaded', () => {
    // Enhanced Parallax scrolling effect
    function handleParallax() {
        const parallaxSections = document.querySelectorAll('.parallax-section');
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        parallaxSections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const sectionDistance = top - scrolled;
            const viewportBottom = scrolled + windowHeight;
            
            // Check if section is in viewport or near it
            if (sectionDistance < windowHeight && sectionDistance > -height) {
                const parallaxBg = section.querySelector('.parallax-bg');
                
                // Calculate the relative position of the section in the viewport
                const progress = (viewportBottom - top) / (windowHeight + height);
                
                // Create a more dramatic parallax effect
                const translateY = (scrolled - top) * 0.4; // Reduced speed for smoother effect
                const scale = 1.5 + Math.min(0.5, Math.max(0, progress * 0.2));
                
                // Apply transform for parallax effect
                parallaxBg.style.transform = `translate3d(0, ${translateY}px, -4px) scale(${scale})`;
                parallaxBg.style.opacity = 1;
                
                // Don't adjust section opacity for better content visibility
                section.style.opacity = 1;
            }
        });
    }

    // Initialize parallax
    handleParallax();
    
    // Add scroll event listener with throttling for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', handleParallax);
    
    // Sticky header
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Here you would typically send the form data to a server
            // For this static site, we'll just show a success message
            
            const formElements = contactForm.elements;
            let allFieldsFilled = true;
            
            // Check if required fields are filled
            for (let i = 0; i < formElements.length; i++) {
                if (formElements[i].required && !formElements[i].value) {
                    allFieldsFilled = false;
                    break;
                }
            }
            
            if (allFieldsFilled) {
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                successMessage.style.color = '#3b7302';
                successMessage.style.padding = '15px';
                successMessage.style.marginTop = '20px';
                successMessage.style.backgroundColor = '#f0f7e6';
                successMessage.style.borderRadius = '5px';
                
                // Insert success message and reset form
                contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                contactForm.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsContainer = document.querySelector('.carousel-dots');

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    // Set slide width
    const slideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Function to move to slide
    const moveToSlide = (index) => {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        track.style.transform = `translateX(-${slideWidth * index}px)`;
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        currentSlide = index;
    };

    // Auto advance slides
    let slideInterval = setInterval(() => {
        moveToSlide(currentSlide + 1);
    }, 5000);

    // Event listeners for buttons
    nextButton.addEventListener('click', () => {
        clearInterval(slideInterval);
        moveToSlide(currentSlide + 1);
        slideInterval = setInterval(() => {
            moveToSlide(currentSlide + 1);
        }, 5000);
    });

    prevButton.addEventListener('click', () => {
        clearInterval(slideInterval);
        moveToSlide(currentSlide - 1);
        slideInterval = setInterval(() => {
            moveToSlide(currentSlide + 1);
        }, 5000);
    });

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            moveToSlide(index);
            slideInterval = setInterval(() => {
                moveToSlide(currentSlide + 1);
            }, 5000);
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a, a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 