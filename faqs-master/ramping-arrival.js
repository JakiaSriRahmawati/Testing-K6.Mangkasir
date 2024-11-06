import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL } from '../helpers/config.js';
import { Counter } from 'k6/metrics';

export const options = {
    scenarios: {
        ramping_arrival_rate_test: {
            executor: 'ramping-arrival-rate',
            preAllocatedVUs: 500,
            stages: [
                { target: 100, duration: '30s' }, 
                { target: 500, duration: '30s' },  
            ],
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

        if (jsonResponse.data && jsonResponse.data.content) {
            const content = jsonResponse.data.content;

            content.forEach(item => {
                console.log(`{"id": ${item.id}, "createdAt": ${item.createdAt}, "updatedAt": ${item.updatedAt}, "createdBy": ${item.createdBy}, "updatedBy": ${item.updatedBy}, "deleted": ${item.deleted}, "title": "${item.title}", "description": "${item.description}"}`);
            });
        } else {
            console.log('Tidak ada data yang ditemukan.');
        }
    } else {
        failedResponses.add(1);
        console.error('Failed to fetch data:', response.status);
    }

    sleep(1); 
}
