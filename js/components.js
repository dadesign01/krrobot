(function () {
	// ── 헤더 HTML ────────────────────────────────────────────────────
	function buildHeader(active) {
		const a = id => (active === id ? ' active' : '');
		return `<div class="header-inner">
			<a href="/" class="logo"><img src="/img/main/logo.png" alt="KRR 케이대응로봇" /></a>
			<nav class="gnb" id="gnb">
				<ul class="gnb-list">
					<li class="gnb-item${a('product')}">
						<a href="javascript:void(0);" class="gnb-link">Product</a>
						<div class="gnb-dropdown">
							<span class="gnb-drop-heading">ROBOT</span>
							<ul>
								<li><a href="/pages/product/index.html#tab1">원격 방수총</a></li>
								<li><a href="/pages/product/index.html#tab2">원격 방수 사족 보행 로봇</a></li>
								<li><a href="/pages/product/index.html#tab3">협소 공간 탐지 로봇</a></li>
								<li><a href="/pages/product/index.html#tab4">유해 가스 탐지 로봇</a></li>
								<li><a href="/pages/product/index.html#tab5">고소 방수 드론</a></li>
							</ul>
							<span class="gnb-drop-heading">부품 / SW</span>
							<ul>
								<li><a href="/pages/product/sensor.html#tab1">농연 가시화 센서</a></li>
								<li><a href="/pages/product/sensor.html#tab2">환경지도 생성 및 자율주행</a></li>
								<li><a href="/pages/product/sensor.html#tab3">소형 다중센서 통합 모듈</a></li>
								<li><a href="/pages/product/sensor.html#tab5">UWB 인명탐지 레이더 센서</a></li>
							</ul>
						</div>
					</li>
					<li class="gnb-item${a('rd')}">
						<a href="/pages/rd/future.html" class="gnb-link">R&amp;D</a>
						<div class="gnb-dropdown">
							<ul>
								<li><a href="/pages/rd/future.html">Future Technology R&amp;D</a></li>
								<li><a href="/pages/rd/cert.html">특허 및 인증</a></li>
							</ul>
						</div>
					</li>
					<li class="gnb-item${a('brand')}">
						<a href="/pages/brand/about.html" class="gnb-link">Brand</a>
						<div class="gnb-dropdown">
							<ul>
								<li><a href="/pages/brand/about.html">회사 소개</a></li>
							</ul>
						</div>
					</li>
					<li class="gnb-item${a('news')}">
						<a href="/pages/news/ir.html" class="gnb-link">News</a>
						<div class="gnb-dropdown">
							<ul>
								<li><a href="/pages/news/ir.html">IR 공시정보</a></li>
								<li><a href="/pages/news/jobs.html">채용</a></li>
								<li><a href="/pages/news/press.html">PRESS</a></li>
							</ul>
						</div>
					</li>
				</ul>
			</nav>
			<button class="hamburger" id="hamburger" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
		</div>
		<div class="mobile-nav" id="mobileNav">
			<ul>
				<li class="m-item m-has-sub">
					<div class="m-item-head">
						<a href="javascript:void(0);" class="m-item-link">Product</a>
						<button class="m-toggle" aria-label="하위 메뉴 열기">&#9660;</button>
					</div>
					<div class="m-sub-panel">
						<p class="m-sub-cat">ROBOT</p>
						<ul>
							<li><a href="/pages/product/index.html#tab1">원격 방수총</a></li>
							<li><a href="/pages/product/index.html#tab2">원격 방수 사족 보행 로봇</a></li>
							<li><a href="/pages/product/index.html#tab3">협소 공간 탐지 로봇</a></li>
							<li><a href="/pages/product/index.html#tab4">유해 가스 탐지 로봇</a></li>
							<li><a href="/pages/product/index.html#tab5">고소 방수 드론</a></li>
						</ul>
						<p class="m-sub-cat">부품 / SW</p>
						<ul>
							<li><a href="/pages/product/sensor.html#tab1">농연 가시화 센서</a></li>
							<li><a href="/pages/product/sensor.html#tab2">환경지도 생성 및 자율주행</a></li>
							<li><a href="/pages/product/sensor.html#tab3">소형 다중센서 통합 모듈</a></li>
							<li><a href="/pages/product/sensor.html#tab5">UWB 인명탐지 레이더 센서</a></li>
						</ul>
					</div>
				</li>
				<li class="m-item m-has-sub">
					<div class="m-item-head">
						<a href="/pages/rd/future.html" class="m-item-link">R&amp;D</a>
						<button class="m-toggle" aria-label="하위 메뉴 열기">&#9660;</button>
					</div>
					<div class="m-sub-panel">
						<ul>
							<li><a href="/pages/rd/future.html">Future Technology R&amp;D</a></li>
							<li><a href="/pages/rd/cert.html">특허 및 인증</a></li>
						</ul>
					</div>
				</li>
				<li class="m-item m-has-sub">
					<div class="m-item-head">
						<a href="/pages/brand/about.html" class="m-item-link">Brand</a>
						<button class="m-toggle" aria-label="하위 메뉴 열기">&#9660;</button>
					</div>
					<div class="m-sub-panel">
						<ul>
							<li><a href="/pages/brand/about.html">회사 소개</a></li>
						</ul>
					</div>
				</li>
				<li class="m-item m-has-sub">
					<div class="m-item-head">
						<a href="/pages/news/ir.html" class="m-item-link">News</a>
						<button class="m-toggle" aria-label="하위 메뉴 열기">&#9660;</button>
					</div>
					<div class="m-sub-panel">
						<ul>
							<li><a href="/pages/news/ir.html">IR 공시정보</a></li>
							<li><a href="/pages/news/jobs.html">채용</a></li>
							<li><a href="/pages/news/press.html">PRESS</a></li>
						</ul>
					</div>
				</li>
			</ul>
		</div>`;
	}

	// ── 푸터 HTML ────────────────────────────────────────────────────
	function buildFooter() {
		return `<div class="contact-footer-inner">
			<div class="footer-info">
				<a href="/" class="footer-logo"><img src="/img/main/logo.png" alt="KRR 케이대응로봇" /></a>
				<p class="footer-company-name">주식회사 케이대응로봇</p>
				<address class="footer-addr">
					<p class="addr-section-label">ADDRESS</p>
					<p><span class="addr-label">본사</span><span class="addr-val">대전 유성구 계롱로 114(봉명동), BYC유성빌딩 1007호</span></p>
					<p><span class="addr-label">포항지사</span><span class="addr-val">경상북도 포항시 남구 지곡로 394 제1벤처동 311호</span></p>
					<p><span class="addr-label">생산센터</span><span class="addr-val">대전광역시 대덕구 생산5길 29</span></p>
					<p class="addr-contact-row">
						<span class="addr-label">TEL</span> <span class="addr-val">042-713-9119</span>
						<span class="addr-divider">|</span>
						<span class="addr-label">Fax</span> <span class="addr-val">0507-1790-2675</span>
						<span class="addr-divider">|</span>
						<span class="addr-label">E-MAIL</span> <span class="addr-val">krr@krrobot.co.kr</span>
					</p>
				</address>
				<nav class="footer-policy">
					<a href="#">개인정보처리방침</a>
					<a href="#">이용약관</a>
				</nav>
			</div>
			<div class="contact-form-wrap">
				<form class="contact-form" id="contactForm" novalidate>
					<div class="form-row">
						<div class="form-field">
							<span class="field-label">이름<span class="req">*</span></span>
							<input type="text" name="name" placeholder="홍길동" required />
						</div>
						<div class="form-field">
							<span class="field-label">소속<span class="req">*</span></span>
							<input type="text" name="org" placeholder="가나다소방무역" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field">
							<span class="field-label">연락처<span class="req">*</span></span>
							<input type="tel" name="tel" placeholder="010-1234-5678" />
						</div>
						<div class="form-field">
							<span class="field-label">이메일<span class="req">*</span></span>
							<input type="email" name="email" placeholder="gildong1234@krrobot.co.kr" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field full">
							<span class="field-label">문의 유형<span class="req">*</span></span>
							<input type="text" name="type" placeholder="제품 구매 및 견적, 기술 협력, 시연 요청, 언론 홍보 등" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field full textarea-field">
							<span class="field-label">문의 내용<span class="req">*</span></span>
							<textarea name="content" placeholder="케이대응로봇에 대해 궁금하신 점을 남겨주세요."></textarea>
						</div>
					</div>
					<div class="form-row">
						<div class="form-field full">
							<span class="field-label">첨부 파일</span>
							<input type="text" name="file" placeholder="첨부 파일있으신 경우 첨부해주세요." readonly />
						</div>
					</div>
					<div class="form-privacy-row">
						<label class="privacy-check">
							<input type="checkbox" name="agree" />
							<span class="privacy-text">개인정보 수집 및 이용에 동의합니다.</span>
						</label>
						<a href="#" class="privacy-more">자세히 보기 &gt;</a>
						<button type="submit" class="submit-btn">문의하기</button>
					</div>
				</form>
			</div>
		</div>
		<div class="footer-copy"><p>Copyright 주식회사 케이대응로봇. All rights reserved.</p></div>`;
	}

	// ── Top 버튼 ─────────────────────────────────────────────────────
	function buildTopBtn() {
		return `<button id="topBtn" class="top-btn" aria-label="맨 위로">TOP</button>`;
	}

	// ── Custom Elements 등록 ─────────────────────────────────────────
	customElements.define(
		'site-header',
		class extends HTMLElement {
			connectedCallback() {
				this.className = 'header';
				this.id = 'header';
				this.setAttribute('role', 'banner');
				this.innerHTML = buildHeader(this.getAttribute('active') || '');
			}
		}
	);

	customElements.define(
		'site-footer',
		class extends HTMLElement {
			connectedCallback() {
				this.className = 'contact-footer';
				this.id = 'contact';
				this.setAttribute('role', 'contentinfo');
				this.innerHTML = buildFooter();
			}
		}
	);

	customElements.define(
		'site-top-btn',
		class extends HTMLElement {
			connectedCallback() {
				this.innerHTML = buildTopBtn();
				const btn = this.querySelector('#topBtn');
				window.addEventListener(
					'scroll',
					function () {
						btn.classList.toggle('visible', window.scrollY > 300);
					},
					{ passive: true }
				);
				btn.addEventListener('click', function () {
					window.scrollTo({ top: 0, behavior: 'smooth' });
				});
			}
		}
	);
})();
