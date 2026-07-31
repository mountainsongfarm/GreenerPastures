document.addEventListener('DOMContentLoaded', () => {
    // Gentle parallax — background moves slower than scroll
    function handleParallax() {
        const sections = document.querySelectorAll('.parallax-section');
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach((section) => {
            const bg = section.querySelector('.parallax-bg');
            if (!bg) return;

            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = section.offsetHeight;

            // How far through this section we've scrolled (0 at top, 1 when section leaves)
            const progress = (scrollY - sectionTop) / sectionHeight;

            // Move background from -20% to 0% of section height over the scroll
            const maxTravel = sectionHeight * 0.2;
            const offset = -maxTravel + (progress * maxTravel);

            bg.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
    }

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

    handleParallax();
    
    
    // Header logo visibility — show when hero is scrolled past (home page only)
    const headerLogo = document.querySelector('.header-logo');
    const heroSection = document.querySelector('#home');

    function updateHeaderLogo() {
        if (!headerLogo) return;
        // On non-home pages, logo is always visible (class set in HTML)
        if (!heroSection) return;
        // On home page, show after scrolling past hero
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        if (window.scrollY > heroBottom - 100) {
            headerLogo.classList.add('visible');
        } else {
            headerLogo.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateHeaderLogo);
    updateHeaderLogo();

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            nav.classList.toggle('open');
        });

        // Close menu when a link is clicked
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                nav.classList.remove('open');
            });
        });
    }
    
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
    


    // Smooth scrolling for in-page anchor links only
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 