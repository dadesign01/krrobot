const ATTACH_PATH = 'press'

const quillSummary = new Quill('#summary-editor', {
	theme: 'snow',
	placeholder: '요약 내용을 입력하세요...',
	modules: {
		toolbar: [['bold', 'italic', 'underline'], ['link'], ['clean']],
	},
})

const quill = new Quill('#content-editor', {
	theme: 'snow',
	placeholder: '본문 내용을 입력하세요...',
	modules: {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			['bold', 'italic', 'underline', 'strike'],
			[{ color: [] }, { background: [] }],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ align: [] }],
			['link', 'image', 'video'],
			['clean'],
		],
	},
})

function onTypeChange(sel) {
	document.getElementById('video-card').style.display = sel.value === 'media' ? 'block' : 'none'
}

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
			const url = await uploadToCloudinary(file, 'krrobot/press/inline')
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
	document.getElementById('page-title').textContent = '보도자료 수정'
	sb.from('press_posts')
		.select('*')
		.eq('id', id)
		.single()
		.then(({ data }) => {
			if (!data) return
			document.getElementById('title').value = data.title
			quillSummary.root.innerHTML = data.summary || ''
			quill.root.innerHTML = data.content || ''
			document.getElementById('type').value = data.type
			document.getElementById('is-published').checked = data.is_published
			if (data.image_url) setPreview(data.image_url)
			if (data.video_url) document.getElementById('video-url').value = data.video_url
			onTypeChange(document.getElementById('type'))
			setExistingAttachments(data.attachments)
		})
}

// ── 대표 이미지 → Cloudinary ──
function onFileSelect(input) {
	const file = input.files[0]
	if (!file) return
	// 로컬 미리보기 먼저
	const reader = new FileReader()
	reader.onload = e => setPreview(e.target.result)
	reader.readAsDataURL(file)
}

function setPreview(url) {
	document.getElementById('preview-img').src = url
	document.getElementById('preview').style.display = 'block'
	document.getElementById('btn-remove').style.display = 'inline-block'
	if (!url.startsWith('data:')) {
		document.getElementById('image-url').value = url
	}
}

function removeImg() {
	document.getElementById('img-file').value = ''
	document.getElementById('preview').style.display = 'none'
	document.getElementById('btn-remove').style.display = 'none'
	document.getElementById('image-url').value = ''
}

async function save(publish) {
	const title = document.getElementById('title').value.trim()
	if (!title) { toast('제목을 입력해주세요'); return }

	const summary = quillSummary.root.innerHTML === '<p><br></p>' ? '' : quillSummary.root.innerHTML
	const content = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML

	const btn = document.getElementById('btn-save')
	btn.disabled = true
	btn.textContent = '저장 중...'

	try {
		// 대표 이미지 → Cloudinary 업로드
		let imageUrl = document.getElementById('image-url').value
		const file = document.getElementById('img-file').files[0]
		if (file) {
			document.getElementById('upload-prog').style.display = 'block'
			imageUrl = await uploadToCloudinary(file, 'krrobot/press/thumbnail')
			document.getElementById('upload-prog').style.display = 'none'
			// 미리보기를 실제 Cloudinary URL로 교체
			document.getElementById('preview-img').src = imageUrl
			document.getElementById('image-url').value = imageUrl
		}

		const attachList = await uploadAttachments(ATTACH_PATH)

		const payload = {
			title,
			summary,
			content,
			type: document.getElementById('type').value,
			is_published: publish,
			image_url: imageUrl || null,
			video_url: document.getElementById('video-url').value.trim() || null,
			attachments: attachList,
		}
		const { error } = id
			? await sb.from('press_posts').update(payload).eq('id', id)
			: await sb.from('press_posts').insert(payload)
		if (error) throw error
		toast('저장되었습니다 ✓')
		setTimeout(() => (location.href = 'dashboard.html?board=press'), 1000)
	} catch (e) {
		document.getElementById('upload-prog').style.display = 'none'
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
