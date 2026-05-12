(function () {
	var header = document.getElementById('header');
	var tabBar = document.getElementById('prodTabBar');
	var tabInner = document.querySelector('.prod-tab-inner');
	var indicator = document.querySelector('.prod-tab-indicator');
	var sections = Array.from(document.querySelectorAll('.prod-section'));
	var tabs = Array.from(document.querySelectorAll('.prod-tab'));
	var prodMain = document.querySelector('.prod-main');

	var HEADER_H = 100;
	var TAB_H = 100;
	var activeIdx = 0;
	var going = false;
	var headerHidden = false;
	var lastY = -1;

	function init() {
		HEADER_H = header.offsetHeight;
		TAB_H = tabBar.offsetHeight;
		tabBar.style.top = HEADER_H + 'px';
		prodMain.style.paddingTop = HEADER_H + TAB_H + 'px';
		var minH = window.innerHeight - HEADER_H - TAB_H;
		sections.forEach(function (s) {
			s.style.minHeight = minH + 'px';
		});
		updateIndicator(activeIdx, true);
	}

	function setActiveTab(idx) {
		tabs.forEach(function (t, i) {
			t.classList.toggle('active', i === idx);
			t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
		});
	}

	function updateIndicator(idx, instant) {
		if (!indicator || !tabs[idx]) return;
		var tabRect = tabs[idx].getBoundingClientRect();
		var innerRect = tabInner.getBoundingClientRect();
		var padding = 7;
		var x = tabRect.left - innerRect.left - padding;
		var w = tabRect.width;
		if (instant) {
			indicator.style.transition = 'none';
			indicator.style.width = w + 'px';
			indicator.style.transform = 'translateX(' + x + 'px)';
			void indicator.offsetWidth;
			indicator.style.transition = '';
		} else {
			indicator.style.width = w + 'px';
			indicator.style.transform = 'translateX(' + x + 'px)';
		}
	}

	function showHeader() {
		if (!headerHidden) return;
		header.classList.remove('scroll-hide');
		tabBar.style.top = HEADER_H + 'px';
		headerHidden = false;
	}

	function hideHeader() {
		if (headerHidden) return;
		header.classList.add('scroll-hide');
		tabBar.style.top = '0';
		headerHidden = true;
	}

	function goTo(idx) {
		if (idx < 0 || idx >= sections.length || going) return;
		going = true;
		activeIdx = idx;

		sections.forEach(function (s, i) {
			if (i === idx) {
				s.style.display = '';
				s.classList.remove('tab-enter');
				void s.offsetWidth;
				s.classList.add('tab-enter');
			} else {
				s.style.display = 'none';
				s.classList.remove('tab-enter');
			}
		});

		setActiveTab(idx);
		updateIndicator(idx, false);
		showHeader();
		window.scrollTo({ top: 0, behavior: 'instant' });
		history.replaceState(null, '', '#' + sections[idx].id);
		setTimeout(function () {
			going = false;
		}, 700);
	}

	/* 스크롤 끝 → 다음 탭 / 헤더 숨김 */
	window.addEventListener(
		'scroll',
		function () {
			var y = window.scrollY;
			if (y <= 5) {
				showHeader();
			} else if (y > lastY + 2 && y > HEADER_H) {
				hideHeader();
			} else if (y < lastY - 2) {
				showHeader();
			}
			lastY = y;

			if (going) return;
			if (y + window.innerHeight >= document.documentElement.scrollHeight - 10) {
				goTo(activeIdx + 1);
			}
		},
		{ passive: true }
	);

	/* 마우스 휠 → 이전/다음 탭 (스크롤 불가 대형 화면 포함) */
	window.addEventListener(
		'wheel',
		function (e) {
			if (going) return;
			var atTop = window.scrollY <= 0;
			var atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
			if (e.deltaY < 0 && atTop) goTo(activeIdx - 1);
			if (e.deltaY > 0 && atBottom) goTo(activeIdx + 1);
		},
		{ passive: true }
	);

	/* 터치 → 이전/다음 탭 */
	var touchStartY = 0;
	window.addEventListener(
		'touchstart',
		function (e) {
			touchStartY = e.touches[0].clientY;
		},
		{ passive: true }
	);
	window.addEventListener(
		'touchend',
		function (e) {
			if (going) return;
			var dy = e.changedTouches[0].clientY - touchStartY;
			var atTop = window.scrollY <= 0;
			var atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
			if (dy > 60 && atTop) goTo(activeIdx - 1);
			if (dy < -60 && atBottom) goTo(activeIdx + 1);
		},
		{ passive: true }
	);

	/* 탭 클릭 */
	tabs.forEach(function (tab, i) {
		tab.addEventListener('click', function () {
			goTo(i);
		});
	});

	/* 메가메뉴 같은 페이지 해시 */
	var curPage = location.pathname.split('/').pop();
	document.querySelectorAll('.gnb-dropdown a').forEach(function (link) {
		link.addEventListener('click', function (e) {
			var href = link.getAttribute('href') || '';
			var hi = href.indexOf('#');
			if (hi === -1) return;
			var pagePart = href.substring(0, hi).split('/').pop();
			var hash = href.substring(hi);
			if (!pagePart || pagePart === curPage) {
				e.preventDefault();
				var idx = -1;
				sections.forEach(function (s, i) {
					if ('#' + s.id === hash) idx = i;
				});
				if (idx >= 0) goTo(idx);
			}
		});
	});

	/* hashchange (뒤로/앞으로) */
	window.addEventListener('hashchange', function () {
		if (!location.hash) return;
		var idx = -1;
		sections.forEach(function (s, i) {
			if ('#' + s.id === location.hash) idx = i;
		});
		if (idx >= 0) goTo(idx);
	});

	window.addEventListener('resize', init);
	init();

	window.__prodGoToNext = function () {
		goTo(activeIdx + 1);
	};
	window.__prodGoToPrev = function () {
		goTo(activeIdx - 1);
	};

	/* 초기 탭 결정 */
	var initIdx = 0;
	if (location.hash) {
		sections.forEach(function (s, i) {
			if ('#' + s.id === location.hash) initIdx = i;
		});
	}
	sections.forEach(function (s, i) {
		s.style.display = i === initIdx ? '' : 'none';
	});
	activeIdx = initIdx;
	setActiveTab(initIdx);
	updateIndicator(initIdx, true);

	/* ── 모바일 드롭다운 (768px 이하) ── */
	var ddLabelEl = null;
	var ddItems = [];

	// goTo 래핑 → 드롭다운 동기화
	var _origGoTo = goTo;
	goTo = function (idx) {
		_origGoTo(idx);
		if (ddLabelEl && tabs[idx]) {
			ddLabelEl.textContent = tabs[idx].textContent.trim();
		}
		ddItems.forEach(function (li, i) {
			li.classList.toggle('active', i === idx);
		});
	};

	(function () {
		if (!tabBar || !tabs.length) return;

		var dd = document.createElement('div');
		dd.className = 'prod-tab-dropdown';

		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'prod-tab-dropdown-btn';

		ddLabelEl = document.createElement('span');
		ddLabelEl.className = 'prod-tab-dropdown-label';
		ddLabelEl.textContent = tabs[initIdx].textContent.trim();

		var arrow = document.createElement('span');
		arrow.className = 'prod-tab-dropdown-arrow';

		btn.appendChild(ddLabelEl);
		btn.appendChild(arrow);
		dd.appendChild(btn);

		var list = document.createElement('ul');
		list.className = 'prod-tab-dropdown-list';

		tabs.forEach(function (tab, i) {
			var li = document.createElement('li');
			li.className = 'prod-tab-dropdown-item' + (i === initIdx ? ' active' : '');
			li.textContent = tab.textContent.trim();
			li.addEventListener('click', function () {
				closeDD();
				goTo(i);
			});
			ddItems.push(li);
			list.appendChild(li);
		});

		dd.appendChild(list);
		tabBar.appendChild(dd);

		function openDD() { dd.classList.add('open'); }
		function closeDD() { dd.classList.remove('open'); }

		btn.addEventListener('click', function (e) {
			e.stopPropagation();
			dd.classList.contains('open') ? closeDD() : openDD();
		});
		document.addEventListener('click', closeDD);
	})();
})();
