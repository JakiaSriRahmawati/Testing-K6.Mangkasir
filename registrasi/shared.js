import { check, sleep } from 'k6';
import { registerUser } from '../helpers/user.js';
import { Counter } from 'k6/metrics';


const successfulRegistrations = new Counter('successful_registrations');

export let options = {
    scenarios: {
        userRegistration: {
            exec: 'userRegistration',
            executor: 'shared-iterations',  
            vus: 10,                        
            iterations: 300,           
            maxDuration: '1m',              
        },
    },
    thresholds: {
        'http_req_failed': ['rate<0.10'], 
        'http_req_duration': ['p(90)<6000'], 
        'checks': ['rate>0.90'], 
        'successful_registrations': ['count>50'],
    },
};

export function userRegistration() {
    const timestamp = Date.now();
    const email = `ule_${timestamp}@example.com`; 
    const res = registerUser("Tiara anaaa", email, "ShhutygP@ssw0rd", "Owner", "Toko Dompet", "");

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
