import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js'; 

export function createTransaction(transactionPayload, token) {
    const url = `${BASE_URL}/transactions`; 
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = http.post(url, JSON.stringify(transactionPayload), { headers: headers });

    check(response, {
        'Transaction created successfully': (r) => r.status === 200,
    });

    return response;
}
