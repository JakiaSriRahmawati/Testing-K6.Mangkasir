import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL } from '../helpers/config.js';
import { Counter } from 'k6/metrics';

export const options = {
  scenarios: {
    ramping_arrival_rate_test: {
      executor: 'ramping-arrival-rate',
      startRate: 100,  
      timeUnit: '1s',  
      stages: [
        { duration: '30s', target: 500 }, 
      ],
      preAllocatedVUs: 50, 
    },
  },
  thresholds: {
    user_create_contact_counter_success: ['count > 90'],  
    user_create_contact_counter_error: ['count < 10'],    
  },
};

const contactCounterSuccess = new Counter('user_create_contact_counter_success');
const contactCounterError = new Counter('user_create_contact_counter_error');

const CONTACT_US_URL = `${BASE_URL}/contact-us/store`;

export default function () {
  const payload = {
    name: 'uuu',
    businessName: 'store',
    message: 'Alat alat untuk ibadah',
    email: 'jekklq@example.com',
  };

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(CONTACT_US_URL, JSON.stringify(payload), params);

  if (res.status === 200) {
    contactCounterSuccess.add(1);  
  } else {
    contactCounterError.add(1);  
  }
  sleep(1);
}
