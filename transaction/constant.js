import { registerUser, loginUser } from '../helpers/user.js';
import { createProduct } from '../helpers/product.js';
import { createTransaction } from '../helpers/transaction.js';

const BASE_URL = 'https://devservice.mangkasir.com/service/v1';

export default function () {
    function randomString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const userData = {
        full_name: "User Test",
        email: "user@test.com",
        password: "Password123!",
        "retype-password": "Password123!",
        role: "customer",
        "store-name": "Test Store",
        image: "string"
    };

    const registerResponse = registerUser(userData);
    if (registerResponse && registerResponse.id) {
        console.log(`User registered with ID: ${registerResponse.id}`);
    } else {
        console.error("User registration failed");
        return;
    }

    const loginResponse = loginUser(userData.email, userData.password);
    const token = loginResponse?.token;
    const storeId = loginResponse?.storeId;

    if (!token || !storeId) {
        console.error("Login failed");
        return;
    }

    const productData = {
        storeId: storeId,
        guid: randomString(16),
        parent: null,
        name: "jambu",
        price: 10000,
        cost: 2000,
        sku: "sku-set67",
        image: "string",
        barcode: "13756476765",
        category: 1
    };

    const createProductResponse = createProduct(productData, token);
    if (createProductResponse) {
        console.log(`Product created with GUID: ${createProductResponse.guid}`);
    } else {
        console.error("Product creation failed");
        return;
    }

    const transactionData = {
        customerId: registerResponse.id,
        customer: "Customer Name",
        guid: randomString(16),
        date: "2024-07-23 13:45:11.950096",
        invoiceDiscount: 0,
        invoicePpn: 0,
        subTotal: 20000,
        storeId: storeId,
        details: [
            {
                productGuid: createProductResponse.guid,
                transactionGuid: transactionData.guid,
                productName: productData.name,
                qty: 2,
                price: productData.price,
                discount: 0,
                ppn: 0,
                totalPrice: 20000
            }
        ]
    };

    createTransaction(transactionData, token);
    console.log("Transaction created successfully");
}
