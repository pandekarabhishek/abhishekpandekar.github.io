/* ════════════════════════════════════════════════════════════════
   ABHISHEK PANDEKAR — Portfolio Scripts
   ════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── MARK JS AS LOADED (prevents blank page if JS fails) ──── */
  // Adding this class to <html> is what enables the reveal animations in CSS.
  // If this script never runs, .reveal elements stay visible by default.
  document.documentElement.classList.add('js-loaded');

  /* ─── THEME TOGGLE ────────────────────────────────────────── */
  const html          = document.documentElement;
  const themeToggle   = document.getElementById('theme-toggle');
  const STORAGE_KEY   = 'ap-theme';

  const savedTheme    = localStorage.getItem(STORAGE_KEY);
  const systemPrefers = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const initialTheme  = savedTheme || systemPrefers;

  setTheme(initialTheme, false);

  themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next, true);
  });

  function setTheme(theme, save) {
    html.setAttribute('data-theme', theme);
    themeToggle?.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    if (save) localStorage.setItem(STORAGE_KEY, theme);
  }

  /* ─── MOBILE NAV ──────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      hamburger?.classList.remove('is-open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks?.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      hamburger?.classList.remove('is-open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ─── STICKY NAV ──────────────────────────────────────────── */
  const siteHeader = document.getElementById('site-header');

  function handleScroll() {
    const scrollY = window.scrollY;
    siteHeader?.classList.toggle('scrolled', scrollY > 30);
    // Back to top
    backToTop?.classList.toggle('is-visible', scrollY > 500);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ─── BACK TO TOP ─────────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');

  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── SCROLL REVEAL ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── COUNTER ANIMATION ───────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target    = parseInt(el.dataset.target, 10);
    const duration  = 1800;
    const startTime = performance.now();

    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  /* ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinkEls.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-70px 0px 0px 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ─── CONTACT FORM ────────────────────────────────────────── */
  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Build mailto link as a fallback (no backend required for GitHub Pages)
    const subject  = encodeURIComponent(`Portfolio Enquiry from ${name}`);
    const body     = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:pandekarabhishek@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;

    showStatus('Opening your email client… Thank you!', 'success');
    form.reset();
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent  = msg;
    formStatus.className    = `form-note ${type}`;
    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className   = 'form-note';
    }, 5000);
  }

  /* ─── ACTIVE NAV LINK STYLE ───────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--accent) !important; }`;
  document.head.appendChild(style);

})();
