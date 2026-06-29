const BASE_URL = 'http://localhost:8081/api';

export const apiClient = {
  async get(endpoint: string) {
    return fetchWithAuth(endpoint, { method: 'GET' });
  },
  async post(endpoint: string, body: any) {
    return fetchWithAuth(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
  async put(endpoint: string, body: any) {
    return fetchWithAuth(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
  async delete(endpoint: string) {
    return fetchWithAuth(endpoint, { method: 'DELETE' });
  }
};

async function fetchWithAuth(endpoint: string, options: RequestInit) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API Error');
  }

  // Handle empty responses (like DELETE)
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}
