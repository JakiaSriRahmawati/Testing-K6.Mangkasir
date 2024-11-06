import { sleep } from 'k6';
import { Counter } from 'k6/metrics';
import { registerUser, loginUser, getUserData } from '../helpers/user.js';
import { BASE_URL } from '../helpers/config.js';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export let options = {
    scenarios: {
        userRegistration: {
            executor: 'constant-vus',
            vus: 10,
            duration: '20s',
        },
    },
    thresholds: {
        user_registration_counter_success: ['count>200'],
        user_registration_counter_error: ['count<10'],
        user_login_counter_success: ['count>200'],
        user_login_counter_error: ['count<10'],
        get_user_data_success: ['count>90'],
        get_user_data_fail: ['count<10'],
    },
};

const registerCounterSuccess = new Counter("user_registration_counter_success");
const registerCounterError = new Counter("user_registration_counter_error");
const loginCounterSuccess = new Counter("user_login_counter_success");
const loginCounterError = new Counter("user_login_counter_error");
const getUserDataSuccess = new Counter('get_user_data_success');
const getUserDataFail = new Counter('get_user_data_fail');

export default function () {
    const uniqueId = uuidv4();
    const vuId = __VU; 
    const registerRequest = {
        fullName: "string",
        email: `vu_id_${vuId}_${uniqueId}@hotmail.com`,
        password: 'noekasep@123OK!!',
        retryPassword: 'noekasep@123OK!!',
        role: "Owner",
        storeName: "string"
    };

    const registerRes = registerUser(registerRequest);
    if (registerRes.status === 200) {
        registerCounterSuccess.add(1); 
    } else {
        registerCounterError.add(1);
        // console.error(`Registration failed for ${email}: `, registerRes.status, registerRes.body);
        // return;
    }
    sleep(1);

    const loginResponse = loginUser({
        email: registerRequest.email,
        password: registerRequest.password,
    });
    if (loginResponse.status === 200) {
        loginCounterSuccess.add(1);
    } else {
        loginCounterError.add(1);
        // console.error(`Login failed for ${email}: `, loginRes.status, loginRes.body);
        // return; 
    }

    let data = loginResponse.json().data;
    let token = data.accessToken;

    console.log(token);

    // console.log(`Menggunakan token untuk ${email}: ${token}`);

    const userDataRes = getUserData(`${BASE_URL}/me`, token);
    console.log(userDataRes)

    if (userDataRes.status === 200) {
        getUserDataSuccess.add(1);
        // console.log('User Data:', userDataRes.json());
    } else {
        getUserDataFail.add(1); 
        // console.error(`Get user data failed for ${email}: `, userDataRes.status, userDataRes.body);
    }

    sleep(1); 
}
