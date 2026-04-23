const API_BASE_URL = (typeof window !== "undefined"
  ? "/proxied-backend"
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")).replace(/\/api\/?$/, "");

interface ApiOptions extends RequestInit {
  params?: Record<string, any>;
}

async function apiFetch<T = any>(endpoint: string, options?: ApiOptions): Promise<{ data: T }> {
  // Ensure endpoint starts with /
  let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Handle query parameters
  if (options?.params) {
    const query = Object.entries(options.params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    if (query) {
      path += (path.includes('?') ? '&' : '?') + query;
    }
  }

  // Construct URL and ensure no double /api/api
  let fullUrl = `${API_BASE_URL}${path}`;
  if (fullUrl.includes('/api/api/')) {
    fullUrl = fullUrl.replace('/api/api/', '/api/');
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const response = await fetch(fullUrl, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.message || errorMsg;
    } catch (e) {
      errorMsg = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMsg);
  }

  const data = await response.json();
  return { data: data as T };
}

const api = {
  get: <T = any>(endpoint: string, options?: ApiOptions) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, data: any, options?: ApiOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: <T = any>(endpoint: string, data: any, options?: ApiOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  patch: <T = any>(endpoint: string, data: any, options?: ApiOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T = any>(endpoint: string, options?: ApiOptions) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
