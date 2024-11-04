import http from 'k6/http';
import { check } from 'k6';
import { registerUser, loginUser } from '../helpers/user.js'; 
import { createProduct } from '../helpers/product.js'; 

export default function () {
    const registrationPayload = {
        fullName: "nani",
        email: "nani@gmail.com",
        password: "Password123!",
        retryPassword: "Password123!",
        role: "Owner",
        storeName: "My Store",
        image: "string"
    };

    console.log("Payload for registration:", JSON.stringify(registrationPayload));

    const registrationRes = registerUser(registrationPayload);

    console.log("Registration Response Status:", registrationRes.status);
    console.log("Registration Response Body:", registrationRes.body);

    check(registrationRes, {
        'status is 200': (r) => r.status === 200, 
        'registration successful': (r) => r.body.includes("Pendaftaran Berhasil")
    });

    if (registrationRes.status === 200) { 
        const loginPayload = {
            email: "nani@gmail.com",
            password: "Password123!"
        };

        const loginRes = loginUser(loginPayload);
        console.log("Login Response Status:", loginRes.status);
        console.log("Login Response Body:", loginRes.body);

        check(loginRes, {
            'login successful': (r) => r.status === 200, 
            'login response has token': (r) => r.body.token !== undefined 
        });

        if (loginRes.status === 200) {
            const token = loginRes.token; 
            console.log("Token:", token);

            const meRes = http.get('https://devservice.mangkasir.com/service/v1/me', {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

            console.log("Me Response Status:", meRes.status);
            console.log("Me Response Body:", meRes.body);

            let storeId = null;
            if (meRes.status === 200) {
                const meData = JSON.parse(meRes.body);
                storeId = meData.data.storeId; 
                console.log("Store ID:", storeId);
            } else {
                console.error("Failed to retrieve storeId. Me API returned status:", meRes.status);
            }

            if (storeId) {
                const productPayload = {
                    storeId: storeId, 
                    guid: "qwertyuioplkjhgf", 
                    parent: null,
                    name: "kaca",
                    price: 10000,
                    cost: 1000, 
                    category: 1,
                    sku: "SKU123",
                    barcode: "123456789",
                    image: "string"
                };

                const productRes = createProduct(productPayload);
                console.log("Product Creation Response Status:", productRes.status);
                console.log("Product Creation Response Body:", productRes.body);

                check(productRes, {
                    'product creation successful': (r) => r.status === 201 
                });
            } else {
                console.error("Failed to retrieve storeId after login.");
            }
        } else {
            console.error("Login failed. Status:", loginRes.status);
        }
    } else {
        console.error("Registration failed. Status:", registrationRes.status);
    }
}
