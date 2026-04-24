const ATTACH_PATH = 'ir'

const quill = new Quill('#content-editor', {
	theme: 'snow',
	placeholder: '내용을 입력하세요...',
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
			const url = await uploadToCloudinary(file, 'krrobot/ir')
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
	document.getElementById('page-title').textContent = 'IR 공시정보 수정'
	sb.from('ir_posts')
		.select('*')
		.eq('id', id)
		.single()
		.then(({ data }) => {
			if (!data) return
			document.getElementById('title').value = data.title
			quill.root.innerHTML = data.content || ''
			document.getElementById('is-pinned').checked = data.is_pinned
			document.getElementById('is-published').checked = data.is_published
			setExistingAttachments(data.attachments)
		})
}

async function save(publish) {
	const title = document.getElementById('title').value.trim()
	const content = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML
	if (!title) { toast('제목을 입력해주세요'); return }

	const btn = document.getElementById('btn-save')
	btn.disabled = true
	btn.textContent = '저장 중...'

	try {
		const attachList = await uploadAttachments(ATTACH_PATH)
		const payload = {
			title,
			content,
			is_pinned: document.getElementById('is-pinned').checked,
			is_published: publish,
			attachments: attachList,
		}
		const { error } = id
			? await sb.from('ir_posts').update(payload).eq('id', id)
			: await sb.from('ir_posts').insert(payload)
		if (error) throw error
		toast('저장되었습니다 ✓')
		setTimeout(() => (location.href = 'dashboard.html?board=ir'), 1000)
	} catch (e) {
		toast('저장 실패: ' + e.message)
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
