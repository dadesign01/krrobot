/* ============================================================
 * product-loader.js
 * Supabase에서 탭 데이터 받아와 페이지에 렌더링
 * ============================================================ */

(function () {
	'use strict';

	// ⚠️ 본인의 Supabase 정보로 교체 ⚠️
	const SUPABASE_URL = 'https://qbsslymkqwdknrycmyex.supabase.co';
	const SUPABASE_ANON_KEY =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic3NseW1rcXdka25yeWNteWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njk5MTEsImV4cCI6MjA5MjM0NTkxMX0.uNIVos_y5ifa2slNQv7RbAPveFf6NOdqdLTd9R9UBdU';

	// Supabase REST 호출
	async function sb(path) {
		const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
			headers: {
				apikey: SUPABASE_ANON_KEY,
				Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
			},
		});
		if (!res.ok) throw new Error('Supabase 요청 실패: ' + res.status);
		return res.json();
	}

	// 메인 로드
	async function loadPage() {
		const main = document.querySelector('.prod-main');
		const tabInner = document.querySelector('.prod-tab-inner');

		try {
			const tabs = await sb('product_tabs?is_published=eq.true&order=display_order.asc&select=id,slug,tab_name,html_content');

			if (!tabs.length) {
				main.innerHTML = '<div class="error-msg">표시할 제품이 없습니다.</div>';
				return;
			}

			renderTabButtons(tabInner, tabs);
			renderSections(main, tabs);
			bindTabSwitching();
		} catch (err) {
			console.error('페이지 로드 실패:', err);
			main.innerHTML = '<div class="error-msg">제품 정보를 불러올 수 없습니다.<br>' + '<small>' + err.message + '</small></div>';
		}
	}

	// 탭 버튼 그리기
	function renderTabButtons(tabInner, tabs) {
		const indicator = tabInner.querySelector('.prod-tab-indicator');
		tabInner.innerHTML = '';
		if (indicator) tabInner.appendChild(indicator);

		tabs.forEach(function (tab, idx) {
			const btn = document.createElement('button');
			btn.className = 'prod-tab' + (idx === 0 ? ' active' : '');
			btn.dataset.idx = idx;
			btn.textContent = tab.tab_name;
			tabInner.appendChild(btn);
		});
	}

	// 섹션 그리기
	function renderSections(main, tabs) {
		main.innerHTML = '';
		tabs.forEach(function (tab, idx) {
			const section = document.createElement('section');
			section.className = 'prod-section' + (idx === 0 ? ' active' : '');
			section.id = 'tab' + (idx + 1);
			section.style.display = idx === 0 ? '' : 'none';
			section.innerHTML = tab.html_content;
			main.appendChild(section);
		});
	}

	// 탭 클릭 전환
	function bindTabSwitching() {
		const buttons = document.querySelectorAll('.prod-tab');
		const sections = document.querySelectorAll('.prod-section');

		buttons.forEach(function (btn) {
			btn.addEventListener('click', function () {
				const idx = parseInt(btn.dataset.idx, 10);

				buttons.forEach(function (b) {
					b.classList.remove('active');
				});
				btn.classList.add('active');

				sections.forEach(function (s, i) {
					s.style.display = i === idx ? '' : 'none';
				});
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', loadPage);
	} else {
		loadPage();
	}
})();
