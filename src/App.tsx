import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import './App.css';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// 에러 폴백 컴포넌트
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className='error-boundary'>
      <h2>⚠️ Something went wrong:</h2>
      <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>🔄 Try again</button>
    </div>
  );
}

// 로딩 폴백 컴포넌트
function LoadingFallback() {
  return (
    <div className='loading-fallback'>
      <div>🔄 Loading...</div>
    </div>
  );
}

// 메인 앱 컨텐츠
function AppContent() {
  return (
    <div>
      <h1>🚀 API Fetching with TanStack Query</h1>
      <p>✅ QueryClientProvider configured</p>
      <p>✅ ErrorBoundary configured</p>
      <p>✅ Suspense configured</p>
      <p>Ready for API integration! 🎉</p>
    </div>
  );
}

// 메인 App 컴포넌트 - Tanstack Query 아키텍처 적용
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <AppContent />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
