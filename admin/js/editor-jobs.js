const ATTACH_PATH = 'jobs'

const quill = new Quill('#content-editor', {
	theme: 'snow',
	placeholder: '채용 내용을 입력하세요...',
	modules: {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ color: [] }, { background: [] }],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ align: [] }],
			['link', 'image'],
			['clean'],
		],
	},
})

sb.auth.getSession().then(({ data }) => {
	if (!data.session) location.href = 'login.html'
})

// ── Quill 이미지 핸들러 → Cloudinary 업로드 ──
function imageHandler() {
	const input = document.createElement('input')
	input.type = 'file'
	input.accept = 'image/*'
	input.click()
	input.onchange = async () => {
		const file = input.files[0]
		if (!file) return
		try {
			const url = await uploadToCloudinary(file, 'krrobot/jobs')
			const range = quill.getSelection(true)
			quill.insertEmbed(range.index, 'image', url)
			quill.setSelection(range.index + 1)
		} catch (e) {
			alert('이미지 업로드 실패: ' + e.message)
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	quill.getModule('toolbar').addHandler('image', imageHandler)
})

const id = new URLSearchParams(location.search).get('id')
if (id) {
	document.getElementById('page-title').textContent = '채용공고 수정'
	sb.from('jobs')
		.select('*')
		.eq('id', id)
		.single()
		.then(({ data }) => {
			if (!data) return
			document.getElementById('title').value = data.title
			document.getElementById('career').value = data.career || '경력'
			document.getElementById('employment-type').value = data.employment_type || '정규직'
			document.getElementById('department').value = data.department || ''
			quill.root.innerHTML = data.content || ''
			document.getElementById('status').value = data.status
			document.getElementById('is-published').checked = data.is_published
			if (data.start_date) document.getElementById('start-date').value = data.start_date
			if (data.end_date) document.getElementById('end-date').value = data.end_date
			calcDDay()
			setExistingAttachments(data.attachments)
		})
}

function calcDDay() {
	const endVal = document.getElementById('end-date').value
	const el = document.getElementById('d-days')
	if (!endVal) { el.textContent = '마감일을 선택하세요'; el.className = 'd-days'; return }
	const diff = Math.ceil((new Date(endVal) - new Date()) / (1000 * 60 * 60 * 24))
	if (diff < 0) { el.textContent = '마감됨'; el.className = 'd-days'; }
	else if (diff === 0) { el.textContent = 'D-Day'; el.className = 'd-days urgent'; }
	else { el.textContent = `D-${diff}`; el.className = diff <= 7 ? 'd-days urgent' : 'd-days'; }
}

async function save(publish) {
	const title = document.getElementById('title').value.trim()
	if (!title) { toast('제목을 입력해주세요'); return }

	const content = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML

	const btn = document.getElementById('btn-save')
	btn.disabled = true
	btn.textContent = '저장 중...'

	try {
		const attachList = await uploadAttachments(ATTACH_PATH)
		const payload = {
			title,
			career: document.getElementById('career').value,
			employment_type: document.getElementById('employment-type').value,
			department: document.getElementById('department').value.trim(),
			content,
			status: document.getElementById('status').value,
			is_published: publish,
			start_date: document.getElementById('start-date').value || null,
			end_date: document.getElementById('end-date').value || null,
			attachments: attachList,
		}
		const { error } = id
			? await sb.from('jobs').update(payload).eq('id', id)
			: await sb.from('jobs').insert(payload)
		if (error) throw error
		toast('저장되었습니다 ✓')
		setTimeout(() => (location.href = 'dashboard.html?board=jobs'), 1000)
	} catch (e) {
		console.error('저장 실패', e)
		toast('저장 실패: ' + (e.message || e.error_description || JSON.stringify(e)))
		btn.disabled = false
		btn.textContent = '공개 저장'
	}
}

function toast(msg) {
	const t = document.getElementById('toast')
	t.textContent = msg
	t.classList.add('show')
	setTimeout(() => t.classList.remove('show'), 2500)
}
