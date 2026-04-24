const SUPABASE_URL = 'https://qbsslymkqwdknrycmyex.supabase.co';
const SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic3NseW1rcXdka25yeWNteWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3Njk5MTEsImV4cCI6MjA5MjM0NTkxMX0.uNIVos_y5ifa2slNQv7RbAPveFf6NOdqdLTd9R9UBdU';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ────────────────────────────────────────
// Cloudinary 설정
// 1. cloudinary.com 로그인 → Dashboard에서 Cloud name 확인
// 2. Settings → Upload → Upload presets → Add upload preset
//    Signing mode: Unsigned 로 설정 후 preset name 복사
// ────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = 'drdqo1fs5'; // ← 교체
const CLOUDINARY_UPLOAD_PRESET = 'krrrobot'; // ← 교체

/**
 * Cloudinary 이미지 업로드
 * @param {File} file - 업로드할 파일
 * @param {string} folder - 저장 폴더 (예: 'krrobot/ir', 'krrobot/press')
 * @returns {string} 업로드된 이미지 URL
 */
async function uploadToCloudinary(file, folder = 'krrobot') {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
	formData.append('folder', folder);

	const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });

	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error?.message || 'Cloudinary 업로드 실패');
	}

	const data = await res.json();
	return data.secure_url;
}
