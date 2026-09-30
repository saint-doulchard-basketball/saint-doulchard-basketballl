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

    // 6. Global Lightbox (for Events and Citoyen labels)
    window.openLightbox = (imgSrc) => {
        const lightbox = document.getElementById('event-lightbox');
        const lightboxImg = document.getElementById('event-lightbox-img');
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = imgSrc;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const lightbox = document.getElementById('event-lightbox');
    const lightboxImg = document.getElementById('event-lightbox-img');
    const closeBtn = document.getElementById('event-lightbox-close');

    const openThumbs = document.querySelectorAll('.event-thumb');

    const openLightbox = (imgSrc) => {
        window.openLightbox(imgSrc);
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

    // 7. Welcome Popup (Home Page)
    const welcomePopup = document.getElementById('welcome-popup');
    const welcomePopupClose = document.getElementById('welcome-popup-close');

    if (welcomePopup && welcomePopupClose) {
        // Optionnel : on peut utiliser sessionStorage pour ne l'afficher qu'une fois par session de navigation
        if (!sessionStorage.getItem('welcomePopupShown')) {
            // Afficher le popup
            welcomePopup.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Empêche de scroller
            
            // Marquer comme affiché
            sessionStorage.setItem('welcomePopupShown', 'true');
        }

        const closeWelcomePopup = () => {
            welcomePopup.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        // Fermeture via le bouton X
        welcomePopupClose.addEventListener('click', closeWelcomePopup);

        // Fermeture via le clic en dehors du contenu (sur le fond gris)
        welcomePopup.addEventListener('click', (e) => {
            if (e.target === welcomePopup) {
                closeWelcomePopup();
            }
        });

                // Fermeture avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && welcomePopup.getAttribute('aria-hidden') === 'false') {
                closeWelcomePopup();
            }
        });
    }

    // 8. Event Sorting
    const eventSort = document.getElementById('event-sort');
    const eventsGrid = document.getElementById('events-grid');
    
    if (eventSort && eventsGrid) {
        let eventSortTimer;

        const sortEvents = () => {
            const cards = Array.from(eventsGrid.querySelectorAll('.card'));
            const now = new Date();
            const mode = eventSort.value;
            const events = cards.map((card, index) => {
                const dateValue = card.getAttribute('data-date');
                const [datePart, timePart] = (dateValue || '').split('T');
                const [year, month, day] = datePart.split('-').map(Number);
                const [hours = 0, minutes = 0] = (timePart || '').split(':').map(Number);
                const date = new Date(year, month - 1, day, hours, minutes);
                const hasValidStartDate = !Number.isNaN(date.getTime())
                    && date.getFullYear() === year
                    && date.getMonth() === month - 1
                    && date.getDate() === day;
                const endDateValue = card.getAttribute('data-date-end');
                const [endYear, endMonth, endDay] = (endDateValue || datePart).split('-').map(Number);
                const eventEnd = new Date(endYear, endMonth - 1, endDay);
                const hasValidEndDate = !Number.isNaN(eventEnd.getTime())
                    && eventEnd.getFullYear() === endYear
                    && eventEnd.getMonth() === endMonth - 1
                    && eventEnd.getDate() === endDay
                    && eventEnd >= new Date(year, month - 1, day);
                const hasValidDate = hasValidStartDate && hasValidEndDate;

                if (!hasValidDate) {
                    console.error(`Dates d'évènement invalides : "${dateValue}" - "${endDateValue || datePart}"`, card);
                }

                const deadline = new Date(eventEnd);
                if (hasValidDate && (endDateValue || !timePart)) {
                    deadline.setHours(23, 59, 59, 999);
                }

                return {
                    card,
                    date,
                    deadline,
                    hasValidDate,
                    index,
                    isUpcoming: hasValidDate && deadline >= now
                };
            });

            const visibleEvents = events.filter(({ isUpcoming, hasValidDate }) => {
                if (mode === 'upcoming' || mode === 'farthest') return isUpcoming;
                if (mode === 'past') return hasValidDate && !isUpcoming;
                return true;
            });

            visibleEvents.sort((a, b) => {
                if (mode === 'all' && a.isUpcoming !== b.isUpcoming) {
                    return a.isUpcoming ? -1 : 1;
                }

                const direction = mode === 'farthest' || mode === 'past'
                    || (mode === 'all' && !a.isUpcoming) ? -1 : 1;
                return direction * (a.date - b.date) || a.index - b.index;
            });

            const visibleCards = new Set(visibleEvents.map(({ card }) => card));
            cards.forEach(card => {
                card.hidden = !visibleCards.has(card);
            });
            visibleEvents.forEach(({ card }) => eventsGrid.appendChild(card));

            window.clearTimeout(eventSortTimer);
            const nextDeadline = events
                .filter(({ isUpcoming }) => isUpcoming)
                .reduce((next, { deadline }) => Math.min(next, deadline.getTime() + 1), Infinity);

            if (Number.isFinite(nextDeadline)) {
                eventSortTimer = window.setTimeout(
                    sortEvents,
                    Math.min(
                        Math.max(0, nextDeadline - now.getTime()),
                        24 * 60 * 60 * 1000
                    )
                );
            }
        };

        eventSort.addEventListener('change', sortEvents);
        
        sortEvents();
    }



    
});
