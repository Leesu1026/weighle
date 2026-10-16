# Weighle ⚖️

세상 모든 것의 무게를 맞히는 게임. 사진을 보고 무게를 직접 숫자로 입력해요.
[Peakle](https://github.com/Leesu1026/peakle)과 같은 시스템(데일리 챌린지, 1대1 실시간 배틀, 연습 모드, 점수·배수·체력 규칙)을 그대로 씁니다.

- 게임 주소: https://leesu1026.github.io/weighle
- 문제: 639개, 24개 카테고리, 사진은 전부 Wikimedia Commons 실사진

## 파일

| 파일 | 내용 |
|---|---|
| `index.html` | 게임 전체 (화면, 규칙, Firebase 연동) |
| `weights.js` | 문제 데이터 (이름, 무게 kg, 기준, 카테고리, 사진 경로) |
| `firebase-rules.json` | Realtime Database 보안 규칙 (Peakle과 동일) |
| `sw.js`, `manifest.json`, `icon-*.png` | 홈 화면 앱(PWA) 설정 |

## 배포

1. GitHub에서 새 저장소 `weighle`를 만들고 위 파일들을 올립니다.
2. 저장소 **Settings → Pages**에서 Branch를 `main` / `(root)`로 저장합니다.
3. Firebase 설정(아래)을 마친 뒤 `index.html`의 `firebaseConfig`를 바꿔 올립니다.

## Firebase 설정

1. [Firebase 콘솔](https://console.firebase.google.com)에서 새 프로젝트를 만듭니다.
2. **Authentication → 로그인 방법 → 익명**을 사용 설정합니다.
3. **Realtime Database**를 만들고(위치: asia-southeast1 권장), **규칙** 탭에 `firebase-rules.json` 내용을 붙여넣고 게시합니다.
4. **프로젝트 설정 → 내 앱 → 웹 앱**을 추가하고 나오는 `firebaseConfig` 값을 `index.html` 상단의 같은 이름 블록에 넣습니다.

`firebaseConfig`가 `YOUR_...` 그대로면 온라인 기능(닉네임, 전적, 대결)만 꺼지고 데일리·연습은 동작합니다.

## 규칙 요약

- 점수: `5000 × e^(-1.5r)`, r = |추측 − 실제| ÷ 실제. 오차 2% 이내 만점.
- 대결: 체력 10,000. 라운드 점수(0~5,000)가 높은 쪽이 (두 사람 점수 차이) × 자기 배수만큼 상대 체력을 깎음. 이기면 배수 +0.5. 최대 15라운드.
- 친구전 대기실: 두 사람 모두 '준비'를 누르면 시작 (빠른 매칭은 바로 시작).
- 일반전: 모든 모드의 기본. 매 문제가 전체 카테고리에서 무작위로 나옴 (카테고리 뽑힐 확률은 √문제 수에 비례).
- 선택전: 친구전에서만. 여러 카테고리를 골라 그 안에서만 출제 (합계 15문제 이상 필요). 재대결도 같은 카테고리.
- 입력: 숫자 + 단위(g/kg/t 또는 oz/lb/ton). 내부 계산은 모두 kg.

## 바꿀 수 있는 값 (`index.html`)

- `LAUNCH_UTC` — 데일리 #1이 되는 날짜 (기본 2026-10-16)
- `APP_VER` — 규칙을 바꾸면 올려서, 버전이 다른 사람끼리 매칭되지 않게 함
- `LOSE_RESET`, `MULT_STEP`, `START_HP` — 배틀 규칙

## 문제 추가

`weights.js`에 한 줄씩 추가합니다.

```
["영문명", "기준코드", 무게kg, "한글명", 카테고리번호, [["사진경로@960", 가로세로비]]]
```

- 기준코드: `AM`(수컷 성체 평균), `AF`, `AA`, `STD`, `EST`, `CW`(공차중량), `MTOW`(최대 이륙 중량), `FL`(만재 배수량), `LM`(발사 시 질량), `CB`(전투 중량), `REG`(공식 규격), `TOT`(전체 무게), `SPEC`(공식 제원) 등. 직접 쓰려면 `"~English~한국어"`.
- 사진경로: Wikimedia Commons 원본 주소에서 `/wikipedia/commons/` 뒤 부분. 원본 가로가 960px보다 크면 끝에 `@960`.
- 데이터를 바꾸면 `WEIGHTS_VERSION`을 1 올려서 다른 버전끼리 매칭되지 않게 합니다.
