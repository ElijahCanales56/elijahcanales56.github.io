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
    // Let Formspree handle submission; show a friendly message during submission
    formStatus.textContent = 'Sending…';
    // Optionally, you can implement fetch() to POST to the endpoint and display success/error messages.
    // For the default HTML form POST, Formspree will redirect or show success based on their settings.
    setTimeout(() => {
      formStatus.textContent = 'If everything went well, check your email for the new inquiry (demo UX).';
    }, 1200);
  });
}