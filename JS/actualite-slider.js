document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('[data-news-slider]');
  if (!slider) return;

  const fullModalMaxWidth = '92vw';
  const fullModalMaxHeight = '86vh';

  const ensureModal = () => {
    let modal = document.getElementById('news-lightbox');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'news-lightbox';
    modal.setAttribute('aria-hidden', 'true');
    modal.style.position = 'fixed';
    modal.style.inset = '0';
    modal.style.zIndex = '2500';
    modal.style.display = 'none';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';

    const overlay = document.createElement('div');
    overlay.className = 'news-lightbox-overlay';
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.75)';

    const inner = document.createElement('div');
    inner.style.position = 'relative';
    inner.style.zIndex = '1';
    inner.style.width = '100%';
    inner.style.display = 'flex';
    inner.style.alignItems = 'center';
    inner.style.justifyContent = 'center';

    const img = document.createElement('img');
    img.id = 'news-lightbox-img';
    img.alt = '';
    img.style.maxWidth = fullModalMaxWidth;
    img.style.maxHeight = fullModalMaxHeight;
    img.style.objectFit = 'contain';
    img.style.borderRadius = '12px';
    img.style.boxShadow = '0 12px 30px rgba(0,0,0,0.25)';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.id = 'news-lightbox-close';
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '0';
    closeBtn.style.right = '0';
    closeBtn.style.transform = 'translate(25px, -25px)';
    closeBtn.style.lineHeight = '1';

    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(255,255,255,0.3)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(255,255,255,0.15)';
    });

    closeBtn.style.width = '44px';
    closeBtn.style.height = '44px';
    closeBtn.style.borderRadius = '999px';
    closeBtn.style.border = '0';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.background = 'rgba(255,255,255,0.15)';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '1.3rem';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';

    inner.appendChild(img);
    modal.appendChild(overlay);
    modal.appendChild(inner);
    modal.appendChild(closeBtn);

    document.body.appendChild(modal);
    return modal;
  };

  const modal = ensureModal();
  const modalImg = document.getElementById('news-lightbox-img');
  const closeBtn = document.getElementById('news-lightbox-close');

  const openLightbox = (src, alt) => {
    if (!src) return;
    modalImg.src = src;
    modalImg.alt = alt || '';
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modalImg.src = '';
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  modal.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('news-lightbox-overlay')) {
      closeLightbox();
    }
  });

  closeBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isOpen = modal.getAttribute('aria-hidden') === 'false';
      if (isOpen) closeLightbox();
    }
  });


  const slides = slider.querySelectorAll('[data-news-slide]');
  const prevBtn = slider.querySelector('[data-news-prev]');
  const nextBtn = slider.querySelector('[data-news-next]');
  const dots = slider.querySelectorAll('[data-news-dot]');

  let index = 0;
  const show = (i) => {
    slides.forEach((s, idx) => {
      const isActive = idx === i;
      s.classList.toggle('is-active', isActive);
      if (isActive) {
        s.style.display = 'block';
      } else {
        s.style.display = 'none';
      }
    });

    dots.forEach((d, idx) => {
      if (idx === i) d.classList.add('active');
      else d.classList.remove('active');
    });
  };



  slides.forEach((s, idx) => {
    const isActive = idx === 0;
    s.style.display = isActive ? 'block' : 'none';
    s.classList.toggle('is-active', isActive);

    const img = s.querySelector('img');
    const fullSrc = img?.getAttribute('data-news-full');
    const alt = img?.alt;

    if (img && fullSrc) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(fullSrc, alt);
      });
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(fullSrc, alt);
        }
      });
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Ouvrir l’image en grand');
    }
  });


  dots.forEach((d, idx) => {
    if (idx === 0) d.classList.add('active');
    else d.classList.remove('active');
  });


  const go = (delta) => {
    index = (index + delta + slides.length) % slides.length;
    show(index);
  };

  prevBtn?.addEventListener('click', () => go(-1));
  nextBtn?.addEventListener('click', () => go(1));

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      index = idx;
      show(index);
    });
  });

  // Auto (défilement sans interaction)
  setInterval(() => go(1), 4000);
});



