/**
 * Abhay Shukla Portfolio — Robust Motion & Navigation Script
 * Integration: Lenis, GSAP, ScrollTrigger (loaded via jsDelivr)
 */

(function () {
  'use strict';

  // Mark JS enabled
  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. HEADER SCROLL & MOBILE MENU ──
  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const menuBtnText = menuToggle ? menuToggle.querySelector('.menu-btn-text') : null;
  const mobileOverlay = document.getElementById('mobile-overlay');

  let lastScrollY = window.scrollY;

  function closeMobileMenu() {
    if (!mobileOverlay || !menuToggle) return;
    mobileOverlay.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    if (menuBtnText) menuBtnText.textContent = 'Menu';
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    if (!mobileOverlay || !menuToggle) return;
    mobileOverlay.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileOverlay.setAttribute('aria-hidden', 'false');
    if (menuBtnText) menuBtnText.textContent = 'Close';
    document.body.style.overflow = 'hidden';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileOverlay && mobileOverlay.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Direction-aware header: hide on scroll down, show on scroll up
  function handleNavScroll(currentY) {
    if (!header) return;
    if (mobileOverlay && mobileOverlay.classList.contains('open')) {
      header.classList.remove('nav-hidden');
      return;
    }

    if (currentY <= 60) {
      header.classList.remove('nav-hidden');
    } else if (currentY > lastScrollY && currentY > 120) {
      header.classList.add('nav-hidden');
    } else if (currentY < lastScrollY) {
      header.classList.remove('nav-hidden');
    }
    lastScrollY = currentY;
  }

  // ── 2. MOTION & SMOOTH SCROLL (LENIS + GSAP) ──
  let lenisInstance = null;

  function initMotion() {
    const hasGSAP = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
    const hasLenis = typeof Lenis !== 'undefined';

    // Fallback: If reduced motion is requested or external scripts failed to load
    if (prefersReducedMotion || !hasGSAP || !hasScrollTrigger || !hasLenis) {
      window.addEventListener('scroll', () => handleNavScroll(window.scrollY), { passive: true });
      bindAnchorLinks(null);
      setupSimpleActiveNav();
      return;
    }

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true
    });
    lenisInstance = lenis;

    // Sync Lenis scroll with ScrollTrigger
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      handleNavScroll(e.scroll || window.scrollY);
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Bind anchors
    bindAnchorLinks(lenis);

    // Run safe animations that never leave content hidden
    initHeroAnimations();
    initSectionAnimations();
    initActiveNavScrollTrigger();

    // Recalculate triggers after images and fonts load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
  }

  // ── 3. ANCHOR LINKS SCROLL HANDLER ──
  function bindAnchorLinks(lenis) {
    const allAnchors = document.querySelectorAll('a[href^="#"]');

    allAnchors.forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        closeMobileMenu();

        const navHeight = header ? header.offsetHeight : 68;

        if (lenis) {
          lenis.scrollTo(targetEl, {
            offset: -navHeight - 16,
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });
  }

  // ── 4. HERO ANIMATIONS ──
  function initHeroAnimations() {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    const heroName = document.querySelector('.hero-name');
    if (heroName) {
      heroTl.from(heroName, {
        opacity: 0,
        y: 35,
        duration: 0.9,
        delay: 0.1
      });
    }

    const heroSubline = document.querySelector('.hero-subline');
    const heroActions = document.querySelector('.hero-actions');
    if (heroSubline && heroActions) {
      heroTl.from([heroSubline, heroActions], {
        opacity: 0,
        y: 20,
        duration: 0.75,
        stagger: 0.12
      }, '-=0.5');
    }

    const heroPhoto = document.querySelector('.hero-photo');
    if (heroPhoto) {
      heroTl.from(heroPhoto, {
        opacity: 0,
        scale: 0.96,
        duration: 0.9,
        ease: 'power3.out'
      }, '-=0.7');
    }
  }

  // ── 5. SECTION HEADINGS, ROWS & HAIRLINES ──
  function initSectionAnimations() {
    // Reveal section headings smoothly without clipping
    document.querySelectorAll('.section-heading').forEach((heading) => {
      // Don't animate hero
      if (heading.closest('#hero')) return;

      gsap.from(heading, {
        opacity: 0,
        y: 25,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          once: true
        }
      });
    });

    // Hairlines draw left-to-right on scroll enter
    document.querySelectorAll('.hairline').forEach((line) => {
      gsap.from(line, {
        scaleX: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 92%',
          once: true
        }
      });
    });

    // Animate rows per section so every section (Skills, Projects, Education, Certifications, Resume, Contact) animates
    const sections = document.querySelectorAll('section');
    sections.forEach((sec) => {
      // Skip hero
      if (sec.id === 'hero') return;

      const rows = sec.querySelectorAll('.animate-row');
      if (rows && rows.length > 0) {
        gsap.from(rows, {
          opacity: 0,
          y: 20,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 82%',
            once: true
          }
        });
      }
    });
  }

  // ── 6. ACTIVE NAV HIGHLIGHT ──
  function initActiveNavScrollTrigger() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) {
            const currentId = section.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        }
      });
    });
  }

  function setupSimpleActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;
      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { passive: true });
  }

  // ── 7. BOOTSTRAP ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotion);
  } else {
    initMotion();
  }
})();
