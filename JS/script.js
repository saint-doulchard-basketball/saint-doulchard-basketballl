document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        
        // Toggle icon between bars and times (close)
        if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // 2. Mobile Dropdown Toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // Prevent default link behavior if clicking the main dropdown link on mobile
                if (e.target.tagName.toLowerCase() === 'a' && e.target.nextElementSibling && e.target.nextElementSibling.classList.contains('dropdown-menu')) {
                    e.preventDefault();
                }
                dropdown.classList.toggle('active');
            }
        });
    });

    // 3. Infinite Marquee Duplicate Logic
    const marqueeTrack = document.querySelector('.partners-track');
    if (marqueeTrack) {
        const logos = Array.from(marqueeTrack.children);
        logos.forEach(logo => {
            const clone = logo.cloneNode(true);
            marqueeTrack.appendChild(clone);
        });
    }

    // 4. Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            header.style.padding = '5px 0'; // Slight shrink effect
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.padding = '10px 0';
        }
    });

    // 5. Scroll Animations (Intersection Observer avec correctif de démarrage rapide)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05 // Se déclenche dès que 5% de l'élément est visible (plus réactif sur mobile)
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si l'élément est visible à l'écran
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop l'écoute
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        observer.observe(el);
        
        // SÉCURITÉ : Si l'élément est en haut de la page (Hero), on force l'affichage immédiatement
        const rect = el.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight) {
            el.classList.add('is-visible');
        }
    });

    // 6. Event lightbox
    const lightbox = document.getElementById('event-lightbox');
    const lightboxImg = document.getElementById('event-lightbox-img');
    const closeBtn = document.getElementById('event-lightbox-close');

    const openThumbs = document.querySelectorAll('.event-thumb');

    const openLightbox = (imgSrc) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = imgSrc;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = '';
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    openThumbs.forEach(btn => {
        btn.addEventListener('click', () => {
            const src = btn.getAttribute('data-event-img');
            openLightbox(src);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            // Ferme si clic sur le fond overlay (pas sur l'image)
            if (e.target && e.target.classList && e.target.classList.contains('event-lightbox-overlay')) {
                closeLightbox();
            }

        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const isOpen = lightbox && lightbox.getAttribute('aria-hidden') === 'false';
            if (isOpen) closeLightbox();
        }
    });
});

