import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL } from '../helpers/config.js';
import { Counter } from 'k6/metrics';

export const options = {
  scenarios: {
    ramping_vus_test: {
      executor: 'ramping-vus',
      startVUs: 10,      
      stages: [
        { duration: '10s', target: 10 },  
        { duration: '30s', target: 50 },  
      ],
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
    name: 'dddddd',
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
