import http from 'k6/http';
import { sleep } from 'k6'; 
import { BASE_URL } from '../helpers/config.js';
import { Counter } from 'k6/metrics';


export const options = {
    scenarios: {
        constant_vus_test: {
            executor: 'constant-vus',
            vus: 50,
            duration: '1m',
        },
    },
    thresholds: {
        'http_req_failed': ['rate<0.1'], 
        'http_req_duration': ['p(95)<2000'], 
    },
};
const successfulResponses = new Counter('successful_responses');
const failedResponses = new Counter('failed_responses');

export default function () {
    const params = {
        page: 1,
        size: 10,
        sort: 'desc',
        search: '', 
        deleteFilter: 'withoutDeleted',
    };

    const url = `${BASE_URL}/faqs/master?page=${params.page}&size=${params.size}&sort=${params.sort}&search=${params.search}&deleteFilter=${params.deleteFilter}`;
    
    const response = http.get(url);

    if (response.status === 200) {
        successfulResponses.add(1);
        const jsonResponse = response.json();
        console.log('FAQs Master Response:');

        if (Array.isArray(jsonResponse)) {
            jsonResponse.forEach(item => {
                console.log(`ID: ${item.id}, Title: ${item.title}, Description: ${item.description}`);
            });
        } else {
            console.log('Response tidak berupa array:', JSON.stringify(jsonResponse));
        }
    } else {
        failedResponses.add(1); 
        console.error('Failed to fetch data:', response.status);
    }

    sleep(1); 
}
