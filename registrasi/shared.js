import { check, sleep } from 'k6';
import { registerUser } from '../helpers/user.js';

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
    },
};

export function userRegistration() {
    const timestamp = Date.now();
    const email = `ule_${timestamp}@example.com`; 
    const res = registerUser("Tiara anaaa", email, "ShhutygP@ssw0rd", "Owner", "Toko Dompet", "");

    console.log('Response Body:', res.body);

    check(res, {
        'is status 200': (r) => r.status === 200,
        'registration successful': (r) => {
            const jsonResponse = JSON.parse(r.body);
            console.log('Registration Response:', jsonResponse);
            return jsonResponse.message === 'Pendaftaran Berhasil';
        },
    });

    sleep(1); 
}
