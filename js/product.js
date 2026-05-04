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

	/* 스크롤 최상단에서 위로 → 이전 탭 (마우스 휠) */
	window.addEventListener(
		'wheel',
		function (e) {
			if (going) return;
			if (e.deltaY < 0 && window.scrollY <= 0) goTo(activeIdx - 1);
		},
		{ passive: true }
	);

	/* 스크롤 최상단에서 위로 → 이전 탭 (터치) */
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
			if (e.changedTouches[0].clientY - touchStartY > 60 && window.scrollY <= 0) {
				goTo(activeIdx - 1);
			}
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
})();
