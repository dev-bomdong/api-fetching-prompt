# API 자동 업데이트 워크플로우

## 트리거 조건
사용자가 "api update"가 포함된 메시지를 보내면 다음 워크플로우를 자동으로 실행합니다.

## 성능 요구사항
- 모든 작업을 가능한 한 병렬로 실행하여 전체 작업 시간을 10초 이내로 완료
- 파일 읽기/검색/생성 작업은 동시에 수행
- 불필요한 중복 작업 방지

## 핵심 원칙
1. **성능 우선**: 모든 작업을 병렬로 처리
2. **기존 코드 보존**: orval 생성 코드가 아닌 경우 임의 수정 금지
3. **에러 우선 해결**: 타입/린트 에러 발생 시 다음 단계 진행 전 해결
4. **표준화**: queryKey와 훅 패턴을 일관성 있게 유지

---

## workflow

```
────────────────────────────────────────
"api update" 포함 메시지 감지 시 Rule 자동 실행
────────────────────────────────────────
                  │
                  ▼
────────────────────────────────────────
1. TanStack Query 설정 확인
────────────────────────────────────────
  ├─ App.tsx에서 필수 요소 확인
  │   ├─ QueryClientProvider (suspense: true 옵션 포함)
  │   ├─ ErrorBoundary (react-error-boundary 사용)
  │   └─ Suspense 컴포넌트
  │
  ├─ 설정 완료 → 다음 단계 진행
  └─ 설정 누락 → "TanStack Query가 설정되어 있지 않습니다.
                   설정을 진행할까요?" 질문 후 긍정적 답변 시 설정 진행
                  │
                  ▼
────────────────────────────────────────
2. Swagger 기반 클라이언트 코드 생성
────────────────────────────────────────
  ├─ `npx orval --config orval.config.ts` 실행
  ├─ TanStack Query 훅들을 src/api/queries/ 디렉토리에 생성
  ├─ 기존 src/api/fetcher.ts의 customFetcher를 HTTP 클라이언트로 사용
  │
  └─ 에러 처리 (Error-First Pattern)
      ├─ TypeScript 에러 발생 → 우선적으로 해결
      ├─ ESLint 에러 발생 → 우선적으로 해결
      └─ 해결 완료 → 다음 단계 진행
                  │
      ⚠️ 주의: orval로 생성되지 않은 기존 코드의 주석, 파라미터명, 타입, queryKey는 임의로 변경하지 않음
                  │
                  ▼
────────────────────────────────────────
3. 변경사항 분석
────────────────────────────────────────
  └─ 생성 전후 src/api/clients/와 queries/ 디렉토리 비교
      ├─ ✅ 새로 추가된 API 식별
      ├─ ♻️ 수정된 API 식별 (응답 타입 변경 등)
      ├─ ❌ 삭제된 API 식별
      └─ 생성된 훅 이름 목록 정리
                  │
                  ▼
────────────────────────────────────────
4. queryKey 파일 구성
────────────────────────────────────────
  ├─ src/api/queryKey/ 디렉토리에 도메인별 파일 생성
  │   ├─ 각 태그별로 별도 파일 (예: pet.ts, user.ts, order.ts)
  │   └─ 표준 패턴 적용:
  │       ├─ 리스트 조회: list: ['domain']
  │       ├─ 상세 조회: detail: (id) => ['domain', id]
  │       └─ 필터 조회: filter: (params) => ['domain', 'filter', params]
  │
  └─ src/api/queryKey/index.ts에서 모든 queryKey 통합 export
                  │
                  ▼
────────────────────────────────────────
5. 커스텀 훅 업데이트
────────────────────────────────────────
  └─ 생성된 훅들을 다음 패턴으로 수정
      ├─ useQuery 사용
      ├─ 앞서 생성한 queryKey 활용
      ├─ AbortSignal 지원
      └─ 예시:
          export const usePet = (id: number) => {
            return useQuery({
              queryKey: petQueryKeys.detail(id),
              queryFn: ({ signal }) => getPetById(id, signal),
            });
          };
                  │
                  ▼
────────────────────────────────────────
6. 결과 보고
────────────────────────────────────────
  └─ 변경된 파일 목록과 생성된 훅/queryKey를 마크다운 표 형식으로 요약 보고
      ├─ 변경된 파일 목록
      ├─ 생성된 훅 목록
      ├─ queryKey 목록
      └─ 작업 완료 상태 보고
```

## 🧠 워크플로우에서 활용된 프롬프팅 기법

### Chain of Thought (CoT) (전체 구조)
- 6단계 순차적 논리 프로세스로 복잡한 API 업데이트 작업을 세분화
- **참고**: [Chain-of-Thought Prompting](https://www.promptingguide.ai/kr/techniques/cot) - 단계별 추론 과정

### Few-shot Prompting (4-5단계)
- queryKey 및 훅 패턴에서 표준 예시를 제공하여 일관된 코드 생성
- **참고**: [Few-shot Prompting](https://www.promptingguide.ai/kr/techniques/fewshot)
