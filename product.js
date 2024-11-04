import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js'; 

export function createProduct(payload, token) {
    const url = `${BASE_URL}products/store`;
    const res = http.post(url, JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    
    check(res, {
        'create product status is 201': (r) => r.status === 201,
    });

    return res;
}
