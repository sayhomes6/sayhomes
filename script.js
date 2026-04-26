// ============ Page-load fade in ============
const showPage = () => document.body.classList.add('loaded');
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showPage);
} else {
    showPage();
}

// ============ Lenis smooth scroll (iOS-style buttery flow) ============
let lenis = null;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof Lenis !== 'undefined' && !reduceMotion) {
    lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Anchor links → Lenis smooth scroll with navbar offset
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href');
            if (id === '#' || id.length < 2) return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80, duration: 1.4 });
        });
    });
}

// ============ Navbar + scroll-to-top ============
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

const onScroll = (y) => {
    navbar.classList.toggle('scrolled', y > 40);
    scrollTopBtn.classList.toggle('visible', y > 600);
};

if (lenis) {
    lenis.on('scroll', ({ scroll }) => onScroll(scroll));
} else {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { onScroll(window.scrollY); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
}

// ============ Scroll to top ============
scrollTopBtn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ Stagger reveal items inside the same parent ============
document.querySelectorAll('.room-grid, .amenity-grid, .footer-grid').forEach(group => {
    group.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.setProperty('--reveal-i', i);
    });
});

// ============ Reveal on scroll (IntersectionObserver) — re-fires every time ============
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
