'use strict';

/* ── Preloader ─────────────────────────────── */
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => {
    if (preloader) {
      preloader.classList.add('hide');
      setTimeout(() => preloader.style.display = 'none', 700);
    }
    document.body.classList.add('loaded');
    initScrollReveal();
    startCounters();
    setTimeout(typeWriter, 2800);
  }, 2500);
});

/* ── Navbar ────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActiveNav();
  toggleScrollTopBtn();
  triggerSkillBars();
}, { passive: true });

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
      });
    }
  });
}

/* ── Hamburger / Mobile Nav ────────────────── */
const hamburger      = document.getElementById('hamburger');
const mobileNav      = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');

function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger && hamburger.classList.add('active');
}
function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
  hamburger && hamburger.classList.remove('active');
}
hamburger    && hamburger.addEventListener('click', () =>
  mobileNav && mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav()
);
mobileNavClose && mobileNavClose.addEventListener('click', closeMobileNav);
document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMobileNav));

/* ── Smooth Scroll ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

/* ── Theme Toggle ──────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
let isDark = true;

themeToggle && themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
});

/* ── Typing Animation ──────────────────────── */
const typingEl = document.getElementById('typing-text');
function typeWriter() {
  if (!typingEl) return;
  const words = [
    'Software Engineer',
    'Full-Stack Developer',
    'ML Developer',
    'Python Developer',
    'Data Scientist',
    'Problem Solver',
  ];
  let wi = 0, ci = 0, deleting = false, speed = 100;

  function tick() {
    const word = words[wi];
    typingEl.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
    deleting ? ci-- : ci++;
    speed = deleting ? 50 : 100;
    if (!deleting && ci === word.length)  { speed = 2000; deleting = true; }
    else if (deleting && ci === 0)        { deleting = false; wi = (wi + 1) % words.length; speed = 400; }
    setTimeout(tick, speed);
  }
  tick();
}

/* ── Stat Counters ─────────────────────────── */
function startCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target   = parseInt(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const duration = 1500;
    const step     = target / (duration / 16);
    let current    = 0;
    const timer    = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  });
}

/* ── Scroll Reveal ─────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
      } else {
        e.target.classList.remove('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ── Skill Bars ────────────────────────────── */
function triggerSkillBars() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;
  const rect = skillsSection.getBoundingClientRect();
  const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
  document.querySelectorAll('.skill-fill[data-width]').forEach(bar => {
    bar.style.width = inView ? bar.dataset.width + '%' : '0%';
  });
}

/* ── Project Filter ────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── Scroll to Top ─────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTopBtn');
function toggleScrollTopBtn() {
  if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 400);
}
scrollTopBtn && scrollTopBtn.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

/* ── Contact Form ──────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    [name, email, message].forEach(f => {
      f.classList.remove('invalid');
      document.getElementById(f.id + 'Error').classList.remove('show');
    });

    if (!name.value.trim() || name.value.trim().length < 2) {
      name.classList.add('invalid');
      document.getElementById('nameError').classList.add('show');
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('invalid');
      document.getElementById('emailError').classList.add('show');
      valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      message.classList.add('invalid');
      document.getElementById('messageError').classList.add('show');
      valid = false;
    }

    if (!valid) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      const success = document.getElementById('formSuccess');
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1500);
  });
}
