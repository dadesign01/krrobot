// 인증 확인
sb.auth.getSession().then(({ data }) => {
	if (!data.session) location.href = 'login.html';
});

// 게시판 설정
const BOARDS = {
	ir: { table: 'ir_posts', label: 'IR 공시정보', url: 'editor-ir.html' },
	press: { table: 'press_posts', label: '보도자료', url: 'editor-press.html' },
	jobs: { table: 'jobs', label: '채용공고', url: 'editor-jobs.html' },
	rd: { table: 'rd_posts', label: 'Future R&D', url: 'editor-rd.html' },
};

let curBoard = 'ir';
let curPage = 1;
let curFilter = 'all';
let searchQ = '';
let delId = null;
let searchTimer = null;
const PER_PAGE = 15;

// 카운트 로드
async function loadCounts() {
	for (const [key, cfg] of Object.entries(BOARDS)) {
		const { count } = await sb.from(cfg.table).select('*', { count: 'exact', head: true });
		document.getElementById(`cnt-${key}`).textContent = count ?? 0;
	}
}

function goHome() {
	document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
	document.getElementById('nav-home').classList.add('active');
	document.getElementById('home-panel').style.display = 'block';
	document.getElementById('board-panel').style.display = 'none';
	document.getElementById('board-title').textContent = '대시보드';
	document.getElementById('board-table').style.display = 'none';
	document.getElementById('btn-new').style.display = 'none';
	loadDashboard();
}

function goBoard(board) {
	const el = document.querySelector(`[data-board="${board}"]`);
	switchBoard(el, board);
}

function switchBoard(el, board) {
	document.getElementById('home-panel').style.display = 'none';
	document.getElementById('board-panel').style.display = 'block';
	document.getElementById('board-table').style.display = '';
	document.getElementById('btn-new').style.display = '';
	document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
	el.classList.add('active');
	curBoard = board;
	curPage = 1;
	curFilter = 'all';
	searchQ = '';
	document.getElementById('search').value = '';
	document.querySelectorAll('.tab').forEach(t => {
		t.classList.toggle('active', t.dataset.val === 'all');
	});
	// 채용 필터 토글
	document.getElementById('filter-pub').style.display = board === 'jobs' ? 'none' : '';
	document.getElementById('filter-job').style.display = board === 'jobs' ? '' : 'none';
	document.getElementById('board-title').textContent = BOARDS[board].label;
	document.getElementById('board-table').textContent = BOARDS[board].table;
	loadPosts();
}

function setFilter(el, val) {
	el.closest('.filter-tabs')
		.querySelectorAll('.tab')
		.forEach(t => t.classList.remove('active'));
	el.classList.add('active');
	curFilter = val;
	curPage = 1;
	loadPosts();
}

function onSearch() {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		searchQ = document.getElementById('search').value.trim();
		curPage = 1;
		loadPosts();
	}, 350);
}

function goNew() {
	location.href = BOARDS[curBoard].url;
}

async function loadPosts() {
	const tbody = document.getElementById('tbl-body');
	tbody.innerHTML = `<tr class="loading-row"><td colspan="6">불러오는 중...</td></tr>`;

	const cfg = BOARDS[curBoard];
	let q = sb.from(cfg.table).select('*', { count: 'exact' });

	// 필터
	if (curBoard === 'jobs') {
		if (curFilter !== 'all') q = q.eq('status', curFilter);
	} else {
		if (curFilter === 'true') q = q.eq('is_published', true);
		if (curFilter === 'false') q = q.eq('is_published', false);
	}

	// 검색
	if (searchQ) q = q.ilike('title', `%${searchQ}%`);

	// 페이지
	const from = (curPage - 1) * PER_PAGE;
	q = q.order('created_at', { ascending: false }).range(from, from + PER_PAGE - 1);

	const { data, count, error } = await q;

	if (error) {
		tbody.innerHTML = `<tr class="loading-row"><td colspan="6">오류: ${error.message}</td></tr>`;
		return;
	}

	renderHead();
	renderRows(data || []);
	renderPagination(count || 0);
}

function renderHead() {
	const thead = document.getElementById('tbl-head');
	const heads = {
		ir: ['번호', '제목', '상태', '작성일', ''],
		press: ['구분', '제목', '이미지', '상태', '작성일', ''],
		jobs: ['제목', '직무', '고용형태', '마감일', '상태', ''],
		rd: ['제목', '개발중', '상태', '등록일', ''],
	};
	thead.innerHTML = `<tr>${heads[curBoard].map(h => `<th>${h}</th>`).join('')}</tr>`;
}

function renderRows(rows) {
	const tbody = document.getElementById('tbl-body');
	if (!rows.length) {
		tbody.innerHTML = `<tr><td colspan="6"><div class="empty"><div class="empty-icon"><i class="fa-solid fa-inbox"></i></div><p>게시글이 없습니다</p></div></td></tr>`;
		return;
	}

	tbody.innerHTML = rows
		.map(r => {
			const editUrl = `${BOARDS[curBoard].url}?id=${r.id}`;
			let cells = '';

			if (curBoard === 'ir') {
				cells = `
        <td class="td-mono">${r.id}</td>
        <td class="td-title">${r.is_pinned ? '<span class="pin-badge">공지</span>' : ''}${esc(r.title)}</td>
        <td>${statusBadge(r.is_published)}</td>
        <td class="td-mono">${fmtDate(r.created_at)}</td>
      `;
			} else if (curBoard === 'press') {
				cells = `
        <td><span class="badge" style="background:rgba(100,160,255,0.1);color:#78aaff">${r.type === 'press' ? '보도자료' : '미디어'}</span></td>
        <td class="td-title">${esc(r.title)}</td>
        <td>${r.image_url ? '✓' : '—'}</td>
        <td>${statusBadge(r.is_published)}</td>
        <td class="td-mono">${fmtDate(r.created_at)}</td>
      `;
			} else if (curBoard === 'jobs') {
				const s = r.status === 'active';
				cells = `
        <td class="td-title">${esc(r.title)}</td>
        <td style="color:var(--muted2);font-size:12px">${esc(r.department || '')}</td>
        <td style="color:var(--muted2);font-size:12px">${esc(r.employment_type || '')}</td>
        <td class="td-mono">${r.end_date ? fmtDate(r.end_date) : '—'}</td>
        <td><span class="badge ${s ? 'badge-active' : 'badge-closed'}">${s ? '채용중' : '마감'}</span></td>
      `;
			} else if (curBoard === 'rd') {
				cells = `
        <td class="td-title">${esc(r.title)}</td>
        <td>${r.is_developing ? '<span class="badge" style="background:rgba(255,165,0,0.12);color:#ffaa44">개발중</span>' : '—'}</td>
        <td>${statusBadge(r.is_published)}</td>
        <td class="td-mono">${fmtDate(r.created_at)}</td>
      `;
			}

			return `
      <tr onclick="location.href='${editUrl}'">
        ${cells}
        <td>
          <div class="row-actions" onclick="event.stopPropagation()">
            <button class="btn-edit" onclick="location.href='${editUrl}'">수정</button>
            <button class="btn-del" onclick="openDel(${r.id})">삭제</button>
          </div>
        </td>
      </tr>`;
		})
		.join('');
}

function renderPagination(total) {
	const totalPages = Math.ceil(total / PER_PAGE);
	document.getElementById('pg-info').textContent = `총 ${total}개`;
	const btns = document.getElementById('pg-btns');
	if (totalPages <= 1) {
		btns.innerHTML = '';
		return;
	}
	let h = `<button class="pg-btn" onclick="goPage(${curPage - 1})" ${curPage === 1 ? 'disabled' : ''}>‹</button>`;
	for (let i = 1; i <= totalPages; i++) h += `<button class="pg-btn ${i === curPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
	h += `<button class="pg-btn" onclick="goPage(${curPage + 1})" ${curPage === totalPages ? 'disabled' : ''}>›</button>`;
	btns.innerHTML = h;
}

function goPage(p) {
	curPage = p;
	loadPosts();
}

function openDel(id) {
	delId = id;
	document.getElementById('del-modal').classList.add('show');
}
function closeModal() {
	document.getElementById('del-modal').classList.remove('show');
	delId = null;
}

async function doDelete() {
	if (!delId) return;
	await sb.from(BOARDS[curBoard].table).delete().eq('id', delId);
	closeModal();
	loadPosts();
	loadCounts();
}

async function logout() {
	await sb.auth.signOut();
	location.href = 'login.html';
}

// 유틸
function statusBadge(pub) {
	return `<span class="badge ${pub ? 'badge-on' : 'badge-off'}"><span class="dot"></span>${pub ? '공개' : '비공개'}</span>`;
}
function fmtDate(str) {
	if (!str) return '—';
	const d = new Date(str);
	return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
function esc(s) {
	return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function loadDashboard() {
	const [irRes, pressRes, jobsRes, rdRes,
		irPinRes, jobActRes, pressPRes, pressMRes, rdDevRes] = await Promise.all([
		sb.from('ir_posts').select('*', { count: 'exact', head: true }),
		sb.from('press_posts').select('*', { count: 'exact', head: true }),
		sb.from('jobs').select('*', { count: 'exact', head: true }),
		sb.from('rd_posts').select('*', { count: 'exact', head: true }),
		sb.from('ir_posts').select('*', { count: 'exact', head: true }).eq('is_pinned', true),
		sb.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
		sb.from('press_posts').select('*', { count: 'exact', head: true }).eq('type', 'press'),
		sb.from('press_posts').select('*', { count: 'exact', head: true }).eq('type', 'media'),
		sb.from('rd_posts').select('*', { count: 'exact', head: true }).eq('is_developing', true),
	]);

	document.getElementById('stat-num-ir').textContent = irRes.count ?? 0;
	document.getElementById('stat-sub-ir').textContent = `공지 ${irPinRes.count ?? 0}건`;
	document.getElementById('stat-num-press').textContent = pressRes.count ?? 0;
	document.getElementById('stat-sub-press').textContent = `보도자료 ${pressPRes.count ?? 0} · 미디어 ${pressMRes.count ?? 0}`;
	document.getElementById('stat-num-jobs').textContent = jobsRes.count ?? 0;
	document.getElementById('stat-sub-jobs').textContent = `채용중 ${jobActRes.count ?? 0}건`;
	document.getElementById('stat-num-rd').textContent = rdRes.count ?? 0;
	document.getElementById('stat-sub-rd').textContent = `개발중 ${rdDevRes.count ?? 0}건`;

	const [irP, pressP, jobsP, rdP] = await Promise.all([
		sb.from('ir_posts').select('id,title,created_at').order('created_at', { ascending: false }).limit(4),
		sb.from('press_posts').select('id,title,created_at').order('created_at', { ascending: false }).limit(4),
		sb.from('jobs').select('id,title,created_at').order('created_at', { ascending: false }).limit(4),
		sb.from('rd_posts').select('id,title,created_at').order('created_at', { ascending: false }).limit(4),
	]);

	const all = [
		...(irP.data || []).map(r => ({ ...r, label: 'IR', url: `editor-ir.html?id=${r.id}` })),
		...(pressP.data || []).map(r => ({ ...r, label: '보도자료', url: `editor-press.html?id=${r.id}` })),
		...(jobsP.data || []).map(r => ({ ...r, label: '채용', url: `editor-jobs.html?id=${r.id}` })),
		...(rdP.data || []).map(r => ({ ...r, label: 'R&D', url: `editor-rd.html?id=${r.id}` })),
	].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 12);

	const list = document.getElementById('recent-list');
	if (!all.length) {
		list.innerHTML = '<li class="recent-item" style="justify-content:center;color:var(--muted);font-size:13px">게시물이 없습니다</li>';
		return;
	}
	list.innerHTML = all.map(r => `
		<li class="recent-item" onclick="location.href='${r.url}'">
			<span class="recent-board">${r.label}</span>
			<span class="recent-title">${esc(r.title)}</span>
			<span class="recent-date">${fmtDate(r.created_at)}</span>
		</li>`).join('');
}

// 초기화
loadCounts();
const initBoard = new URLSearchParams(location.search).get('board');
if (initBoard && BOARDS[initBoard]) {
	goBoard(initBoard);
} else {
	goHome();
}
