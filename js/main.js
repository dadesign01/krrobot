// ── Mobile hamburger ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});

// ── Product Carousel (Swiper) ─────────────────────────────────────
const dots = Array.from(document.querySelectorAll('#carDots .c-dot'));

function updateDots(realIndex) {
  dots.forEach((d, i) => d.classList.toggle('active', i === realIndex));
}

function updateActiveSlide(s) {
  document.querySelectorAll('.car-slide').forEach(el => el.classList.remove('is-active'));
  s.slides[s.activeIndex]?.classList.add('is-active');
}

const productSwiper = new Swiper('.product-swiper', {
  centeredSlides: true,
  slidesPerView: 'auto',
  spaceBetween: 48,
  loop: true,
  navigation: {
    prevEl: '#carPrev',
    nextEl: '#carNext',
    disabledClass: 'car-arrow--disabled',
  },
  on: {
    init(s)        { updateDots(s.realIndex); updateActiveSlide(s); },
    slideChange(s) { updateDots(s.realIndex); updateActiveSlide(s); },
  },
});

dots.forEach((d, i) => d.addEventListener('click', () => productSwiper.slideToLoop(i)));

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
