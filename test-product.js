import { createProduct } from './product.js';
import { check } from 'k6';

export default function () {
    const productData = {
        storeId: 2,
        guid: "dhuwhwgihswhishiw",
        parent: 0,
        name: "mejaaa",
        price: 10000,
        category: 1,
    };

    const response = createProduct(productData);
    console.log(`Create Product Response: ${response.status}, Body: ${response.body}`);

    check(response, {
        'is status 200': (r) => r.status === 200,
        'is status 400': (r) => r.status === 400,
    });

    if (response.status !== 200) {
        console.error(`Create Product Error: ${response.body}`);
    }
}
