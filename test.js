import { registerUser, loginUser } from './user.js';
import { createProduct } from './product.js';
import { sleep, check } from 'k6';

export const options = {
    scenarios: {
        constant_vus_test: {
            executor: 'constant-vus',
            vus: 50,
            duration: '1m',
        },
    },
};

const REGISTRATION_PAYLOAD = {
    fullName: "Sri Rahmawati",
    email: `rahama${Math.floor(Math.random() * 10000)}@example.com`, 
    password: "Password1!",
    retryPassword: "Password1!",
    role: "owner",
    storeName: "Toko jam",
    image: "string"
};

function generateGUID() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let guid = '';
    for (let i = 0; i < 16; i++) {
        guid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return guid;
}

export default function () {
    const registerResponse = registerUser(REGISTRATION_PAYLOAD);
    console.log("Register response:", JSON.stringify(registerResponse));
    if (!registerResponse || !registerResponse.storeId) {
        console.error("Registrasi gagal atau respons kosong.");
        return; 
    }
    sleep(1);

    const token = loginUser({
        email: REGISTRATION_PAYLOAD.email,
        password: REGISTRATION_PAYLOAD.password,
    });
    console.log("Token yang diperoleh:", token);
    if (!token) {
        console.error("Login gagal atau token tidak valid.");
        return; 
    }
    sleep(1);

    const PRODUCT_PAYLOAD = {
        storeId: registerResponse.storeId,
        guid: generateGUID(),
        parent: null,
        name: "jam",
        price: 10000,
        cost: 5000,
        sku: "SKU12345",
        image: "",
        barcode: "1234567890",
        category: 1,
    };

    const createResponse = createProduct(PRODUCT_PAYLOAD, token);
    console.log("Create product response:", JSON.stringify(createResponse));
    check(createResponse, {
        'Product created successfully': (r) => r && r.status === 201,
    });
    sleep(1);
}
