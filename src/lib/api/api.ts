const API_BASE_URL = (typeof window !== "undefined" 
  ? "/proxied-backend" 
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")).replace(/\/api\/?$/, "");

async function apiFetch<T = any>(endpoint: string, options?: RequestInit): Promise<{ data: T }> {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Construct URL and ensure no double /api/api
  let fullUrl = `${API_BASE_URL}${path}`;
  if (fullUrl.includes('/api/api/')) {
    fullUrl = fullUrl.replace('/api/api/', '/api/');
  }

  const response = await fetch(fullUrl, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return { data: data as T };
}

const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, data: any, options?: RequestInit) => 
    apiFetch<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: <T = any>(endpoint: string, data: any, options?: RequestInit) => 
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  patch: <T = any>(endpoint: string, data: any, options?: RequestInit) => 
    apiFetch<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T = any>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
