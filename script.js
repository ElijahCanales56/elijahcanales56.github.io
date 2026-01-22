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

/* Gallery switching (image + video support) */
(function () {
  const gallery = document.getElementById('project-gallery');
  if (!gallery) return;

  const mediaContainer = document.getElementById('gallery-media'); // container for img/video
  const titleEl = document.getElementById('gallery-title');
  const descEl = document.getElementById('gallery-desc');
  const thumbs = Array.from(gallery.querySelectorAll('.thumb'));

  // Helper to remove any existing media (img or video)
  function clearMedia() {
    // If there's a video playing, pause and remove it
    const existingVideo = mediaContainer.querySelector('video');
    if (existingVideo) {
      existingVideo.pause();
      // remove source to stop download if desired
      existingVideo.removeAttribute('src');
      existingVideo.load();
    }
    mediaContainer.innerHTML = ''; // remove children
  }

  // Create and return an <img> element
  function createImage(src, alt) {
    const img = document.createElement('img');
    img.id = 'gallery-main-img';
    img.src = src;
    img.alt = alt || '';
    img.loading = 'lazy';
    img.style.display = 'block';
    return img;
  }

  // Create and return a <video> element (not added to DOM yet)
  function createVideo(src, poster, alt) {
    const video = document.createElement('video');
    video.id = 'gallery-main-video';
    video.src = src;
    if (poster) video.poster = poster;
    video.setAttribute('playsinline', '');
    video.setAttribute('controls', ''); // show controls for user
    video.preload = 'none'; // do not preload until user interacts
    video.controls = true;
    video.style.display = 'block';
    // Accessible fallback alt text via aria-label
    if (alt) video.setAttribute('aria-label', alt);
    return video;
  }

  // Visual selection for thumbs
  function setSelectedThumb(selectedBtn) {
    thumbs.forEach(btn => {
      const isSel = btn === selectedBtn;
      btn.setAttribute('aria-selected', String(isSel));
      btn.classList.toggle('is-active', isSel);
    });
  }

  // Fade swap: fade out current media, then swap to new media (image or video), then fade in
  function swapProject(btn) {
    if (!btn) return;

    const newImgSrc = btn.dataset.src;     // image path (if any)
    const newVideoSrc = btn.dataset.video; // video path (if any)
    const newPoster = btn.dataset.poster;  // optional poster for video
    const newTitle = btn.dataset.title || '';
    const newDesc = btn.dataset.desc || '';

    // If the currently displayed media matches requested src, just update text and selection
    const currentImg = mediaContainer.querySelector('img');
    const currentVideo = mediaContainer.querySelector('video');
    if ((newImgSrc && currentImg && currentImg.src && currentImg.src.includes(newImgSrc)) ||
        (newVideoSrc && currentVideo && currentVideo.src && currentVideo.src.includes(newVideoSrc))) {
      titleEl.textContent = newTitle;
      descEl.textContent = newDesc;
      setSelectedThumb(btn);
      return;
    }

    // Begin fade-out. We'll set a class on mediaContainer to animate opacity via CSS.
    mediaContainer.classList.add('is-fading');

    // After fade-out transition, swap the media
    const onFadeOut = () => {
      mediaContainer.removeEventListener('transitionend', onFadeOut);

      // Remove existing media
      clearMedia();

      // Insert new media node
      if (newVideoSrc) {
        const videoEl = createVideo(newVideoSrc, newPoster, `${newTitle} — ${newDesc}`);
        mediaContainer.appendChild(videoEl);
        // Optionally autoplay muted on load (not recommended with sound). We'll not autoplay to respect user control.
      } else if (newImgSrc) {
        const imgEl = createImage(newImgSrc, `${newTitle} — ${newDesc}`);
        mediaContainer.appendChild(imgEl);
      } else {
        // nothing — leave blank
      }

      // Update title/desc
      titleEl.textContent = newTitle;
      descEl.textContent = newDesc;

      // Force reflow then remove fading class to fade in
      void mediaContainer.offsetWidth;
      mediaContainer.classList.remove('is-fading');

      // If the inserted media is a video and you'd like it to auto-play muted, you can uncomment:
      // const newVideo = mediaContainer.querySelector('video');
      // if (newVideo) { newVideo.muted = true; newVideo.play().catch(()=>{}); }
    };

    // Wait for transition to finish or fallback after a timeout (in case transitionend doesn't fire)
    mediaContainer.addEventListener('transitionend', onFadeOut);
    setTimeout(() => {
      // If transitionend didn't fire within 600ms, run onFadeOut manually
      if (mediaContainer.classList.contains('is-fading')) onFadeOut();
    }, 700);

    setSelectedThumb(btn);
  }

  // Attach handlers for clicks & keyboard
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

  // Initialize from the thumb with aria-selected="true" or the first thumb
  const initial = thumbs.find(t => t.getAttribute('aria-selected') === 'true') || thumbs[0];
  if (initial) {
    const initImg = initial.dataset.src;
    const initVideo = initial.dataset.video;
    if (initVideo) {
      mediaContainer.innerHTML = '';
      const v = createVideo(initVideo, initial.dataset.poster, `${initial.dataset.title} — ${initial.dataset.desc}`);
      mediaContainer.appendChild(v);
    } else if (initImg) {
      mediaContainer.innerHTML = '';
      const i = createImage(initImg, `${initial.dataset.title} — ${initial.dataset.desc}`);
      mediaContainer.appendChild(i);
    }
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
