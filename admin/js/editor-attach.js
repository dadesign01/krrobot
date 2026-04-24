let attachments = []

function setExistingAttachments(list) {
	attachments = (list || []).map(a => ({ name: a.name, url: a.url }))
	renderAttachList()
}

function onAttachSelect(input) {
	Array.from(input.files).forEach(file => {
		attachments.push({ name: file.name, url: null, _file: file })
	})
	input.value = ''
	renderAttachList()
}

function removeAttach(idx) {
	attachments.splice(idx, 1)
	renderAttachList()
}

function renderAttachList() {
	const list = document.getElementById('attach-list')
	if (!attachments.length) {
		list.innerHTML = ''
		return
	}
	list.innerHTML = attachments
		.map((a, i) => {
			const name = (a.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
			const icon = attachIcon(a.name)
			const nameEl = a.url
				? `<a class="attach-link" href="${a.url}" onclick="downloadAttach(event,'${a.url.replace(/'/g,"\\'")}','${name.replace(/'/g,"\\'")}')">${icon} ${name}</a>`
				: `<span>${icon} ${name}</span>`
			return `<li class="attach-item">${nameEl}<button class="attach-remove" onclick="removeAttach(${i})"><i class="fa-solid fa-xmark"></i></button></li>`
		})
		.join('')
}

function attachIcon(name) {
	const ext = (name.split('.').pop() || '').toLowerCase()
	if (ext === 'pdf') return '<i class="fa-solid fa-file-pdf"></i>'
	if (['doc', 'docx', 'hwp', 'hwpx'].includes(ext)) return '<i class="fa-solid fa-file-lines"></i>'
	if (['xls', 'xlsx'].includes(ext)) return '<i class="fa-solid fa-file-excel"></i>'
	if (['ppt', 'pptx'].includes(ext)) return '<i class="fa-solid fa-file-powerpoint"></i>'
	if (['zip', '7z', 'rar'].includes(ext)) return '<i class="fa-solid fa-file-zipper"></i>'
	if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '<i class="fa-solid fa-file-image"></i>'
	return '<i class="fa-solid fa-paperclip"></i>'
}

async function downloadAttach(e, url, name) {
	e.preventDefault()
	try {
		const res = await fetch(url)
		const blob = await res.blob()
		const a = document.createElement('a')
		a.href = URL.createObjectURL(blob)
		a.download = name
		a.click()
		URL.revokeObjectURL(a.href)
	} catch {
		window.open(url, '_blank')
	}
}

async function uploadAttachments(boardPath) {
	const prog = document.getElementById('attach-prog')
	const newItems = attachments.filter(a => a._file)
	if (!newItems.length) return attachments.map(({ name, url }) => ({ name, url }))

	prog.style.display = 'block'
	try {
		for (const a of newItems) {
			const safeName = a.name.replace(/[^a-zA-Z0-9._-]/g, '_')
			const path = `${boardPath}/${Date.now()}-${safeName}`
			const { error } = await sb.storage.from('attachments').upload(path, a._file)
			if (error) throw error
			const { data } = sb.storage.from('attachments').getPublicUrl(path)
			a.url = data.publicUrl
			delete a._file
		}
	} finally {
		prog.style.display = 'none'
	}
	return attachments.map(({ name, url }) => ({ name, url }))
}
