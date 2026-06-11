/* ====================================================
   GYANIX AI — LANDING PAGE JAVASCRIPT
   Particles, Scroll Animations, Stats Counter, Navbar
   ==================================================== */

(function () {
  'use strict';

  // ─── NAVBAR SCROLL EFFECT ───────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ─── HAMBURGER MENU ─────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      // Animate spans
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close menu on nav link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  // ─── PARTICLE SYSTEM ────────────────────────────────────────────
  const canvas  = document.getElementById('particles-canvas');
  const ctx     = canvas.getContext('2d');

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  const COLORS = ['#7c3aed', '#a78bfa', '#06b6d4', '#67e8f9', '#ec4899'];

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x:     randBetween(0, W),
      y:     randBetween(0, H),
      r:     randBetween(1, 3),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx:    randBetween(-0.3, 0.3),
      vy:    randBetween(-0.5, -0.1),
      alpha: randBetween(0.2, 0.7),
      life:  0,
      maxLife: randBetween(120, 300),
    };
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((W * H) / 12000);
    for (let i = 0; i < count; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife; // stagger start
      particles.push(p);
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;

      // fade in / fade out
      const progress = p.life / p.maxLife;
      const fade = progress < 0.2
        ? progress / 0.2
        : progress > 0.8
          ? (1 - progress) / 0.2
          : 1;

      ctx.save();
      ctx.globalAlpha = p.alpha * fade;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > W + 10) {
        particles[i] = createParticle();
      }
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = '#7c3aed';
          ctx.lineWidth   = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  initParticles();
  drawParticles();

  // ─── SCROLL ANIMATIONS ───────────────────────────────────────────
  const scrollEls = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger children
        const delay = (entry.target.dataset.delay || 0) * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  // Add staggered delays to grid children
  document.querySelectorAll('.stats-grid .stat-card').forEach((el, i) => {
    el.dataset.delay = i;
  });
  document.querySelectorAll('.features-grid .feature-card').forEach((el, i) => {
    el.dataset.delay = i;
  });
  document.querySelectorAll('.tech-grid .tech-card').forEach((el, i) => {
    el.dataset.delay = i;
  });
  document.querySelectorAll('.steps-container .step').forEach((el, i) => {
    el.dataset.delay = i * 2;
  });

  scrollEls.forEach(el => observer.observe(el));

  // ─── STATS COUNTER ───────────────────────────────────────────────
  function animateCounter(el, target, duration = 2000, suffix = '') {
    const start    = performance.now();
    const isDecimal = target % 1 !== 0;

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);

      if (target >= 1000) {
        el.textContent = value.toLocaleString() + suffix;
      } else {
        el.textContent = value + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        statNumbers.forEach((el) => {
          const target = parseFloat(el.dataset.target);
          const suffix = el.dataset.suffix || (target === 98 ? '%' : '+');
          animateCounter(el, target, 2200, suffix);
        });
      }
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  // ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // ─── CURSOR GLOW EFFECT ───────────────────────────────────────────
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `
    position: fixed;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(cursorGlow);

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });

  // ─── HERO TYPING EFFECT (badge) ───────────────────────────────────
  // Subtle pulsing effect on hero badge
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    setInterval(() => {
      badge.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)';
      setTimeout(() => { badge.style.boxShadow = ''; }, 600);
    }, 3000);
  }

  // ─── BUTTON RIPPLE EFFECT ─────────────────────────────────────────
  document.querySelectorAll('.btn-hero-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        left: ${x}px; top: ${y}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-anim 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframe
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  // ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinkEls.forEach(link => {
          link.style.color = '';
          link.style.background = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--violet-light)';
          }
        });
      }
    });
  });

  console.log('%cGyanix AI 🛡️', 'font-size:24px; color:#7c3aed; font-weight:bold');
  console.log('%cAnonymous College Safety Platform — Powered by Azure OpenAI', 'color:#06b6d4');

})();
