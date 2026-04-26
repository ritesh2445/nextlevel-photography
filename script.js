/**
 * NEXT LEVEL PHOTOGRAPHY — script.js
 * Matches houseontheclouds.com interactive behaviour exactly
 */

/* ── Sticky nav ─────────────────────────────────────────── */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile hamburger ───────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
  spans[1].style.opacity   = open ? '0' : '';
  spans[2].style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}));

/* ── Hero parallax ──────────────────────────────────────── */
const heroImg = document.getElementById('heroImg');
const heroH   = () => document.getElementById('heroSection')?.offsetHeight || window.innerHeight;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroImg && y < heroH()) {
    heroImg.style.transform = `translateY(${y * 0.28}px)`;
  }
}, { passive: true });

/* ── IntersectionObserver: fade-up ─────────────────────── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.js-fade-up').forEach(el => obs.observe(el));

/* ── Counter animation ──────────────────────────────────── */
function countUp(el) {
  const target = +el.dataset.target;
  const dur = 1800;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const cObs = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(countUp);
      cObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const stats = document.querySelector('.about-stats');
if (stats) cObs.observe(stats);

/* ── Smooth anchor scrolling ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 72);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── SOUL+CINEMA video autoplay ─────────────────────────── */
const vid = document.getElementById('scVideo');
if (vid) {
  vid.play().catch(() => {
    document.addEventListener('scroll', () => vid.play().catch(()=>{}), { once: true });
  });
  new IntersectionObserver((es) => {
    es.forEach(e => e.isIntersecting ? vid.play().catch(()=>{}) : vid.pause());
  }, { threshold: 0.2 }).observe(vid.closest('section') || vid);
}

/* ── Contact form ───────────────────────────────────────── */
const form = document.getElementById('contactForm');
const btn  = document.getElementById('submitBtn');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#4a7c59';
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 3500);
    }, 1500);
  });
}
