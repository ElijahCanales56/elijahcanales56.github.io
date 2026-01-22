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

/* Gallery switching with fade animation (keeps previous gallery functionality) */
(function () {
  const gallery = document.getElementById('project-gallery');
  if (!gallery) return;

  const mainImg = document.getElementById('gallery-main-img');
  const titleEl = document.getElementById('gallery-title');
  const descEl = document.getElementById('gallery-desc');
  const thumbs = Array.from(gallery.querySelectorAll('.thumb'));

  function setSelectedThumb(selectedBtn) {
    thumbs.forEach(btn => {
      const isSel = btn === selectedBtn;
      btn.setAttribute('aria-selected', String(isSel));
      if (isSel) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
  }

  function swapProject(btn) {
    if (!btn) return;
    const newSrc = btn.dataset.src;
    const newTitle = btn.dataset.title || '';
    const newDesc = btn.dataset.desc || '';

    if (mainImg.getAttribute('src') === newSrc) {
      setSelectedThumb(btn);
      return;
    }

    mainImg.classList.add('is-fading');

    const onTransitionEnd = () => {
      mainImg.removeEventListener('transitionend', onTransitionEnd);
      const altText = `${newTitle} — ${newDesc}`;
      mainImg.setAttribute('src', newSrc);
      mainImg.setAttribute('alt', altText);
      titleEl.textContent = newTitle;
      descEl.textContent = newDesc;

      // Force reflow then fade in
      /* eslint-disable no-unused-expressions */
      mainImg.offsetWidth;
      /* eslint-enable no-unused-expressions */
      mainImg.classList.remove('is-fading');
    };
    mainImg.addEventListener('transitionend', onTransitionEnd);
    setSelectedThumb(btn);
  }

  thumbs.forEach((btn, index) => {
    btn.addEventListener('click', () => swapProject(btn));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        swapProject(btn);
      }
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

  const initial = thumbs.find(t => t.getAttribute('aria-selected') === 'true') || thumbs[0];
  if (initial) {
    mainImg.setAttribute('src', initial.dataset.src);
    titleEl.textContent = initial.dataset.title || '';
    descEl.textContent = initial.dataset.desc || '';
    setSelectedThumb(initial);
  }
})();

/* Hero background slideshow: cycles visible .bg-slide every 5 seconds with fade */
(function () {
  // Respect users who prefer reduced motion
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  const slides = Array.from(heroBg.querySelectorAll('.bg-slide'));
  if (!slides.length) return;

  // Ensure one slide is visible initially
  let current = slides.findIndex(s => s.classList.contains('visible'));
  if (current < 0) {
    current = 0;
    slides.forEach((s, i) => s.classList.toggle('visible', i === 0));
  }

  const intervalMs = 5000; // 5 seconds

  // Show slide at index (add visible class, remove from others)
  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('visible', i === index);
    });
    current = index;
  }

  // Advance to next slide
  function nextSlide() {
    const next = (current + 1) % slides.length;
    showSlide(next);
  }

  // Start automatic cycling
  let timerId = setInterval(nextSlide, intervalMs);

  // Pause cycling when page is hidden to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timerId);
      timerId = null;
    } else if (!timerId) {
      // resume
      timerId = setInterval(nextSlide, intervalMs);
    }
  });

  // Optional: pause on hover (desktop)
  heroBg.addEventListener('mouseenter', () => {
    clearInterval(timerId);
    timerId = null;
  });
  heroBg.addEventListener('mouseleave', () => {
    if (!timerId) timerId = setInterval(nextSlide, intervalMs);
  });
})();
