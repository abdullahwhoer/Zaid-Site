/* ============================================================
   ZAID PORTFOLIO - MAIN JAVASCRIPT
   GSAP + ScrollTrigger + Carousel + EmailJS + Animations
   ============================================================ */

/* ======================== EMAILJS CONFIGURATION ========================
   ➡  Sign up at https://emailjs.com (free)
   ➡  Create a service (Gmail works great)
   ➡  Create an email template with these variables:
       {{from_name}}, {{from_email}}, {{phone}}, {{message}}
   ➡  Replace the placeholders below with your actual IDs
   ====================================================================== */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',   // From EmailJS → Account → API Keys
  SERVICE_ID: 'YOUR_SERVICE_ID',   // From EmailJS → Email Services
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',  // From EmailJS → Email Templates
};

/* ======================== INITIALIZE EMAILJS ======================== */
if (
  EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
  EMAILJS_CONFIG.PUBLIC_KEY.trim() !== ''
) {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

/* ======================== LOADER ======================== */
function hideLoader() {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 300);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hideLoader);
} else {
  hideLoader();
}

/* ======================== PARTICLES ======================== */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 12;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 8}s;
      animation-duration: ${6 + Math.random() * 6}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ======================== NAVBAR ======================== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const MOBILE_NAV_BREAKPOINT = 900;

function isMobileViewport() {
  return window.innerWidth <= MOBILE_NAV_BREAKPOINT;
}

function setMobileMenuOpen(isOpen) {
  if (!hamburger || !navLinks) return;
  hamburger.classList.toggle('open', isOpen);
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('nav-open', isOpen);
}

// Sticky on scroll
window.addEventListener('scroll', () => {
  if (navbar && window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else if (navbar) {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
}, { passive: true });

// Hamburger toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const shouldOpen = !navLinks.classList.contains('open');
    setMobileMenuOpen(shouldOpen);
  });
}

// Close mobile menu on link click
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    setMobileMenuOpen(false);
  });
});

// Close mobile menu when tapping outside nav
document.addEventListener('click', (event) => {
  if (!isMobileViewport() || !navbar || !navLinks || !hamburger) return;
  if (!navLinks.classList.contains('open')) return;
  if (navbar.contains(event.target)) return;
  setMobileMenuOpen(false);
});

// Keep menu state correct across viewport changes
window.addEventListener('resize', () => {
  if (!isMobileViewport()) setMobileMenuOpen(false);
});

// Close menu on Escape
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMobileMenuOpen(false);
});

/* Active nav link on scroll */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + window.innerHeight / 3;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}
updateActiveNavLink();

/* Smooth scroll for nav links */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ======================== AOS INIT ======================== */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
});

/* ======================== GSAP SCROLL TRIGGERS ======================== */
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);
}

function initHeroAnimations() {
  if (!hasGsap) return;
  // Hero content - stagger entrance
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-greeting', { opacity: 0, y: 30, duration: 0.7 })
    .from('.title-line', { opacity: 0, y: 40, stagger: 0.15, duration: 0.7 }, '-=0.3')
    .from('.title-ampersand', { opacity: 0, scale: 0.5, duration: 0.5 }, '-=0.3')
    .from('.hero-description', { opacity: 0, y: 20, duration: 0.6 }, '-=0.2')
    .from('.hero-buttons .btn', { opacity: 0, y: 20, stagger: 0.15, duration: 0.5 }, '-=0.3')
    .from('.hero-social', { opacity: 0, y: 15, duration: 0.5 }, '-=0.2')
    .from('.hero-image-wrapper', { opacity: 0, scale: 0.85, duration: 0.9, ease: 'back.out(1.7)' }, '-=1')
    .from('.hero-badge', { opacity: 0, scale: 0.5, stagger: 0.2, duration: 0.5 }, '-=0.5')
    .from('.hero-scroll-indicator', { opacity: 0, y: 10, duration: 0.5 }, '-=0.2');
}

/* Service cards are handled by AOS */

/* Stats counters */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    const value = Math.round(eased * target);
    el.textContent = formatNumber(value);

    // Continue loop until fully completed
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = formatNumber(target);
    }
  }
  requestAnimationFrame(update);
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 !== 0 ? 1 : 0) + 'K';
  return n.toString();
}

const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => {
  el.textContent = "0"; // ensure 0 initially
  statsObserver.observe(el);
});

/* ======================== TESTIMONIALS CAROUSEL ======================== */
const testiTrack = document.getElementById('testiTrack');
const testiSlides = Array.from(document.querySelectorAll('.testi-card'));
const testiDotsContainer = document.getElementById('testiDots');

let currentTesti = 0;
let testiTimer = null;
let testiPerView = getTestiPerView();
let testiGroups = Math.ceil(testiSlides.length / testiPerView);

function getTestiPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function buildTestiDots() {
  if (!testiDotsContainer) return;
  testiDotsContainer.innerHTML = '';
  testiGroups = Math.ceil(testiSlides.length / testiPerView);
  for (let i = 0; i < testiGroups; i++) {
    const dot = document.createElement('button');
    dot.classList.add('testi-dot');
    dot.setAttribute('aria-label', `Testimonial Group ${i + 1}`);
    if (i === currentTesti) dot.classList.add('active');
    dot.addEventListener('click', () => goTesti(i));
    testiDotsContainer.appendChild(dot);
  }
}

function updateTestiDots() {
  document.querySelectorAll('.testi-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTesti);
  });
}

function goTesti(index) {
  testiPerView = getTestiPerView();
  testiGroups = Math.ceil(testiSlides.length / testiPerView);
  currentTesti = Math.max(0, Math.min(index, testiGroups - 1));

  const slideW = testiSlides[0].offsetWidth + 24; // 24px gap
  const offset = currentTesti * testiPerView * slideW;

  if (testiTrack) {
    testiTrack.style.transform = `translateX(-${offset}px)`;
  }
  updateTestiDots();
  startTestiAutoplay();
}

function nextTesti() {
  testiPerView = getTestiPerView();
  testiGroups = Math.ceil(testiSlides.length / testiPerView);
  goTesti(currentTesti >= testiGroups - 1 ? 0 : currentTesti + 1);
}

function startTestiAutoplay() {
  if (testiTimer) clearInterval(testiTimer);
  testiTimer = setInterval(nextTesti, 5000);
}

if (testiSlides.length > 0) {
  buildTestiDots();
  startTestiAutoplay();

  /* Pause on hover */
  const wrapper = document.querySelector('.testi-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(testiTimer));
    wrapper.addEventListener('mouseleave', startTestiAutoplay);
  }
}

/* Section reveals are handled by AOS */

/* ======================== PORTFOLIO CAROUSEL ======================== */
const track = document.getElementById('carouselTrack');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const dotsContainer = document.getElementById('carouselDots');

let currentIndex = 0;
let autoplayTimer = null;
let slidesPerView = getSlidesPerView();
let totalGroups = Math.ceil(slides.length / slidesPerView);
let isDragging = false;
let startX = 0;
let dragDiff = 0;
const AUTO_DELAY = 4000;

function getSlidesPerView() {
  if (window.innerWidth <= 768) return 1;
  return 2;
}

/* Build dots */
function buildDots() {
  dotsContainer.innerHTML = '';
  totalGroups = Math.ceil(slides.length / slidesPerView);
  for (let i = 0; i < totalGroups; i++) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function goTo(index) {
  slidesPerView = getSlidesPerView();
  totalGroups = Math.ceil(slides.length / slidesPerView);
  currentIndex = Math.max(0, Math.min(index, totalGroups - 1));

  if (slides.length > 0) {
    const slideWidth = slides[0].getBoundingClientRect().width + 16; 
    const offset = currentIndex * slidesPerView * slideWidth;
    track.style.transform = `translateX(-${offset}px)`;
  }
  updateDots();
}

function next() {
  slidesPerView = getSlidesPerView();
  totalGroups = Math.ceil(slides.length / slidesPerView);
  goTo(currentIndex >= totalGroups - 1 ? 0 : currentIndex + 1);
}

function prev() {
  slidesPerView = getSlidesPerView();
  totalGroups = Math.ceil(slides.length / slidesPerView);
  goTo(currentIndex <= 0 ? totalGroups - 1 : currentIndex - 1);
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(next, AUTO_DELAY);
}

function stopAutoplay() {
  if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
}

prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
nextBtn.addEventListener('click', () => { next(); startAutoplay(); });

// Touch / drag support
const carouselEl = document.querySelector('.carousel-container');
carouselEl.addEventListener('mousedown', onDragStart, { passive: true });
carouselEl.addEventListener('touchstart', onDragStart, { passive: true });
window.addEventListener('mousemove', onDragMove, { passive: true });
window.addEventListener('touchmove', onDragMove, { passive: true });
window.addEventListener('mouseup', onDragEnd);
window.addEventListener('touchend', onDragEnd);

function onDragStart(e) {
  isDragging = true;
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  stopAutoplay();
  track.style.transition = 'none';
}

function onDragMove(e) {
  if (!isDragging) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  dragDiff = x - startX;
}

function onDragEnd() {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
  if (Math.abs(dragDiff) > 60) {
    dragDiff < 0 ? next() : prev();
  } else {
    goTo(currentIndex);
  }
  dragDiff = 0;
  startAutoplay();
}

// Pause autoplay on hover
carouselEl.addEventListener('mouseenter', stopAutoplay);
carouselEl.addEventListener('mouseleave', startAutoplay);

// Init
buildDots();
startAutoplay();

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
  if (e.key === 'ArrowRight') { next(); startAutoplay(); }
});

// Recalculate on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    slidesPerView = getSlidesPerView();
    buildDots();
    // Maintain relative position or reset to 0
    goTo(0);
  }, 200);
});

/* ======================== LIGHTBOX LOGIC ======================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox && slides.length > 0) {
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    const title = slide.querySelector('h3')?.textContent || '';
    
    if (img) {
      slide.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = title;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scroll
      });
    }
  });

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
  });
}

/* ======================== CONTACT FORM + EMAILJS ======================== */
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnIcon = document.getElementById('btnIcon');
const btnLoader = document.getElementById('btnLoader');

function showToast(type) {
  const toast = document.getElementById(type === 'success' ? 'toastSuccess' : 'toastError');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.textContent = loading ? 'Sending...' : 'Send Message';
  btnIcon.style.display = loading ? 'none' : 'inline-block';
  btnLoader.style.display = loading ? 'inline-block' : 'none';
}

function validateField(fieldId, errorId, validator) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!error) return validator(field.value);
  const isValid = validator(field.value);
  if (!isValid) {
    error.classList.add('visible');
    field.parentElement.style.borderColor = '#f87171';
  } else {
    error.classList.remove('visible');
    field.parentElement.style.borderColor = '';
  }
  return isValid;
}

function validateForm() {
  const nameValid = validateField('name', 'nameError', (v) => {
    if (!v.trim()) { document.getElementById('nameError').textContent = 'Name is required.'; return false; }
    if (v.trim().length < 2) { document.getElementById('nameError').textContent = 'Name must be at least 2 characters.'; return false; }
    return true;
  });

  const emailValid = validateField('email', 'emailError', (v) => {
    if (!v.trim()) { document.getElementById('emailError').textContent = 'Email is required.'; return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { document.getElementById('emailError').textContent = 'Please enter a valid email.'; return false; }
    return true;
  });

  const messageValid = validateField('message', 'messageError', (v) => {
    if (!v.trim()) { document.getElementById('messageError').textContent = 'Message is required.'; return false; }
    if (v.trim().length < 10) { document.getElementById('messageError').textContent = 'Message must be at least 10 characters.'; return false; }
    return true;
  });

  return nameValid && emailValid && messageValid;
}

// Real-time validation clear on input
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      const error = document.getElementById(id + 'Error');
      if (error) error.classList.remove('visible');
    });
  }
});

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);

  const templateParams = {
    from_name: document.getElementById('name').value.trim(),
    from_email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim() || 'Not provided',
    message: document.getElementById('message').value.trim(),
  };

  // Check if EmailJS is configured
  if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    // Demo mode — simulate success
    await new Promise(res => setTimeout(res, 1500));
    setLoading(false);
    contactForm.reset();
    showToast('success');
    console.info('EmailJS not configured yet. Form data:', templateParams);
    return;
  }

  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );
    setLoading(false);
    contactForm.reset();
    showToast('success');
  } catch (err) {
    console.error('EmailJS error:', err);
    setLoading(false);
    showToast('error');
  }
});

/* ======================== GSAP — FOOTER REVEAL ======================== */
if (hasGsap) {
  gsap.from('.footer-brand, .footer-links, .footer-services', {
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 85%',
    },
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
  });
}

/* ======================== SCROLL PROGRESS BAR ======================== */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: linear-gradient(90deg, #4f8ef7, #7c4dff);
  z-index: 10000;
  transition: width 0.1s linear;
  pointer-events: none;
  box-shadow: 0 0 8px rgba(79,142,247,0.8);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = (scrolled / maxScroll) * 100;
  progressBar.style.width = progress + '%';
}, { passive: true });

/* ======================== SECTION ENTRANCE (handled by AOS) ======================== */
