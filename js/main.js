// ── Mobile hamburger ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('open');
	mobileNav.classList.toggle('open');
});

// ── Product Carousel (Vanilla) ───────────────────────────────────
(function () {
	const track = document.getElementById('productTrack');
	if (!track) return;

	const origSlides = Array.from(track.querySelectorAll('.product-slide'));
	const panels = Array.from(document.querySelectorAll('.product-panel'));
	const dots = Array.from(document.querySelectorAll('#carDots .c-dot'));
	const total = origSlides.length;

	// 무한루프용 앞뒤 클론
	const firstClone = origSlides[0].cloneNode(true);
	const lastClone = origSlides[total - 1].cloneNode(true);
	track.appendChild(firstClone);
	track.insertBefore(lastClone, origSlides[0]);
	// allSlides: [lastClone, s0, s1, s2, s3, s4, firstClone]
	const allSlides = Array.from(track.children);

	let trackPos = 1; // allSlides 인덱스
	let current = 0; // 실제 슬라이드 인덱스
	let animating = false;
	let peekW = 0;
	let activeW = 0;

	const MOBILE_BP = 1024;

	function calcSizes() {
		const vw = window.innerWidth;
		if (vw <= MOBILE_BP) {
			peekW = 0;
			activeW = vw;
		} else {
			peekW = Math.max(80, vw * 0.1);
			activeW = vw - peekW * 2;
		}
	}

	// 각 슬라이드를 offset 기준으로 위치/크기 설정
	function place(withTransition) {
		const tr = withTransition ? 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.7s ease' : 'none';
		const vw = window.innerWidth;
		const mobile = vw <= MOBILE_BP;

		allSlides.forEach((s, i) => {
			const offset = i - trackPos;
			s.style.transition = tr;
			s.classList.remove('active', 'slide-prev', 'slide-next');

			if (offset === 0) {
				// 활성
				s.classList.add('active');
				s.style.transform = mobile ? 'translateX(0)' : `translateX(${peekW}px)`;
				s.style.width = activeW + 'px';
			} else if (!mobile && offset === -1) {
				// 이전 peek (데스크탑만)
				s.classList.add('slide-prev');
				s.style.transform = 'translateX(0)';
				s.style.width = peekW + 'px';
			} else if (!mobile && offset === 1) {
				// 다음 peek (데스크탑만)
				s.classList.add('slide-next');
				s.style.transform = `translateX(${vw - peekW}px)`;
				s.style.width = peekW + 'px';
			} else {
				// 화면 밖
				s.style.transform = offset < 0 ? `translateX(${-(activeW + 60)}px)` : `translateX(${vw + 60}px)`;
				s.style.width = Math.max(peekW, 60) + 'px';
			}
		});

		panels.forEach((p, i) => p.classList.toggle('active', i === current));
		dots.forEach((d, i) => d.classList.toggle('active', i === current));
	}

	function move(newPos, newCurrent) {
		if (animating) return;
		animating = true;
		trackPos = newPos;
		current = newCurrent;
		place(true);

		// 애니메이션 종료 후 클론→실제 슬라이드 순간이동
		setTimeout(() => {
			animating = false;
			if (trackPos === 0) {
				trackPos = total;
				place(false);
			} else if (trackPos === total + 1) {
				trackPos = 1;
				place(false);
			}
		}, 1050);
	}

	function prev() {
		move(trackPos - 1, (current - 1 + total) % total);
	}
	function next() {
		move(trackPos + 1, (current + 1) % total);
	}
	function goTo(i) {
		move(i + 1, i);
	}

	calcSizes();
	place(false);

	document.getElementById('carPrev').addEventListener('click', prev);
	document.getElementById('carNext').addEventListener('click', next);
	dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
	window.addEventListener('resize', () => {
		calcSizes();
		place(false);
	});
})();

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
const fadeTargets = document.querySelectorAll('.ph-section, .product-section, .contact-footer');
const observer = new IntersectionObserver(
	entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
				observer.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.08 }
);

fadeTargets.forEach(el => {
	el.style.opacity = '0';
	el.style.transform = 'translateY(28px)';
	el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
	observer.observe(el);
});

// ── Cards stagger animation (repeats on scroll in/out) ───────────
const cardsGrid = document.querySelector('.cards-grid');
if (cardsGrid) {
	const cardsSection = document.querySelector('.cards-section');
	const cardsObserver = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					cardsGrid.classList.add('animated');
				} else {
					cardsGrid.classList.remove('animated');
				}
			});
		},
		{ threshold: 0.15 }
	);
	cardsObserver.observe(cardsSection || cardsGrid);
}
