document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('news-lightbox');
  const lightboxImg = document.getElementById('news-lightbox-img');
  const closeBtn = document.getElementById('news-lightbox-close');

  if (!lightbox || !lightboxImg) return;

  const open = (imgSrc) => {
    lightboxImg.src = imgSrc;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightboxImg.src = '';
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Clic sur vignettes
  const thumbs = document.querySelectorAll('[data-news-full-img]');
  thumbs.forEach((thumb) => {
    const src = thumb.getAttribute('data-news-full-img');
    thumb.style.cursor = 'pointer';
    thumb.addEventListener('click', () => open(src));
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') open(src);
    });
  });

  // Fermer
  closeBtn?.addEventListener('click', close);

  lightbox.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('news-lightbox-overlay')) {
      close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isOpen = lightbox.getAttribute('aria-hidden') === 'false';
      if (isOpen) close();
    }
  });
});

