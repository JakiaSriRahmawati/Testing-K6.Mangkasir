import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL } from '../helpers/config.js';
import { Counter } from 'k6/metrics';

export const options = {
  scenarios: {
    shared_iterations_test: {
      executor: 'shared-iterations',
      vus: 10,  
      iterations: 300,
      maxDuration: '1m',
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
    name: 'rtrtrt',
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
