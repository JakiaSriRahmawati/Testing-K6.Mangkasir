import { loginUser, registerUser } from '../helpers/user.js';
import { createProduct } from '../helpers/product.js';
import execution from "k6/execution";

const BASE_URL = 'https://devservice.mangkasir.com/service/v1/';

export const options = {
    scenarios: {
        userRegistration: {
            exec: "userRegistration",
        executor: "constant-vus",
            vus: 10,
            duration: "30s",
        },
        createProductExec: {
            exec: "createProductExec",
            executor: "constant-vus",
            vus: 10,
            duration: '10s',
        },
    },
};

export function userRegistration() {
    const uniqueId = execution.vu.idInInstance;
    const email = `jay-${uniqueId}-${Date.now()}@gmail.com`;
    const registrationPayload = {
        fullName: `jay-${uniqueId}`,
        email: email,
        password: 'Rahasia@123',
        retryPassword: 'Rahasia@123',
        role: 'Owner',
        storeName: 'My Store',
        image: 'string'
    };

    const response = registerUser(registrationPayload, BASE_URL + 'auth/register'); 
    
    if (response.status === 201) {
        console.log(`Registration successful for: ${email}`);
        return email;
    } else {
        console.error(`Registration failed for: ${email} - ${response.body}`);
        return null;
    }
}

export function createProductExec() {
    const uniqueId = execution.vu.idInInstance;
    const email = `jay-${uniqueId}-${Date.now()}@gmail.com`;
    const loginRequest = {
        email: email,
        password: 'Rahasia@123',
    };

    const loginResponse = loginUser(loginRequest, BASE_URL + 'auth/login'); 
    
    console.log(`Login response for ${email}:`, JSON.stringify(loginResponse, null, 2));

    if (loginResponse.status === 200) {
        const { token, storeId } = loginResponse;

        if (!storeId || !token) {
            console.error(`Store ID or token not found for: ${email}`);
            return;
        }

        const productPayload = {
            storeId: storeId,
            guid: `prod-${Date.now()}`.slice(0, 16),
            parent: 0,
            name: `Product-${uniqueId}-${Date.now()}`,
            price: Math.floor(Math.random() * 100) + 1,
            cost: 1000,
            category: 1,
            sku: "SKU123",
            barcode: "123456789",
            image: "string"
        };

        const productResponse = createProduct(productPayload, token, BASE_URL + 'products/store'); 
        
        if (productResponse.status === 201) {
            console.log(`Product created successfully: ${productPayload.name}`);
        } else {
            console.error(`Product creation failed: ${productResponse.body}`);
        }
    } else {
        console.error(`Login failed for: ${email} - ${loginResponse.body}`);
    }
}
