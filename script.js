// ============ Page-load fade in ============
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ============ Navbar + scroll-to-top (rAF-throttled for smoothness) ============
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

let scrollTicking = false;
function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    scrollTopBtn.classList.toggle('visible', y > 600);
    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(onScroll);
        scrollTicking = true;
    }
}, { passive: true });

// ============ Scroll to top ============
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ Stagger reveal items inside the same parent ============
document.querySelectorAll('.room-grid, .amenity-grid, .footer-grid').forEach(group => {
    group.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.setProperty('--reveal-i', i);
    });
});

// ============ Reveal on scroll (IntersectionObserver) ============
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
