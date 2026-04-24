const ATTACH_PATH = 'rd'

const quill = new Quill('#content-editor', {
	theme: 'snow',
	placeholder: '설명을 입력하세요...',
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
			const url = await uploadToCloudinary(file, 'krrobot/rd/inline')
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
	document.getElementById('page-title').textContent = 'R&D 기술 수정'
	sb.from('rd_posts')
		.select('*')
		.eq('id', id)
		.single()
		.then(({ data }) => {
			if (!data) return
			document.getElementById('title').value = data.title
			quill.root.innerHTML = data.description || ''
			document.getElementById('is-developing').checked = data.is_developing
			document.getElementById('is-published').checked = data.is_published
			if (data.image_url) {
				document.getElementById('image-url').value = data.image_url
				setPreview(data.image_url)
			}
			setExistingAttachments(data.attachments)
		})
}

// ── 대표 이미지 → Cloudinary ──
function onFileSelect(input) {
	const file = input.files[0]
	if (!file) return
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
	if (!title) { toast('기술 명칭을 입력해주세요'); return }

	const description = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML

	const btn = document.getElementById('btn-save')
	btn.disabled = true
	btn.textContent = '저장 중...'

	try {
		// 대표 이미지 → Cloudinary 업로드
		let imageUrl = document.getElementById('image-url').value
		const file = document.getElementById('img-file').files[0]
		if (file) {
			document.getElementById('upload-prog').style.display = 'block'
			imageUrl = await uploadToCloudinary(file, 'krrobot/rd/thumbnail')
			document.getElementById('upload-prog').style.display = 'none'
			document.getElementById('preview-img').src = imageUrl
			document.getElementById('image-url').value = imageUrl
		}

		const attachList = await uploadAttachments(ATTACH_PATH)

		const payload = {
			title,
			description,
			is_developing: document.getElementById('is-developing').checked,
			is_published: publish,
			image_url: imageUrl || null,
			attachments: attachList,
		}
		const { error } = id
			? await sb.from('rd_posts').update(payload).eq('id', id)
			: await sb.from('rd_posts').insert(payload)
		if (error) throw error
		toast('저장되었습니다 ✓')
		setTimeout(() => (location.href = 'dashboard.html?board=rd'), 1000)
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
