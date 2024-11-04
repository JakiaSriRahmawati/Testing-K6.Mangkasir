import { check, sleep } from 'k6';
import { registerUser, loginUser, getUserData } from '../helpers/user.js';

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
        'checks': ['rate>0.90'],
    },
};

export default function () {
    const timestamp = Date.now();
    const email = `lapa_${timestamp}@example.com`;
    const password = "Test@1234"; 

    const registerRes = registerUser("lapa", email, password, "Owner", "Toko botol", "");

    if (registerRes.status !== 200) {
        console.error(`Registration failed for ${email}: `, registerRes.status, registerRes.body);
    }

    check(registerRes, {
        'registration successful': (r) => r.status === 200,
    });

    if (registerRes.status === 200) {
        const loginRes = loginUser(email, password);

        if (loginRes.status !== 200) {
            console.error(`Login failed for ${email}: `, loginRes.status, loginRes.body);
        }

        check(loginRes, {
            'login successful': (r) => r.status === 200,
        });

        if (loginRes.status === 200) {
            const token = loginRes.json('data.accessToken');
            console.log(`Menggunakan token untuk ${email}: ${token}`);

            const userDataRes = getUserData(token);

            if (userDataRes.status !== 200) {
                console.error(`Get user data failed for ${email}: `, userDataRes.status, userDataRes.body);
            } else {
                console.log('User Data:', userDataRes.json());
            }

            check(userDataRes, {
                'get user data successful': (r) => r.status === 200,
            });
        }
    }

    sleep(1);
}
