// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Mobile nav toggle ──
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ── Typewriter ──
(function() {
  const phrases = ['Software Developer'];
  const el = document.getElementById('typewriter');
  let pi = 0, ci = 0, deleting = false, wait = 0;
  function type() {
    const phrase = phrases[pi];
    if (deleting) {
      ci--;
    } else {
      ci++;
    }
    el.innerHTML = phrase.slice(0, ci) + '<span class="cursor"></span>';
    let delay = deleting ? 60 : 90;
    if (!deleting && ci === phrase.length) { deleting = true; delay = 1600; }
    else if (deleting && ci === 0)         { deleting = false; pi = (pi + 1) % phrases.length; delay = 300; }
    setTimeout(type, delay);
  }
  setTimeout(type, 1200);
})();

// ── Particle canvas ──
(function() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.a  = Math.random() * 0.5 + 0.1;
  }
  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  init(); draw();
})();

// ── Fade-up on scroll ──
(function() {
  const els = document.querySelectorAll('.fade-up');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // stagger siblings
        const siblings = e.target.parentElement.querySelectorAll('.fade-up');
        let idx = 0;
        siblings.forEach((s, si) => { if (s === e.target) idx = si; });
        setTimeout(() => e.target.classList.add('visible'), idx * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

// ── Back to top ──
const btt = document.getElementById('back-top');
window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 400));
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));