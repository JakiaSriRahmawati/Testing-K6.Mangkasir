import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './config.js'; 

export function registerUser(payload) {
  const url = `${BASE_URL}/auth/register`;
  return http.post(url, JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  });
}

export function loginUser(payload) {
  const url = `${BASE_URL}/auth/login`;
  return http.post(url, JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getUserData(url, authToken) {
    console.log('Requesting user data with token:', authToken);

    const res = http.get(url, {
        headers: { 'Authorization': `Bearer ${authToken}` },
    });

    return res;

    // console.log('Get User Data Response Status:', res.status);
    // console.log('Get User Data Response Body:', res.body);

    // check(res, {
    //     'status is 200': (r) => r.status === 200,
    // });

    // try {
    //     return res.json(); 
    // } catch (e) {
    //     console.error('Error parsing user data response:', e);
    //     return {}; 
    // }
}
