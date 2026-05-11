// ── Mobile hero slider ───────────────────────────────────────────
(function () {
	var bgImgs = document.querySelectorAll('.hero-mo-bg-img');
	var slides = document.querySelectorAll('.hero-mo-slide');
	var pgCur = document.querySelector('.hero-mo-cur');
	if (!bgImgs.length || !slides.length) return;

	var idx = 0;

	setInterval(function () {
		bgImgs[idx].classList.remove('active');
		slides[idx].classList.remove('active');
		idx = (idx + 1) % slides.length;
		bgImgs[idx].classList.add('active');
		slides[idx].classList.add('active');
		if (pgCur) pgCur.textContent = idx + 1;
	}, 4000);
})();

// ── Hero text slider ─────────────────────────────────────────────
(function () {
	const slides = [
		{ word: 'Make it Possible', desc: '케이대응로봇은 혁신적인 로봇 기술로 가능성을 현실로 만듭니다.<br />재난안전로봇의 새로운 미래를 열어가겠습니다.' },
		{ word: 'Have Passion', desc: '케이대응로봇은 도전과 혁신으로 <br />재난안전로봇 분야의 글로벌 No. 1을 향해 나아갑니다.<br />세계 시장을 선도하는 로봇 전문기업으로 성장하겠습니다.' },
		{ word: 'Challenge Limits', desc: '한계를 뛰어넘는 도전으로 불가능을 가능하게 만들고,<br />일상과 산업 현장의 더 안전한 미래를 열어갑니다.' },
	];
	const wordEl = document.getElementById('heroWord');
	const descEl = document.getElementById('heroDesc');
	const bgImgs = document.querySelectorAll('.hero-bg-img');
	const pgCur = document.getElementById('heroPgCur');
	if (!wordEl || !descEl) return;

	let idx = 0;
	const DUR = 450; // ms — matches CSS transition

	setInterval(function () {
		// 1) 현재 단어 위로 슬라이드 아웃 + 설명 페이드 아웃
		wordEl.classList.add('exit');
		descEl.classList.add('fading');

		setTimeout(function () {
			idx = (idx + 1) % slides.length;

			// 2) 새 텍스트로 교체하고 아래에 순간 배치 (transition 없이)
			wordEl.classList.remove('exit');
			wordEl.classList.add('enter-start');
			wordEl.textContent = slides[idx].word;
			descEl.innerHTML = slides[idx].desc;

			// 3) 배경 이미지 크로스페이드 + 페이지네이션
			bgImgs.forEach(function (img, i) { img.classList.toggle('active', i === idx); });
			if (pgCur) pgCur.textContent = idx + 1;

			// 4) 리플로우 후 슬라이드 인 + 설명 페이드 인
			requestAnimationFrame(function () {
				requestAnimationFrame(function () {
					wordEl.classList.remove('enter-start');
					descEl.classList.remove('fading');
				});
			});
		}, DUR);
	}, 4000);
})();

// ── Header scroll background ─────────────────────────────────────
(function () {
	const header = document.getElementById('header');
	if (!header) return;
	function update() {
		header.classList.toggle('scrolled', window.scrollY > 10);
	}
	window.addEventListener('scroll', update, { passive: true });
	update();
})();

// ── GNB dropdown hover with active state ─────────────────────────
(function () {
	const items = document.querySelectorAll('.gnb-item');
	items.forEach(item => {
		let closeTimer = null;
		item.addEventListener('mouseenter', () => {
			clearTimeout(closeTimer);
			items.forEach(other => {
				if (other !== item) other.classList.remove('is-open');
			});
			item.classList.add('is-open');
		});
		item.addEventListener('mouseleave', () => {
			closeTimer = setTimeout(() => item.classList.remove('is-open'), 150);
		});
	});
	document.addEventListener('click', e => {
		if (!e.target.closest('.gnb-item')) {
			items.forEach(item => item.classList.remove('is-open'));
		}
	});
})();

// ── Mobile hamburger ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
hamburger.addEventListener('click', () => {
	hamburger.classList.toggle('open');
	mobileNav.classList.toggle('open');
});

// ── Mobile sub-menu accordion ────────────────────────────────────
document.querySelectorAll('.m-toggle').forEach(btn => {
	btn.addEventListener('click', () => {
		const panel = btn.closest('.m-item-head').nextElementSibling;
		const isOpen = btn.classList.toggle('open');
		if (panel) panel.classList.toggle('open', isOpen);
	});
});

// ── Product Highlight v2 Sliders ─────────────────────────────────
(function () {
	function initPh2(imgsId, pgId) {
		var imgs = document.getElementById(imgsId);
		var pg = document.getElementById(pgId);
		if (!imgs || !pg) return;
		var slides = Array.from(imgs.querySelectorAll('.ph2-slide'));
		var dots = Array.from(pg.querySelectorAll('.ph2-dot'));
		var cur = 0;
		function goTo(i) {
			slides[cur].classList.remove('active');
			dots[cur].classList.remove('active');
			cur = i;
			slides[cur].classList.add('active');
			dots[cur].classList.add('active');
		}
		dots.forEach(function (d, i) {
			d.addEventListener('click', function () {
				goTo(i);
			});
		});
		setInterval(function () {
			goTo((cur + 1) % slides.length);
		}, 5000);
	}
	initPh2('ph2Imgs1', 'ph2Pg1');
	initPh2('ph2Imgs2', 'ph2Pg2');
})();

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

	// ── Touch & Mouse drag ───────────────────────────────────────
	const sliderWrap = track.closest('.product-slider-wrap') || track.parentElement;
	const THRESHOLD = 50; // px — 이 이상 드래그해야 슬라이드 전환
	let dragStartX = 0;
	let isDragging = false;

	function onDragStart(x) {
		if (animating) return;
		dragStartX = x;
		isDragging = true;
	}
	function onDragEnd(x) {
		if (!isDragging) return;
		isDragging = false;
		const diff = dragStartX - x;
		if (diff > THRESHOLD) next();
		else if (diff < -THRESHOLD) prev();
	}

	// Touch
	sliderWrap.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
	sliderWrap.addEventListener('touchend', e => onDragEnd(e.changedTouches[0].clientX), { passive: true });

	// Mouse
	sliderWrap.addEventListener('mousedown', e => {
		onDragStart(e.clientX);
		sliderWrap.style.cursor = 'grabbing';
	});
	window.addEventListener('mouseup', e => {
		onDragEnd(e.clientX);
		sliderWrap.style.cursor = '';
	});
	// 드래그 중 링크 클릭 방지
	sliderWrap.addEventListener('dragstart', e => e.preventDefault());
})();

// ── Contact form ─────────────────────────────────────────────────
document.getElementById('contactForm')?.addEventListener('submit', async function (e) {
	e.preventDefault();
	const form = e.target;

	const name    = form.querySelector('[name="name"]').value.trim();
	const org     = form.querySelector('[name="org"]').value.trim();
	const tel     = form.querySelector('[name="tel"]').value.trim();
	const email   = form.querySelector('[name="email"]').value.trim();
	const type    = form.querySelector('[name="type"]').value.trim();
	const content = form.querySelector('[name="content"]').value.trim();
	const agree   = form.querySelector('[name="agree"]').checked;

	if (!name)    { alert('이름을 입력해 주세요.');         return; }
	if (!tel)     { alert('연락처를 입력해 주세요.');       return; }
	if (!email)   { alert('이메일을 입력해 주세요.');       return; }
	if (!content) { alert('문의 내용을 입력해 주세요.');    return; }
	if (!agree)   { alert('개인정보 수집에 동의해 주세요.'); return; }

	const submitBtn = form.querySelector('.submit-btn');
	submitBtn.disabled = true;
	submitBtn.textContent = '전송 중...';

	try {
		const res = await fetch('https://formsubmit.co/ajax/krr@krrobot.co.kr', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			body: JSON.stringify({
				이름: name,
				소속: org,
				연락처: tel,
				이메일: email,
				문의유형: type,
				문의내용: content,
				_subject: `[케이대응로봇 문의] ${name} / ${type || '일반 문의'}`,
				_template: 'table',
				_captcha: 'false',
			}),
		});

		if (res.ok) {
			alert('문의가 접수되었습니다.\n빠른 시일 내에 연락드리겠습니다. 감사합니다.');
			form.reset();
		} else {
			alert('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
		}
	} catch {
		alert('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
	} finally {
		submitBtn.disabled = false;
		submitBtn.textContent = '문의하기';
	}
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
