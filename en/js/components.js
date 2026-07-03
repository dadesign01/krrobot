(function () {
	// ── 언어 전환 경로 계산 ───────────────────────────────────────────
	function toKo(path) {
		return path.replace(/^\/en(\/|$)/, '/');
	}
	function toEn(path) {
		if (/^\/en(\/|$)/.test(path)) return path;
		return '/en' + (path === '/' ? '/' : path);
	}
	function buildLangSwitch(current) {
		const c = id => (current === id ? ' active' : '');
		return `<div class="lang-switch">
			<a class="lang-link${c('ko')}" href="#" data-lang="ko">KO</a>
			<span class="lang-sep">|</span>
			<a class="lang-link${c('en')}" href="#" data-lang="en">EN</a>
		</div>`;
	}

	// ── 헤더 HTML ────────────────────────────────────────────────────
	function buildHeader(active) {
		const a = id => (active === id ? ' active' : '');
		return `<div class="header-inner">
			<a href="/en/" class="logo"><img src="/img/main/logo.png" alt="KRR K Response Robotics" /></a>
			<nav class="gnb" id="gnb">
				<ul class="gnb-list">
					<li class="gnb-item${a('product')}">
						<a href="javascript:void(0);" class="gnb-link">Product</a>
						<div class="gnb-dropdown">
							<span class="gnb-drop-heading">ROBOT</span>
							<ul>
								<li><a href="/en/pages/product/index.html#tab1">Remote Water Cannon / Low-Recoil Nozzle</a></li>
								<li><a href="/en/pages/product/index.html#tab2">Remote Firefighting Quadruped Robot</a></li>
								<li><a href="/en/pages/product/index.html#tab3">Confined Space Inspection Robot</a></li>
								<li><a href="/en/pages/product/index.html#tab4">Hazardous Gas Detection Robot</a></li>
								<li><a href="/en/pages/product/index.html#tab5">Aerial Firefighting Drone</a></li>
							</ul>
							<span class="gnb-drop-heading">Components / SW</span>
							<ul>
								<li><a href="/en/pages/product/sensor.html#tab1">Smoke Visualization Sensor</a></li>
								<li><a href="/en/pages/product/sensor.html#tab2">Mapping &amp; Autonomous Driving</a></li>
								<li><a href="/en/pages/product/sensor.html#tab3">Compact Multi-Sensor Module</a></li>
								<li><a href="/en/pages/product/sensor.html#tab4">UWB Human Detection Radar Sensor</a></li>
							</ul>
						</div>
					</li>
					<li class="gnb-item${a('rd')}">
						<a href="/en/pages/rd/future.html" class="gnb-link">R&amp;D</a>
						<div class="gnb-dropdown">
							<ul>
								<li><a href="/en/pages/rd/future.html">Future Technology R&amp;D</a></li>
								<li><a href="/en/pages/rd/cert.html">Patents &amp; Certifications</a></li>
							</ul>
						</div>
					</li>
					<li class="gnb-item${a('brand')}">
						<a href="/en/pages/brand/about.html" class="gnb-link">Brand</a>
						<div class="gnb-dropdown">
							<ul>
								<li><a href="/en/pages/brand/about.html">About Us</a></li>
							</ul>
						</div>
					</li>
					<li class="gnb-item${a('news')}">
						<a href="/en/pages/news/ir.html" class="gnb-link">News</a>
						<div class="gnb-dropdown">
							<ul>
								<li><a href="/en/pages/news/ir.html">IR Disclosure</a></li>
								<li><a href="/en/pages/news/jobs.html">Careers</a></li>
								<li><a href="/en/pages/news/press.html">Press</a></li>
							</ul>
						</div>
					</li>
				</ul>
			</nav>
			${buildLangSwitch('en')}
			<button class="hamburger" id="hamburger" aria-label="Open menu"><span></span><span></span><span></span></button>
		</div>
		<div class="mobile-nav" id="mobileNav">
			<ul>
				<li class="m-item m-has-sub">
					<div class="m-item-head">
						<a href="javascript:void(0);" class="m-item-link">Product</a>
						<button class="m-toggle" aria-label="Open submenu">&#9660;</button>
					</div>
					<div class="m-sub-panel">
						<p class="m-sub-cat">ROBOT</p>
						<ul>
							<li><a href="/en/pages/product/index.html#tab1">Remote Water Cannon / Low-Recoil Nozzle</a></li>
							<li><a href="/en/pages/product/index.html#tab2">Remote Firefighting Quadruped Robot</a></li>
							<li><a href="/en/pages/product/index.html#tab3">Confined Space Inspection Robot</a></li>
							<li><a href="/en/pages/product/index.html#tab4">Hazardous Gas Detection Robot</a></li>
							<li><a href="/en/pages/product/index.html#tab5">Aerial Firefighting Drone</a></li>
						</ul>
						<p class="m-sub-cat">Components / SW</p>
						<ul>
							<li><a href="/en/pages/product/sensor.html#tab1">Smoke Visualization Sensor</a></li>
							<li><a href="/en/pages/product/sensor.html#tab2">Mapping &amp; Autonomous Driving</a></li>
							<li><a href="/en/pages/product/sensor.html#tab3">Compact Multi-Sensor Module</a></li>
							<li><a href="/en/pages/product/sensor.html#tab4">UWB Human Detection Radar Sensor</a></li>
						</ul>
					</div>
				</li>
				<li class="m-item m-has-sub">
					<div class="m-item-head">
						<a href="/en/pages/rd/future.html" class="m-item-link">R&amp;D</a>
						<button class="m-toggle" aria-label="Open submenu">&#9660;</button>
					</div>
					<div class="m-sub-panel">
						<ul>
							<li><a href="/en/pages/rd/future.html">Future Technology R&amp;D</a></li>
							<li><a href="/en/pages/rd/cert.html">Patents &amp; Certifications</a></li>
						</ul>
					</div>
				</li>
				<li class="m-item m-has-sub">
					<div class="m-item-head">
						<a href="/en/pages/brand/about.html" class="m-item-link">Brand</a>
						<button class="m-toggle" aria-label="Open submenu">&#9660;</button>
					</div>
					<div class="m-sub-panel">
						<ul>
							<li><a href="/en/pages/brand/about.html">About Us</a></li>
						</ul>
					</div>
				</li>
				<li class="m-item m-has-sub">
					<div class="m-item-head">
						<a href="/en/pages/news/ir.html" class="m-item-link">News</a>
						<button class="m-toggle" aria-label="Open submenu">&#9660;</button>
					</div>
					<div class="m-sub-panel">
						<ul>
							<li><a href="/en/pages/news/ir.html">IR Disclosure</a></li>
							<li><a href="/en/pages/news/jobs.html">Careers</a></li>
							<li><a href="/en/pages/news/press.html">Press</a></li>
						</ul>
					</div>
				</li>
				<li class="m-item m-lang">${buildLangSwitch('en')}</li>
			</ul>
		</div>`;
	}

	// ── 푸터 HTML ────────────────────────────────────────────────────
	function buildFooter() {
		return `<div class="contact-footer-inner">
			<div class="footer-info">
				<a href="/en/" class="footer-logo"><img src="/img/main/logo.png" alt="KRR K Response Robotics" /></a>
				<p class="footer-company-name">K Response Robotics Co., Ltd.</p>
				<address class="footer-addr">
					<p class="addr-section-label">ADDRESS</p>
					<p><span class="addr-label">HQ</span><span class="addr-val">Rm 1007, BYC Yuseong Bldg, 114 Gyeryong-ro, Yuseong-gu, Daejeon, Korea</span></p>
					<p><span class="addr-label">Pohang Office</span><span class="addr-val">Rm 311, Venture Bldg 1, 394 Jigok-ro, Nam-gu, Pohang-si, Gyeongsangbuk-do, Korea</span></p>
					<p><span class="addr-label">Production Center</span><span class="addr-val">29 Saengsan 5-gil, Daedeok-gu, Daejeon, Korea</span></p>
					<p class="addr-contact-row">
						<span class="addr-label">TEL</span> <span class="addr-val">+82-42-713-9119</span>
						<span class="addr-divider">|</span>
						<span class="addr-label">Fax</span> <span class="addr-val">+82-507-1790-2675</span>
						<span class="addr-divider">|</span>
						<span class="addr-label">E-MAIL</span> <span class="addr-val">krr@krrobot.co.kr</span>
					</p>
				</address>
				<nav class="footer-policy">
					<a href="#">Privacy Policy</a>
					<a href="#">Terms of Use</a>
				</nav>
			</div>
			<div class="contact-form-wrap">
				<form class="contact-form" id="contactForm" novalidate>
					<div class="form-row">
						<div class="form-field">
							<span class="field-label">Name<span class="req">*</span></span>
							<input type="text" name="name" placeholder="John Doe" required />
						</div>
						<div class="form-field">
							<span class="field-label">Organization<span class="req">*</span></span>
							<input type="text" name="org" placeholder="ABC Fire Trading" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field">
							<span class="field-label">Phone<span class="req">*</span></span>
							<input type="tel" name="tel" placeholder="+82-10-1234-5678" />
						</div>
						<div class="form-field">
							<span class="field-label">Email<span class="req">*</span></span>
							<input type="email" name="email" placeholder="john1234@krrobot.co.kr" />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field full">
							<span class="field-label">Inquiry Type<span class="req">*</span></span>
							<input type="text" name="type" placeholder="Purchase & quote, technical partnership, demo request, press, etc." />
						</div>
					</div>
					<div class="form-row">
						<div class="form-field full textarea-field">
							<span class="field-label">Message<span class="req">*</span></span>
							<textarea name="content" placeholder="Let us know what you'd like to ask about K Response Robotics."></textarea>
						</div>
					</div>
					<div class="form-row">
						<div class="form-field full">
							<span class="field-label">Attachment</span>
							<input type="text" name="file" placeholder="Please attach a file if you have one." readonly />
						</div>
					</div>
					<div class="form-privacy-row">
						<label class="privacy-check">
							<input type="checkbox" name="agree" />
							<span class="privacy-text">I agree to the collection and use of my personal information.</span>
						</label>
						<a href="#" class="privacy-more">View details &gt;</a>
						<button type="submit" class="submit-btn">Submit</button>
					</div>
				</form>
			</div>
		</div>
		<div class="footer-copy"><p>Copyright K Response Robotics Co., Ltd. All rights reserved.</p></div>`;
	}

	// ── Top 버튼 ─────────────────────────────────────────────────────
	function buildTopBtn() {
		return `<button id="topBtn" class="top-btn" aria-label="Back to top">TOP</button>`;
	}

	// ── 언어 전환 클릭 바인딩 ─────────────────────────────────────────
	function wireLangSwitch(root) {
		root.querySelectorAll('.lang-link').forEach(function (link) {
			link.addEventListener('click', function (e) {
				e.preventDefault();
				const lang = link.getAttribute('data-lang');
				const p = location.pathname;
				const target = lang === 'en' ? toEn(p) : toKo(p);
				location.href = target + location.hash;
			});
		});
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
				wireLangSwitch(this);
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
