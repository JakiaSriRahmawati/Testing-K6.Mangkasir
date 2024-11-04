import http from 'k6/http';
import { check, sleep } from 'k6';

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

        if (jsonResponse.data && jsonResponse.data.content) {
            const content = jsonResponse.data.content;

            content.forEach(item => {
                console.log(`{"id": ${item.id}, "createdAt": ${item.createdAt}, "updatedAt": ${item.updatedAt}, "createdBy": ${item.createdBy}, "updatedBy": ${item.updatedBy}, "deleted": ${item.deleted}, "title": "${item.title}", "description": "${item.description}"}`);
            });
        } else {
            console.log('Tidak ada data yang ditemukan.');
        }
    } else {
        console.error('Failed to fetch data:', response.status);
    }

    sleep(1); 
}
