import { API_BASE_URL } from '@/config';
import { getAuthToken } from '@/contexts/AuthContext';

export class ApiFetchError extends Error {
  status: number;
  statusText: string;
  body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    super(statusText || `Request failed with status ${status}`);
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export interface ApiFetchOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown;
  headers?: HeadersInit;
  includeAuth?: boolean;
  baseUrl?: string;
}

export async function apiFetch<T = unknown>(url: string, options: ApiFetchOptions = {}): Promise<T> {
  const {
    includeAuth = true,
    baseUrl = API_BASE_URL,
    headers = {},
    body,
    method,
    ...fetchInit
  } = options;

  const requestUrl = url.startsWith('http')
    ? url
    : baseUrl
      ? `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
      : url;

  const authToken = includeAuth ? getAuthToken() : null;
  const requestHeaders = new Headers(headers);

  if (includeAuth && authToken) {
    requestHeaders.set('Authorization', `Bearer ${authToken}`);
  }

  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(requestUrl, {
    ...fetchInit,
    method: method ?? (body ? 'POST' : 'GET'),
    headers: requestHeaders,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  let responseBody: unknown = null;

  if (response.status !== 204) {
    if (contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
  }

  if (!response.ok) {
    throw new ApiFetchError(response.status, response.statusText, responseBody);
  }

  return responseBody as T;
}
