# OrangeHRM PIM E2E Test Automation

Playwright와 TypeScript를 활용하여 오픈소스 인사관리 시스템(OrangeHRM)의 핵심 사용자 시나리오를 검증하고, 불안정한 E2E 테스트 요소를 리팩토링한 포트폴리오 저장소입니다.

## 1. 테스트 자동화 시나리오 구조
본 프로젝트는 테스트의 독립성과 안정성을 위해 성공 시나리오, 실패 시나리오(Edge Case)를 분리하여 설계했습니다.

### Suite 1: 정상 흐름 검증
- **Step 1:** 관리자 계정 정상 로그인 및 `/dashboard` 리다이렉트 검증
- **Step 2:** PIM 메뉴 진입 후 신규 사원(`kim pi zza`) 등록 및 성공 토스트 메시지 검증
- **Step 3 (Data Cleanup):** 반복 실행 시 데이터 오염을 막기 위해, 방금 생성한 사원을 동적 타임스탬프로 조회 후 즉각 삭제 처리
- **Step 4:** 세션 안전 만료 및 복귀 검증

### Suite 2: 예외 흐름 검증 (Edge Case)
- 계정 정보 오입력 시 로그인 폼 차단 및 알럿 노출 검증
- 동일한 Employee ID로 중복 등록 시도 시 `Employee Id already exists` Validation 문구 검증

## 2. 주요 리팩토링 및 기술적 해결 과제
- **Flaky Test 방지 (동적 데이터 주입):** 사원 생성 시 중복 ID 오류로 테스트가 깨지는 것을 방지하기 위해 `Date.now()` 기반의 타임스탬프를 활용해 유니크한 데이터를 동적 주입했습니다.
- **테스트 독립성 확보 (Data Cleanup):** 테스트가 끝난 후 생성된 더미 데이터를 완전 삭제하도록 시나리오를 구성하였습니다.
- **검증 객체 최적화:** 디자인 변경에 취약한 UI 텍스트 단언을 지양하고, 시스템 리다이렉션 흐름에 따른 도메인 URL 구조를 정규식 기반으로 체킹하여 스크립트의 견고함을 높였습니다.

## 3. 시작하기 (Quick Start)

```bash
# 의존성 라이브러리 설치
npm install

# 테스트 실행
npx playwright test

# HTML 결과 리포트 확인
npx playwright show-report