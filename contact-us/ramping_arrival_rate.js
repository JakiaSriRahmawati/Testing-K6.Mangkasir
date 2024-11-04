import http from 'k6/http';
import { check, sleep } from 'k6';
import { createPayload } from '../helpers/contact_us.js';

export const options = {
  scenarios: {
    ramping_arrival_rate_test: {
      executor: 'ramping-arrival-rate',
      startRate: 100,    
      timeUnit: '30s',   
      preAllocatedVUs: 100, 
      stages: [
        { target: 500, duration: '30s' }, 
      ],
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

  const checks = check(res, {
    'status is 200': (r) => r.status === 200,
    'response has success message': (r) => {
      try {
        const responseBody = JSON.parse(r.body); 
        console.log(`Response message: "${responseBody.message}"`); 
        
        return responseBody.message && responseBody.message.trim() === 'Data terkirim';
      } catch (e) {
        console.error('Error parsing response body:', e);
        return false; 
      }
    },
  });

  if (!checks['response has success message']) {
    console.log(`Expected success message not found, full response: ${JSON.stringify(res.body, null, 2)}`);
  }

  sleep(1); 
}
