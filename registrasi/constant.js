import { check, sleep } from 'k6';
import { registerUser } from '../helpers/user.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Counter } from 'k6/metrics';


export const options = {
    scenarios: {
        userRegistration: {
            exec: 'userRegistration',
            executor: 'constant-vus',
            vus: 50,               
            duration: '1m',  
        },
    },
    thresholds: {
        user_registration_counter_success: ['count>90'],
        user_registration_counter_error: ['count<10'],
    },
};

const registerCounterSuccess = new Counter("user_registration_counter_success");
const registerCounterError = new Counter("user_registration_counter_error");

export function userRegistration() {
    const uniqueId = uuidv4();
    const vuId = __VU; 
    const registerRequest = {
        fullName: "string",
        email: `vu_id${vuId}_${uniqueId}@gmail.com`,
        password: 'noekasep@123OK!!',
        retryPassword: 'noekasep@123OK!!',
        role: "Owner",
        storeName: "string"
    };
    const registerResponse = registerUser(registerRequest);
    if (registerResponse.status === 200) {
        registerCounterSuccess.add(1);
    } else {
        registerCounterError.add(1);
    }

    sleep(1);  
}
