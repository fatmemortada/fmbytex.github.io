/* ═══════════════════════════════════════════
   FMBytex — Main JavaScript
   Scroll reveal, nav, cursor, mobile menu
   ═══════════════════════════════════════════ */

// ── SCROLL REVEAL ──────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── NAV SCROLL ─────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 30);
  }, { passive: true });
}

// ── CUSTOM CURSOR ──────────────────────────
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cursorDot || cursorRing) {
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    }
  });

  (function animateRing() {
    if (cursorRing) {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
    }
    requestAnimationFrame(animateRing);
  })();

  // Enlarge cursor on interactive elements
  document.querySelectorAll('a, button, .btn, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorDot) {
        cursorDot.style.width = '14px';
        cursorDot.style.height = '14px';
      }
      if (cursorRing) {
        cursorRing.style.width = '48px';
        cursorRing.style.height = '48px';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cursorDot) {
        cursorDot.style.width = '6px';
        cursorDot.style.height = '6px';
      }
      if (cursorRing) {
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
      }
    });
  });
}

// ── MOBILE NAV ─────────────────────────────
const ham = document.querySelector('.nav-ham');
const navLinks = document.querySelector('.nav-links');

if (ham && navLinks) {
  ham.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    ham.setAttribute('aria-expanded', isOpen);
    ham.textContent = isOpen ? '✕' : '☰';
    if (!isOpen) {
      navLinks.classList.remove('open');
    }
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
      ham.textContent = '☰';
    });
  });
}

// ── HERO PARALLAX ORBS ────────────────────
document.addEventListener('mousemove', (e) => {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.5;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── COUNTER ANIMATION ON SCROLL ────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.count-up');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();
        const initial = parseInt(counter.textContent) || 0;

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // ease-out
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(initial + (target - initial) * eased);
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        }
        requestAnimationFrame(update);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.trust-bar, .trust-item').forEach(el => counterObserver.observe(el));

// ── ACTIVE NAV LINK HIGHLIGHT ──────────────
(function setActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── MOTION PASS: hero parallax, magnetic CTAs, quote rotator ──
(function motionPass() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  // Hero visual drifts gently on scroll
  var hv = document.querySelector('.hero-visual');
  if (hv && finePointer) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var y = Math.min(window.scrollY, window.innerHeight);
          hv.style.transform = 'translateY(' + (y * 0.08) + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Primary CTAs pull slightly toward the cursor
  if (finePointer) {
    document.querySelectorAll('.hero-actions .btn-primary').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.15;
        var y = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  // Testimonials crossfade every 6s, pause on hover
  var quotes = document.querySelectorAll('.testimonial .testimonial-inner');
  if (quotes.length > 1) {
    var i = 0, timer = null;
    var show = function (n) {
      quotes.forEach(function (q, k) { q.classList.toggle('on', k === n); });
    };
    var start = function () {
      timer = setInterval(function () { i = (i + 1) % quotes.length; show(i); }, 6000);
    };
    show(0); start();
    var sec = document.querySelector('.testimonial');
    if (sec) {
      sec.addEventListener('mouseenter', function () { clearInterval(timer); });
      sec.addEventListener('mouseleave', start);
    }
  }
})();

// Carousel arrow buttons (always available, including reduced-motion)
document.querySelectorAll('.carousel-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var track = document.getElementById(btn.dataset.target);
    if (!track) return;
    var dir = parseInt(btn.dataset.dir, 10) || 1;
    var card = track.querySelector('.svc-slide');
    var step = card ? card.offsetWidth + 20 : 340;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' });
  });
});

console.log('%c FMBytex %c Premium Digital Agency %c v3 ',
  'background:#3B82F6;color:#fff;padding:4px 8px;font-weight:700;',
  'color:#A1A1AA;',
  'color:#52525B;');
