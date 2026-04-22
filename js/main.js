// ── Mobile hamburger ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

// ── Product Carousel ─────────────────────────────────────────────
const track = document.getElementById('carTrack');
const slides = track ? track.querySelectorAll('.car-slide') : [];
const dotsEl = document.querySelectorAll('#carDots .c-dot');
let current = 0;
const total = slides.length;
let autoTimer;

function goTo(index) {
  current = (index + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsEl.forEach((d, i) => d.classList.toggle('active', i === current));
}

function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1), 5000);
}

document.getElementById('carNext')?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
document.getElementById('carPrev')?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
dotsEl.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

startAuto();

// Touch / swipe support for carousel
let touchStartX = 0;
track?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track?.addEventListener('touchend', e => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 50) { goTo(delta > 0 ? current + 1 : current - 1); startAuto(); }
});

// ── Contact form ─────────────────────────────────────────────────
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = e.target.querySelector('[name="name"]').value.trim();
  if (!name) {
    alert('이름을 입력해 주세요.');
    return;
  }
  alert('문의가 접수되었습니다.\n빠른 시일 내에 연락드리겠습니다. 감사합니다.');
  e.target.reset();
});

// ── Scroll fade-in animation ─────────────────────────────────────
const fadeTargets = document.querySelectorAll(
  '.ph-section, .product-section, .cards-section, .contact-section'
);
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

fadeTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
  observer.observe(el);
});
