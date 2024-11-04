import { check, sleep } from 'k6';
import { registerUser } from '../helpers/user.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';


export let options = {
    scenarios: {
        userRegistration: {
            exec: 'userRegistration',
            executor: 'constant-vus',
            vus: 50,               
            duration: '1m',  
        },
    },
    thresholds: {
        'http_req_failed': ['rate<0.10'], 
        'http_req_duration': ['p(90)<6000'], 
        'checks': ['rate>0.90'], 
    },
};

let executed = {};  

export function userRegistration() {
    const vuId = __VU; 

    if (executed[vuId]) {
        sleep(1); 
        return;
    }

    executed[vuId] = true;  
    const uniqueId = uuidv4();
    const registerRequest = {
        fullName: "string",
        email: `kasir_uuid_${uniqueId}@gmail.com`,
        password: 'noekasep@123OK!!',
        retryPassword: 'noekasep@123OK!!',
        role: "Owner",
        storeName: "string"
    };
    const res = registerUser(registerRequest);

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
