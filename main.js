/* =================================================================
   JASHU PORTFOLIO · INTERACTIVE ENGINE & ANIMATIONS
   - Canvas Starfield & Floating Code Particles
   - Mouse Parallax for Glass Tech Tiles & Anime Character
   - Scroll Progress & Active Nav Indicator
   - Glass Project Filters & Theme Toggle
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initSectionNavigation();
  initMobileMenu();
  initBgParticlesCanvas();
  initOrbitalSystem();
  initProjectFilters();
  initScrollReveal();
  initFloatingContact();
  initCharacterClick();
  initCertModal();
});

/* ─── 1. THEME TOGGLE (DARK / LIGHT) ─── */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;
  const body = document.body;
  const savedTheme = localStorage.getItem('jashu_theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);

  toggleBtn.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    localStorage.setItem('jashu_theme', next);
  });
}

/* ─── 2. CLICK-BASED SECTION NAVIGATION (SPA SINGLE-PAGE ENGINE) ─── */
function initSectionNavigation() {
  const sections = document.querySelectorAll('.hero-section, .page-section');
  const navItems = document.querySelectorAll('.nav-item');

  function setActiveSection(targetId) {
    if (!targetId) return;

    let targetSection = document.getElementById(targetId);
    if (!targetSection) {
      targetId = 'home';
      targetSection = document.getElementById('home');
    }

    if (!targetSection) return;

    // 1. Switch active section state
    sections.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.add('active-section');
        sec.scrollTop = 0; // Reset scroll position inside section
      } else {
        sec.classList.remove('active-section');
      }
    });

    // 2. Update navbar item active states
    navItems.forEach(item => {
      const navKey = item.getAttribute('data-nav') || item.getAttribute('href')?.replace('#', '');
      item.classList.toggle('active', navKey === targetId);
    });

    // 3. Immediately reveal all '.reveal' elements inside target section
    targetSection.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible', 'revealed');
    });

    // 4. Update section progress bar
    updateProgressBar(targetSection);

    // 5. Close mobile menu if open
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('mobile-open');

    // 6. Update URL hash without triggering window scroll
    if (window.history.replaceState) {
      window.history.replaceState(null, null, '#' + targetId);
    }
  }

  // Intercept click events on links and buttons targeting sections
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.replace('#', '');
        if (targetId && document.getElementById(targetId)) {
          e.preventDefault();
          setActiveSection(targetId);
          return;
        }
      }
    }

    const logo = e.target.closest('.nav-logo');
    if (logo) {
      e.preventDefault();
      setActiveSection('home');
      return;
    }
  });

  // Track internal scroll inside active section for top progress bar
  sections.forEach(sec => {
    sec.addEventListener('scroll', () => {
      if (sec.classList.contains('active-section')) {
        updateProgressBar(sec);
      }
    }, { passive: true });
  });

  function updateProgressBar(sec) {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    const scrolled = sec.scrollTop;
    const total = sec.scrollHeight - sec.clientHeight;
    bar.style.width = total > 0 ? (scrolled / total) * 100 + '%' : '100%';
  }

  // Parse initial hash from URL or default to 'home'
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(initialHash)) {
    setActiveSection(initialHash);
  } else {
    setActiveSection('home');
  }

  // Expose helper globally
  window.setActiveSection = setActiveSection;
}

/* ─── 4. MOBILE MENU ─── */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));

  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });
}

/* ─── 5. CANVAS PARTICLES & FLOATING CODE SYMBOLS ─── */
function initBgParticlesCanvas() {
  const canvas = document.getElementById('bgParticlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const numParticles = Math.min(Math.floor(window.innerWidth / 15), 75);
  const particles = [];

  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? '#38bdf8' : '#a78bfa'
    });
  }

  const codeSymbols = ['</>', '{ }', 'def', 'SELECT', 'import', 'const', '=>', 'SQL', 'React', 'async'];
  const floatingCodes = [];
  for (let i = 0; i < 8; i++) {
    floatingCodes.push({
      text: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
      x: Math.random() * width,
      y: Math.random() * height,
      vy: -(Math.random() * 0.4 + 0.2),
      alpha: Math.random() * 0.2 + 0.06,
      fontSize: Math.floor(Math.random() * 6 + 12)
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x, dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 90) * 0.12;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    for (let i = 0; i < floatingCodes.length; i++) {
      const c = floatingCodes[i];
      c.y += c.vy;
      if (c.y < -30) {
        c.y = height + 20;
        c.x = Math.random() * width;
      }
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.fillStyle = '#a78bfa';
      ctx.font = `${c.fontSize}px 'JetBrains Mono', monospace`;
      ctx.fillText(c.text, c.x, c.y);
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ─── 6. HERO ORBITAL ANIMATION + MOUSE PARALLAX ─── */
function initOrbitalSystem() {
  const nodes = document.querySelectorAll('.orbit-node');
  const centralAvatar = document.getElementById('centralAvatarFrame');
  const glow1 = document.getElementById('glow1');
  const glow2 = document.getElementById('glow2');

  // Orbit ellipse config — 100% mathematically locked to orbital ring paths
  const orbitConfig = {
    1: { rx: 210, ry: 140 },   // Inner  (ring-a: 420px x 280px) — Git, React, SQL
    2: { rx: 280, ry: 185 },   // Middle (ring-b: 560px x 370px) — Python, AWS, JavaScript
    3: { rx: 350, ry: 230 }    // Outer  (ring-c: 700px x 460px) — Data Analytics, Docker
  };

  // Character z-index sits at 30; all chips pass behind it
  const CHAR_Z = 30;

  // Initialise node states from data attributes
  const nodeStates = [];
  nodes.forEach(node => {
    const orbit = parseInt(node.getAttribute('data-orbit')) || 2;
    const speed = parseFloat(node.getAttribute('data-speed')) || 0.006;
    const angle = parseFloat(node.getAttribute('data-angle')) || 0;
    nodeStates.push({ element: node, orbit, speed, angle, paused: false });

    node.addEventListener('mouseenter', () => {
      const s = nodeStates.find(n => n.element === node);
      if (s) s.paused = true;
    });
    node.addEventListener('mouseleave', () => {
      const s = nodeStates.find(n => n.element === node);
      if (s) s.paused = false;
    });
  });

  // Mouse parallax lerp
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  window.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth)  * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function animate() {
    // Smooth lerp
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    // Ambient glow parallax
    if (glow1) glow1.style.transform = `translate(${mouseX * 25}px, ${mouseY * 25}px)`;
    if (glow2) glow2.style.transform = `translate(${-mouseX * 20}px, ${-mouseY * 20}px)`;

    // Character subtle tilt — preserves absolute centering
    if (centralAvatar) {
      centralAvatar.style.transform =
        `translate(calc(-50% + ${mouseX * 10}px), calc(-50% + ${mouseY * 8}px)) ` +
        `rotateY(${mouseX * 5}deg) rotateX(${-mouseY * 5}deg)`;
    }

    // Viewport-responsive scale
    const vw = window.innerWidth;
    let scale = 1;
    if (vw < 600)  scale = 0.55;
    else if (vw < 900)  scale = 0.75;
    else if (vw < 1200) scale = 0.88;

    nodeStates.forEach(s => {
      if (!s.paused) s.angle += s.speed;

      const cfg = orbitConfig[s.orbit] || orbitConfig[2];
      const rx = cfg.rx * scale;
      const ry = cfg.ry * scale;

      // Pure 2D parametric position along the exact ellipse line:
      const x = rx * Math.cos(s.angle);
      const y = ry * Math.sin(s.angle);

      // Depth normalisation based on y position (sinA > 0 is front, sinA < 0 is back)
      const norm = (Math.sin(s.angle) + 1) / 2; // 0 (top/back) -> 1 (bottom/front)

      const nodeScale   = 0.85 + 0.30 * norm;    // 0.85 → 1.15
      const nodeOpacity = 0.75 + 0.25 * norm;    // 0.75 → 1.00 (High visibility!)
      const nodeBright  = 85   + 30   * norm;    // 85%  → 115%

      // Glow builds up on the front half of the orbit (norm > 0.5)
      const glowStr = Math.max(0, (norm - 0.5) * 2);
      const glowPx  = (glowStr * 16).toFixed(1);
      const glowAlpha = (glowStr * 0.6).toFixed(2);
      const glowFilter = glowStr > 0.05
        ? `drop-shadow(0 0 ${glowPx}px rgba(160, 100, 255, ${glowAlpha}))`
        : '';

      // All chips pass behind character (CHAR_Z = 30). Use depth (10..20) for chip-to-chip stacking.
      const nodeZ = Math.round(10 + norm * 10); // 10 (back) → 20 (front)

      const el = s.element;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${nodeScale.toFixed(3)})`;
      el.style.opacity   = s.paused ? '1' : nodeOpacity.toFixed(3);
      el.style.filter    = s.paused
        ? 'brightness(120%) drop-shadow(0 0 14px rgba(167,139,250,0.8))'
        : `brightness(${nodeBright.toFixed(1)}%) ${glowFilter}`;
      el.style.zIndex    = s.paused ? nodeZ + 5 : nodeZ;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* ─── 7. PROJECT CATEGORY FILTERING ─── */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards = document.querySelectorAll('.proj-card-glass');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('is-hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* ─── 8. SCROLL REVEAL ─── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'revealed');
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

/* ─── 9. FLOATING CONTACT MENU ─── */
function initFloatingContact() {
  const toggleBtn = document.getElementById('float-toggle');
  const menu = document.getElementById('float-menu');
  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', () => menu.classList.toggle('open'));

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#float-contact')) {
      menu.classList.remove('open');
    }
  });
}

/* ─── 10. CENTRAL AVATAR CLICK → NAVIGATE TO PROJECTS ─── */
function initCharacterClick() {
  const avatar = document.getElementById('centralAvatarFrame');
  if (!avatar) return;
  avatar.style.cursor = 'pointer';
  avatar.addEventListener('click', () => {
    if (window.setActiveSection) {
      window.setActiveSection('projects');
    }
  });
}

/* ─── 11. CERTIFICATE LIGHTBOX MODAL ENGINE ─── */
function initCertModal() {
  const modal = document.getElementById('certModal');
  const modalImg = document.getElementById('certModalImg');
  const modalTitle = document.getElementById('certModalTitle');
  const modalMeta = document.getElementById('certModalMeta');
  const closeBtn = document.getElementById('certModalClose');

  if (!modal || !modalImg || !closeBtn) return;

  function openModal(imgSrc, title, meta) {
    modalImg.src = imgSrc;
    if (modalTitle) modalTitle.textContent = title || '';
    if (modalMeta) modalMeta.textContent = meta || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      modalImg.src = '';
    }, 300);
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  document.querySelectorAll('[data-cert-img]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = trigger.getAttribute('data-cert-img');
      const title = trigger.getAttribute('data-cert-title');
      const meta = trigger.getAttribute('data-cert-meta');
      openModal(imgSrc, title, meta);
    });
  });
}
