/* =========================================================
   FORNO — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     Loading Screen
  --------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // Fallback in case load event already fired / is slow
  setTimeout(() => loader.classList.add('hidden'), 2500);

  /* ---------------------------------------------------
     Navbar: scroll state + active link highlight
  --------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let currentId = '';
    const scrollPos = window.scrollY + 140;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });

    backToTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------
     Mobile Navigation
  --------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------------------------------------------------
     Theme Toggle (Dark / Light)
  --------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      root.removeAttribute('data-theme');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let currentTheme = prefersDark ? 'dark' : 'light';
  applyTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
  });

  /* ---------------------------------------------------
     Smooth Scroll for in-page anchors
  --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMobileNav();
      }
    });
  });

  /* ---------------------------------------------------
     Scroll Reveal via Intersection Observer
  --------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    // Hero elements animate on load via CSS, skip observing them
    if (!el.closest('.hero-inner')) {
      revealObserver.observe(el);
    }
  });

  /* ---------------------------------------------------
     Dynamic Counter Animation for stats
  --------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------
     Menu Filter
  --------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------------------------------------------------
     FAQ Accordion
  --------------------------------------------------- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const wasOpen = item.classList.contains('open');

      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------------------------------------------------
     Testimonial Slider
  --------------------------------------------------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentSlide = 0;
  let slideTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    resetSlideTimer();
  }

  function resetSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
  }

  if (slides.length) {
    slides[0].classList.add('active');
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    resetSlideTimer();
  }

  /* ---------------------------------------------------
     Back to Top
  --------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------
     Toast Notification
  --------------------------------------------------- */
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer;

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
  }

  /* ---------------------------------------------------
     Reservation Form Validation
  --------------------------------------------------- */
  const reserveForm = document.getElementById('reserveForm');

  function setError(id, message) {
    const group = document.getElementById(id).closest('.form-group');
    const errorEl = document.getElementById(`error-${id}`);
    if (message) {
      group.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      group.classList.remove('invalid');
      errorEl.textContent = '';
    }
    return !message;
  }

  reserveForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const date = document.getElementById('date').value;
    const guests = document.getElementById('guests').value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validName = setError('name', name.length < 2 ? 'Please enter your name.' : '');
    const validEmail = setError('email', !emailPattern.test(email) ? 'Please enter a valid email.' : '');
    const validDate = setError('date', !date ? 'Please choose a date.' : '');
    const validGuests = setError('guests', !guests ? 'Please select a party size.' : '');

    if (!(validName && validEmail && validDate && validGuests)) {
      return;
    }

    const submitBtn = reserveForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');

    // Simulate network request
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      showToast(`Thanks, ${name.split(' ')[0]} — we'll confirm your table shortly.`);
      reserveForm.reset();
    }, 1200);
  });

  /* ---------------------------------------------------
     Newsletter Form
  --------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("You're on the list — welcome to FORNO.");
    newsletterForm.reset();
  });

  /* ---------------------------------------------------
     Ember Particle Canvas (hero signature animation)
  --------------------------------------------------- */
  const canvas = document.getElementById('emberCanvas');
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  let embers = [];
  let animationFrame;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createEmber() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      radius: Math.random() * 2 + 0.6,
      speed: Math.random() * 1.2 + 0.4,
      drift: (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.6 + 0.3,
      flicker: Math.random() * 0.02 + 0.01
    };
  }

  function initEmbers() {
    embers = Array.from({ length: 60 }, createEmber);
  }

  function drawEmbers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    embers.forEach(ember => {
      ember.y -= ember.speed;
      ember.x += ember.drift;
      ember.opacity -= ember.flicker * 0.3;

      if (ember.y < -10 || ember.opacity <= 0) {
        Object.assign(ember, createEmber(), { y: canvas.height + 10 });
      }

      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 133, 68, ${Math.max(ember.opacity, 0)})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(196, 98, 45, 0.8)';
      ctx.fill();
    });
    animationFrame = requestAnimationFrame(drawEmbers);
  }

  if (canvas) {
    resizeCanvas();
    initEmbers();
    if (!reducedMotion) {
      drawEmbers();
    } else {
      // Draw a single static frame for reduced-motion users
      embers.forEach(ember => {
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 133, 68, ${ember.opacity})`;
        ctx.fill();
      });
    }
    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  }

  // Initial scroll state check
  onScroll();
});
