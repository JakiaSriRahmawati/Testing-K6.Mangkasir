import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js';

export function registerUser(payload) {
    const url = `${BASE_URL}auth/register`;
    const response = http.post(url, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' },
        timeout: '30s', 
    });

    console.log("Status code register:", response.status);
    console.log("Response body register:", response.body); 

    check(response, {
        'register status is 201': (r) => r.status === 201,
    });

    return response.status === 201 ? response.json() : null; 
}


export function loginUser(payload) {
    const url = `${BASE_URL}auth/login`;
    const response = http.post(url, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/json' },
        timeout: '10s', 
    });

    check(response, {
        'login status is 200': (r) => r.status === 200,
    });

    const jsonResponse = response.json(); 
    return jsonResponse.token;
}
