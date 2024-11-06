import { sleep } from 'k6';
import { registerUser } from '../helpers/user.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

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
        email: `guyu_uuid_${uniqueId}@gmail.com`,
        password: 'noekasep@123OK!!',
        retryPassword: 'noekasep@123OK!!',
        role: "Owner",
        storeName: "string"
    };

    const res = registerUser(registerRequest);

    if (res.status === 200) {
        console.log('Registration successful');
    } else {
        console.error(`Registration failed with status ${res.status}`);
    }

    sleep(1);
}
