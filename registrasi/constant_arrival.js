import { check, sleep } from 'k6';
import { registerUser } from '../helpers/user.js';
import { Counter } from 'k6/metrics';


const successfulRegistrations = new Counter('successful_registrations');

export let options = {
    scenarios: {
        userRegistration: {
            exec: 'userRegistration', 
            executor: 'constant-arrival-rate', 
            rate: 10, 
            timeUnit: "1s", 
            duration: "1m", 
            preAllocatedVUs: 10, 
            maxVUs: 100, 
        },
    },
    thresholds: {
        'http_req_duration': ['p(95)<500'], 
        'successful_registrations': ['count>50'], 
    },
};

export function userRegistration() {
    const timestamp = Date.now();
    const email = `tiaraaliae_${timestamp}@example.com`; 
    const res = registerUser("Tiara uy", email, "ShhutygP@ssw0rd", "Owner", "Toko Dompet", "");

    console.log('Response Body:', res.body);

    const success = check(res, {
        'is status 200': (r) => r.status === 200,
        'registration successful': (r) => {
            const jsonResponse = JSON.parse(r.body);
            console.log('Registration Response:', jsonResponse);
            return jsonResponse.message === 'Pendaftaran Berhasil';
        },
    });

    if (success) {
        successfulRegistrations.add(1);
    }

    sleep(1); 
}
