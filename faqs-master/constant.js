import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        constant_vus_test: {
            executor: 'constant-vus',
            vus: 50,
            duration: '1m',
        },
    },
};

export default function () {
    const params = {
        page: 1,
        size: 10,
        sort: 'desc',
        search: '', 
        deleteFilter: 'withoutDeleted',
    };

    const url = `https://devservice.mangkasir.com/service/v1/faqs/master?page=${params.page}&size=${params.size}&sort=${params.sort}&search=${params.search}&deleteFilter=${params.deleteFilter}`;
    
    const response = http.get(url);
    
    const success = check(response, {
        'status is 200': (r) => r.status === 200,
    });

    if (success) {
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
        console.error('Failed to fetch data:', response.status);
    }

    sleep(1); 
}
