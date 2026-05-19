# GitHub Pages에 올리는 단계

교실 자리배치 웹앱을 GitHub Pages에 올리면, 카카오톡으로 링크를 공유했을 때 **다른 사람 휴대폰에서도** 같은 화면을 볼 수 있습니다.

> `http://localhost:8765` 는 **본인 컴퓨터에서만** 보입니다. GitHub Pages 주소는 **인터넷 어디서나** 접속 가능합니다.

배포 후 주소 예시:

`https://[GitHub아이디].github.io/classroom-seating/`

---

## 1. GitHub에서 저장소 만들기

1. [https://github.com](https://github.com) 로그인
2. 우측 상단 **+** → **New repository**
3. 저장소 이름 입력 (예: `classroom-seating`)
4. **Public** 선택 (무료 Pages는 Public이 간단함)
5. **Create repository** 클릭

---

## 2. Mac에서 Git 초기화 및 업로드

터미널을 열고 프로젝트 폴더로 이동합니다.

```bash
cd "/Volumes/Exe, Todo(md,book,app)_2T mac/_location"
```

### Git 초기화 (최초 1회)

```bash
git init
```

### 웹에 필요한 파일만 추가

```bash
git add index.html css/ js/ assets/ manifest.webmanifest sw.js .gitignore
git status
```

`node_modules/`, `android/`, `release/` 등은 `.gitignore`에 의해 제외됩니다.

### 첫 커밋

```bash
git commit -m "교실 자리배치 웹앱 GitHub Pages 배포"
```

### GitHub 저장소 연결 및 업로드

`[GitHub아이디]`와 `classroom-seating`을 본인 정보에 맞게 바꿉니다.

```bash
git branch -M main
git remote add origin https://github.com/[GitHub아이디]/classroom-seating.git
git push -u origin main
```

이미 `origin`이 있다면:

```bash
git remote set-url origin https://github.com/[GitHub아이디]/classroom-seating.git
git push -u origin main
```

---

## 3. GitHub Pages 활성화

1. GitHub에서 해당 **저장소** 페이지로 이동
2. 상단 **Settings** → 왼쪽 메뉴 **Pages**
3. **Build and deployment** 설정
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. **Save** 클릭

1~3분 후 같은 화면 상단에 사이트 주소가 표시됩니다.

---

## 4. 카카오톡에 공유할 주소

아래 중 하나를 공유하면 됩니다.

- `https://[GitHub아이디].github.io/classroom-seating/`
- `https://[GitHub아이디].github.io/classroom-seating/index.html`

| 항목 | 설명 |
|------|------|
| HTTPS | 휴대폰에서도 안전하게 접속 |
| PC 불필요 | 내 Mac을 켜 둘 필요 없음 |
| 공유 | 카카오톡·문자 등으로 링크 전달 가능 |

---

## 5. 수정 후 다시 반영하기

명단·자리를 수정한 뒤:

```bash
cd "/Volumes/Exe, Todo(md,book,app)_2T mac/_location"
git add index.html css/ js/ assets/ manifest.webmanifest sw.js
git commit -m "명단 수정"
git push
```

몇 분 후 GitHub Pages에 반영됩니다. 예전 화면이 보이면 브라우저 **새로고침** 또는 **시크릿 모드**로 확인하세요.

---

## 6. 자주 하는 실수

| 문제 | 해결 |
|------|------|
| 404 Not Found | Pages 설정: Branch `main`, Folder `(root)` 인지 확인 |
| CSS/JS가 안 불러짐 | `index.html`과 같은 루트에 `css/`, `js/` 폴더가 있는지 확인 |
| 옛 화면이 보임 | 강력 새로고침 (Mac: Cmd+Shift+R) |
| 용량이 너무 큼 | `git add .` 대신 웹 파일만 `git add` (위 2단계 참고) |

---

## 7. (선택) 전체 프로젝트를 한 저장소에 올리기

Electron·Android 빌드 파일까지 함께 관리하려면:

```bash
git add .
git commit -m "전체 프로젝트"
git push
```

`.gitignore`가 `node_modules/`, `android/`, `release/` 등을 제외합니다.  
GitHub Pages는 **루트의 `index.html`** 만 사용하므로 웹앱은 그대로 동작합니다.

---

## 8. 다른 배포 방법 (참고)

| 방법 | 카톡 링크로 다른 사람이 보기 |
|------|---------------------------|
| `localhost` | 불가 |
| 같은 Wi-Fi + `192.168.x.x:8765` | 가능 (Mac 켜져 있을 때만) |
| **GitHub Pages** | 가능 (권장) |
| Android APK 파일 | 가능 (앱 설치) |

APK 파일 위치: `release/교실-자리배치-1.0.0-debug.apk`

---

## 요약 체크리스트

- [ ] GitHub 저장소 생성 (Public)
- [ ] `git init` → 웹 파일 `git add` → `commit` → `push`
- [ ] Settings → Pages → `main` / `(root)` 저장
- [ ] 배포 URL 확인 후 카카오톡 공유
