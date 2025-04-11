document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        }
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        });
    });
    
    // Sticky Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header-area');
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form Validation
    const contactForm = document.querySelector('.contact-form');
    contactForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        // Add your form submission logic here
        console.log('Form submitted:', Object.fromEntries(formData));
    });

    // Gallery Image Modal
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add your gallery modal logic here
        });
    });

    // Animation on Scroll
    function revealOnScroll() {
        const elements = document.querySelectorAll('.transform-content, .feature-item, .class-card');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                element.classList.add('reveal');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Transform Section Animations
    document.addEventListener('DOMContentLoaded', function() {
        // Animate elements when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.2 });
    
        // Observe transform section elements
        document.querySelectorAll('.transform-content, .feature-box, .transform-image').forEach((el) => {
            observer.observe(el);
        });
    
        // Feature box hover effects
        const featureBoxes = document.querySelectorAll('.feature-box');
        featureBoxes.forEach(box => {
            box.addEventListener('mouseenter', function() {
                this.querySelector('.icon').style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            box.addEventListener('mouseleave', function() {
                this.querySelector('.icon').style.transform = 'scale(1) rotate(0deg)';
            });
        });
    
        // Phone link animation
        const phoneLink = document.querySelector('.phone-link');
        if (phoneLink) {
            phoneLink.addEventListener('mouseenter', function() {
                this.querySelector('i').style.animation = 'shake 0.5s ease';
            });
            
            phoneLink.addEventListener('animationend', function() {
                this.querySelector('i').style.animation = '';
            });
        }
    
        // Experience badge counter animation
        const experienceBadge = document.querySelector('.experience-badge .number');
        if (experienceBadge) {
            let count = 0;
            const target = 10;
            const duration = 2000;
            const step = target / (duration / 16);
    
            function updateCount() {
                if (count < target) {
                    count += step;
                    experienceBadge.textContent = Math.min(Math.floor(count), target) + '+';
                    requestAnimationFrame(updateCount);
                }
            }
    
            observer.observe(experienceBadge);
            experienceBadge.addEventListener('intersect', updateCount);
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});