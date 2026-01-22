// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    const hidden = siteNav.getAttribute('aria-hidden') === 'true';
    siteNav.setAttribute('aria-hidden', String(!hidden));
  });

  // Initialize aria-hidden
  if (!siteNav.hasAttribute('aria-hidden')) siteNav.setAttribute('aria-hidden', 'true');
}

// Set current year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple front-end form handler for UX (Formspree will handle sending)
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', (e) => {
    formStatus.textContent = 'Sending…';
    setTimeout(() => {
      formStatus.textContent = 'If everything went well, check your email for the new inquiry (demo UX).';
    }, 1200);
  });
}

/* Gallery switching with fade animation */
(function () {
  const gallery = document.getElementById('project-gallery');
  if (!gallery) return;

  const mainImg = document.getElementById('gallery-main-img');
  const titleEl = document.getElementById('gallery-title');
  const descEl = document.getElementById('gallery-desc');
  const thumbs = Array.from(gallery.querySelectorAll('.thumb'));

  // Helper to update selected thumb aria attributes and border
  function setSelectedThumb(selectedBtn) {
    thumbs.forEach(btn => {
      const isSel = btn === selectedBtn;
      btn.setAttribute('aria-selected', String(isSel));
      if (isSel) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
  }

  // Fade swap logic
  function swapProject(btn) {
    if (!btn) return;
    const newSrc = btn.dataset.src;
    const newTitle = btn.dataset.title || '';
    const newDesc = btn.dataset.desc || '';

    // If already showing that src, no-op
    if (mainImg.getAttribute('src') === newSrc) {
      setSelectedThumb(btn);
      return;
    }

    // Start fade out
    mainImg.classList.add('is-fading');

    // After transition end, swap content and fade back in
    const onTransitionEnd = () => {
      mainImg.removeEventListener('transitionend', onTransitionEnd);
      // Swap src and alt
      const altText = `${newTitle} — ${newDesc}`;
      mainImg.setAttribute('src', newSrc);
      mainImg.setAttribute('alt', altText);
      titleEl.textContent = newTitle;
      descEl.textContent = newDesc;

      // Force reflow then remove fading class to fade in
      // eslint-disable-next-line no-unused-expressions
      mainImg.offsetWidth;
      mainImg.classList.remove('is-fading');
    };
    mainImg.addEventListener('transitionend', onTransitionEnd);
    setSelectedThumb(btn);
  }

  // Attach click and keyboard handlers to thumbs
  thumbs.forEach((btn, index) => {
    btn.addEventListener('click', () => swapProject(btn));
    btn.addEventListener('keydown', (e) => {
      // Enter/Space activate
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        swapProject(btn);
      }
      // Arrow keys to move focus between thumbs
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = thumbs[(index + 1) % thumbs.length];
        next.focus();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = thumbs[(index - 1 + thumbs.length) % thumbs.length];
        prev.focus();
      }
    });
  });

  // Optionally, initialize first thumb as selected
  const initial = thumbs.find(t => t.getAttribute('aria-selected') === 'true') || thumbs[0];
  if (initial) {
    // Ensure main display matches initial
    mainImg.setAttribute('src', initial.dataset.src);
    titleEl.textContent = initial.dataset.title || '';
    descEl.textContent = initial.dataset.desc || '';
    setSelectedThumb(initial);
  }
})();
