// src/api/fetcher.ts
import axios, { type AxiosRequestConfig, type Method } from 'axios';

// HTTP 메서드 타입 정의
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

// customFetcher 설정 타입
export interface FetcherConfig {
  url: string;
  method: HttpMethod;
  data?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | string[] | undefined>;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

// 심플한 axios 인스턴스 (기본 설정만)
const axiosInstance = axios.create({
  timeout: 30000, // 30초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 순수한 HTTP 클라이언트 - 에러 처리는 React ErrorBoundary에서 담당
export const customFetcher = async <TData>(config: FetcherConfig): Promise<TData> => {
  const axiosConfig: AxiosRequestConfig = {
    url: config.url,
    method: config.method as Method,
    data: config.data,
    signal: config.signal,
    headers: config.headers,
    params: config.params,
    timeout: config.timeout,
    responseType: config.responseType || 'json',
  };

  const response = await axiosInstance.request<TData>(axiosConfig);
  return response.data;
};
