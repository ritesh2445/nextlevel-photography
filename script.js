/**
 * NEXT LEVEL PHOTOGRAPHY — script.js
 * Scroll animations, sticky nav, mobile menu, counter, parallax
 * Matches houseontheclouds.com interactive behaviour
 */

/* ─── NAVBAR: sticky + dark-mode on films section ─── */
const siteHeader = document.getElementById('siteHeader');
const filmsSection = document.getElementById('films');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Sticky shadow
  if (scrollY > 20) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }

  // Dark nav when inside films section
  if (filmsSection) {
    const fsTop = filmsSection.getBoundingClientRect().top + scrollY;
    const fsBottom = fsTop + filmsSection.offsetHeight;
    if (scrollY + 50 > fsTop && scrollY < fsBottom) {
      document.body.classList.add('in-films');
    } else {
      document.body.classList.remove('in-films');
    }
  }
}, { passive: true });

/* ─── MOBILE HAMBURGER ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(5.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-5.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ─── INTERSECTION OBSERVER: fade-up animation ─── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Don't unobserve — keep visible once triggered
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.js-fade-up').forEach(el => animObserver.observe(el));

/* ─── HERO PARALLAX ─── */
const heroSection = document.getElementById('heroSection');
const heroImg     = document.getElementById('heroImg');

if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroH   = heroSection ? heroSection.offsetHeight : window.innerHeight;
    if (scrollY < heroH) {
      heroImg.style.transform = `scale(1.0) translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
}

/* ─── COUNTER ANIMATION ─── */
function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur = 2000;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(countUp);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsWrap = document.querySelector('.about-stats');
if (statsWrap) counterObserver.observe(statsWrap);

/* ─── SMOOTH ANCHOR SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const navH = siteHeader ? siteHeader.offsetHeight : 80;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── CONTACT FORM ─── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const orig = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = '✓ Sent! We\'ll be in touch.';
      submitBtn.style.background = '#2e6b4f';
      setTimeout(() => {
        submitBtn.textContent = orig;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        contactForm.reset();
      }, 3500);
    }, 1600);
  });
}

/* ─── SOUL+CINEMA: force-play video on scroll into view ─── */
const scVideo = document.getElementById('scVideo');
if (scVideo) {
  // Try immediate autoplay
  scVideo.play().catch(() => {
    // If autoplay blocked, play on first user interaction
    document.addEventListener('click', () => scVideo.play(), { once: true });
    document.addEventListener('scroll', () => scVideo.play(), { once: true });
  });

  // Also use IntersectionObserver for efficiency
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        scVideo.play().catch(() => {});
      } else {
        scVideo.pause();
      }
    });
  }, { threshold: 0.2 });

  videoObserver.observe(scVideo.closest('section') || scVideo);
}

/* ─── IMAGE HOVER: subtle scale override for mosaic interactions ─── */
document.querySelectorAll('.photo-item, .film-card').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.zIndex = '2';
  });
  item.addEventListener('mouseleave', () => {
    item.style.zIndex = '';
  });
});
