import http from 'k6/http';

export function createProduct(payload, token) {
    const url = `${BASE_URL}/products`;
    return http.post(url, JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }