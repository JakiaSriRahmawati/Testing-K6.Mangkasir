import http from 'k6/http';

import { BASE_URL } from '../config.js'; 

export function createProduct(payload, token) {
    const url = `${BASE_URL}/products/store`;
    const res = http.post(url, JSON.stringify(payload), {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return res;
}