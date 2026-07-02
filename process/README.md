# 제품 페이지 CMS - 사용 설명서

## 📁 파일 구성

```
cms-test/
├─ product-tab1.html       ← 거래처가 볼 페이지 (랜딩페이지)
├─ product-loader.js       ← 랜딩페이지 로더
├─ admin.html              ← 거래처가 수정할 페이지 (어드민)
└─ README.md
```

## 🚀 셋업 (이미 완료한 것)

✅ Supabase에서 SQL 실행 → 테이블 + RLS + 탭1 초기 데이터
✅ Supabase Storage에서 product-images 버킷 생성 + 정책

## 🔑 본인 정보 입력 (필수!)

다음 2개 파일에서 Supabase 정보 교체:

- `product-loader.js` 상단 4~5줄
- `admin.html` 안 `<script>` 상단 4~5줄

```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-ANON-PUBLIC-KEY';
```

Supabase 대시보드 → Settings → API에서 확인 가능.

## ▶️ 실행 방법

브라우저에서 바로 열면 `fetch`가 동작 안 함. 로컬 서버 필요.

**가장 쉬운 방법: Python**
```bash
# 파일들 있는 폴더에서
python -m http.server 8000
```

**또는 VS Code의 "Live Server" 확장**
- 파일 우클릭 → "Open with Live Server"

브라우저에서 접속:
- 랜딩페이지: `http://localhost:8000/product-tab1.html`
- 어드민: `http://localhost:8000/admin.html`

## 🧪 테스트 시나리오

1. **랜딩페이지 보기**: DB에서 받은 텍스트가 나오는지 확인
2. **어드민에서 수정**: 노란 입력칸 텍스트 변경 → [저장하기]
3. **반영 확인**: 랜딩페이지 새로고침 → 변경된 텍스트 확인
4. **표 행 추가**: 어드민에서 [+ 행 추가] → 라벨/값 입력 → 저장
5. **이미지 업로드**: [📤 변경] → 파일 선택 → 미리보기 → 저장

## ⚠️ 인증 문제 해결 (저장이 안 될 때)

저장 버튼 누르면 401 에러가 나는 경우:

**테스트용 임시 방법** (운영에서는 절대 사용 금지!):

```sql
-- Supabase SQL Editor에서 실행
-- 테이블 수정 권한을 누구나로 임시 변경
drop policy if exists "Authenticated users can manage tabs" on product_tabs;
create policy "Test allow all" on product_tabs for all using (true);

-- Storage 업로드 권한도
drop policy if exists "Auth can upload images" on storage.objects;
create policy "Test upload" on storage.objects for insert
  with check (bucket_id = 'product-images');
```

테스트 끝나면 반드시 원래대로:

```sql
drop policy if exists "Test allow all" on product_tabs;
create policy "Authenticated users can manage tabs"
  on product_tabs for all
  using (auth.role() = 'authenticated');

drop policy if exists "Test upload" on storage.objects;
create policy "Auth can upload images" on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
```

## 🐛 자주 발생하는 문제

| 증상 | 원인 | 해결 |
|------|------|------|
| 빈 화면 | Supabase 키 오류 | F12 콘솔 확인, 키 재확인 |
| 401 오류 | 인증 토큰 없음 | 위 인증 옵션 참고 |
| 이미지 미리보기 안 보임 | 상대 경로 (`../../img/...`) | 정상. 새 이미지 업로드하면 해결 |
| 디자인 깨짐 | CSS 경로 문제 | HTML link 태그 경로 확인 |

## 🎯 다음 단계 후보

- 나머지 4개 탭(사족보행~드론) 데이터 마이그레이션
- 새 탭 추가 / 순서 변경 / 게시/숨김 기능
- 이전 이미지 자동 삭제 (Storage 정리)
- 이미지 자동 압축 기능
- 정식 인증 시스템 연동
