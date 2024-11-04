import http from 'k6/http';
import { check, sleep } from 'k6';
import { createPayload, checkResponse } from '../helpers/contact_us.js';

export const options = {
  scenarios: {
    shared_iterations_test: {
      executor: 'shared-iterations',
      vus: 10,
      iterations: 300,
      maxDuration: '1m',
    },
  },
};

const BASE_URL = 'https://devservice.mangkasir.com/service/v1/contact-us/store'; 

export default function () {
  const payload = createPayload(); 

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(BASE_URL, payload, params); 
  console.log(`Response body: ${res.body}`);

  const checks = check(res, checkResponse(res));

  if (!checks['response has success message']) {
    const responseBody = JSON.parse(res.body); 
    console.log(`Expected success message not found: ${responseBody.message}`);
  }

  sleep(1); 
}
