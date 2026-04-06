// Cursor Animation
const cursor = document.querySelector('#custom-cursor');
const blur = document.querySelector('#cursor-blur');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.x + 'px';
    cursor.style.top = e.y + 'px';
    blur.style.left = e.x - 200 + 'px';
    blur.style.top = e.y - 200 + 'px';
});

// Scroll Animations
ScrollReveal().reveal('.hero-content', { delay: 200, origin: 'bottom', distance: '50px' });
ScrollReveal().reveal('.skill-card', { interval: 100, origin: 'top', distance: '30px' });
ScrollReveal().reveal('.project-card', { delay: 300, scale: 0.8 });

// Interactive Hover Effects
const links = document.querySelectorAll('.btn, .nav-links a, .skill-card');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(3)';
        cursor.style.background = 'transparent';
        cursor.style.border = '1px solid #00f2ff';
    });
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.background = '#00f2ff';
        cursor.style.border = 'none';
    });
});

// Animate Contact Elements
ScrollReveal().reveal('.contact-form', { 
    delay: 200, 
    origin: 'left', 
    distance: '100px' 
});

ScrollReveal().reveal('.info-tile', { 
    delay: 200, 
    origin: 'right', 
    distance: '100px',
    interval: 200 
});

// Magnetic effect for social buttons (Optional Fun)
const socialBtns = document.querySelectorAll('.social-item');
socialBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const position = btn.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseout', () => {
        btn.style.transform = `translate(0px, 0px)`;
    });
});