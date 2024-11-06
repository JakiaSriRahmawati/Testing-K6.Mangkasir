import { sleep, Counter } from 'k6';
import { registerUser, loginUser, getUserData } from '../helpers/user.js';

const successfulRegistrations = new Counter('successful_registrations');
const failedRegistrations = new Counter('failed_registrations');
const successfulLogins = new Counter('successful_logins');
const failedLogins = new Counter('failed_logins');
const successfulUserDataFetches = new Counter('successful_user_data_fetches');
const failedUserDataFetches = new Counter('failed_user_data_fetches');

export let options = {
    scenarios: {
        userRegistration: {
            executor: 'ramping-arrival-rate',
            preAllocatedVUs: 50,
            timeUnit: '30s',
            stages: [
                { target: 100, duration: '30s' },
                { target: 500, duration: '30s' },
            ],
        },
    },
    thresholds: {
        'http_req_failed': ['rate<0.10'],
        'http_req_duration': ['p(90)<6000'],
        'successful_registrations': ['count>0'],
        'failed_registrations': ['count<10'],
        'successful_logins': ['count>0'],
        'failed_logins': ['count<10'],
        'successful_user_data_fetches': ['count>0'],
        'failed_user_data_fetches': ['count<10'],
    },
};

export default function () {
    const timestamp = Date.now();
    const email = `lapa_${timestamp}@example.com`;
    const password = "Test@1234";

    const registerRes = registerUser("lapa", email, password, "Owner", "Toko botol", "");
    if (registerRes.status === 200) {
        successfulRegistrations.add(1);
    } else {
        failedRegistrations.add(1);
        console.error(`Registration failed for ${email}: `, registerRes.status, registerRes.body);
    }

    if (registerRes.status === 200) {
        const loginRes = loginUser(email, password);
        if (loginRes.status === 200) {
            successfulLogins.add(1);
            const token = loginRes.json('data.accessToken');
            console.log(`Menggunakan token untuk ${email}: ${token}`);

            const userDataRes = getUserData(token);
            if (userDataRes.status === 200) {
                successfulUserDataFetches.add(1);
                console.log('User Data:', userDataRes.json());
            } else {
                failedUserDataFetches.add(1);
                console.error(`Get user data failed for ${email}: `, userDataRes.status, userDataRes.body);
            }
        } else {
            failedLogins.add(1);
            console.error(`Login failed for ${email}: `, loginRes.status, loginRes.body);
        }
    }

    sleep(1);
}
