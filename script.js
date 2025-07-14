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
    
    // Video background handling
    const videoBg = document.querySelector('.video-bg');
    if (videoBg) {
        let loopCount = 0;
        const maxLoops = 2;
        
        // Show video when it can play
        videoBg.addEventListener('canplay', () => {
            videoBg.style.opacity = '1';
        });
        
        // Handle video loop counting
        videoBg.addEventListener('ended', () => {
            loopCount++;
            
            if (loopCount < maxLoops) {
                // Continue looping
                videoBg.currentTime = 0;
                videoBg.play();
            } else {
                // After 2 loops, replace video with Horse.jpg still image
                videoBg.style.opacity = '0';
                
                // Create background image element
                const stillImage = document.createElement('div');
                stillImage.className = 'parallax-bg still-image';
                stillImage.style.backgroundImage = "url('images/Barn Garden.jpeg')";
                stillImage.style.backgroundSize = 'cover';
                stillImage.style.backgroundPosition = 'center center';
                stillImage.style.backgroundRepeat = 'no-repeat';
                stillImage.style.opacity = '0';
                stillImage.style.transition = 'opacity 0.5s ease-in-out';
                
                // Insert the still image
                videoBg.parentNode.insertBefore(stillImage, videoBg);
                
                // Fade in the still image
                setTimeout(() => {
                    stillImage.style.opacity = '1';
                }, 100);
                
                // Hide the video after fade
                setTimeout(() => {
                    videoBg.style.display = 'none';
                }, 600);
            }
        });
        
        // Remove the loop attribute since we're handling it manually
        videoBg.removeAttribute('loop');
        
        // Handle video loading errors - show fallback image
        videoBg.addEventListener('error', () => {
            videoBg.style.display = 'none';
            const fallbackBg = videoBg.nextElementSibling;
            if (fallbackBg) {
                fallbackBg.style.display = 'block';
            }
        });
        
        // Ensure video starts playing
        videoBg.play().catch(() => {
            // If autoplay fails, show fallback image
            videoBg.style.display = 'none';
            const fallbackBg = videoBg.nextElementSibling;
            if (fallbackBg) {
                fallbackBg.style.display = 'block';
            }
        });
    }
    
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