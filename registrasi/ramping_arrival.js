import { check, sleep } from 'k6';
import { registerUser } from '../helpers/user.js';

export let options = {
    scenarios: {
        userRegistration: {
            executor: 'ramping-arrival-rate',
            preAllocatedVUs: 100, 
            startRate: 100, 
            timeUnit: '1s', 
            stages: [
                { target: 100, duration: '30s' }, 
                { target: 200, duration: '30s' }, 
                { target: 300, duration: '30s' }, 
                { target: 400, duration: '30s' }, 
                { target: 500, duration: '30s' },
                { target: 0, duration: '30s' }
            ],
        },
    },
    thresholds: {
        'http_req_failed': ['rate<0.10'], 
        'http_req_duration': ['p(90)<6000'], 
        'checks': ['rate>0.90'], 
    },
};

let executed = {};  

export default function defaultFunction() {
    userRegistration(); 
}

export function userRegistration() {
    const vuId = __VU; 

    if (executed[vuId]) {
        sleep(1); 
        return;
    }

    executed[vuId] = true;  

    const timestamp = Date.now();
    const email = `tiaraalina_${timestamp}@example.com`; 
    const res = registerUser("Tiara na", email, "ShhutygP@ssw0rd", "Owner", "Toko Dompet", "");

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
