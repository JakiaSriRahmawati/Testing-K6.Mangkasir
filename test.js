import { registerUser, loginUser } from './helpers/user.js';
import { createProduct } from './product.js';
import { sleep, check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Counter } from 'k6/metrics';
import { randomBytes } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export let options = {
    scenarios: {
        productCreate: {
            exec: 'productCreate',
            executor: 'constant-vus',
            vus: 100,
            duration: '1m',
        }
    },
    thresholds: {
        user_registration_counter_success: ['count>90'],
        user_registration_counter_error: ['count<10'],
        // user_login_counter_success: ['count>90'],
        // user_login_counter_error: ['count<10'],
        // user_create_product_counter_success: ['count>90'],
        // user_create_product_counter_error: ['count<10'],
    }
};

const registerCounterSuccess = new Counter("user_registration_counter_success");
const registerCounterError = new Counter("user_registration_counter_error");

// const loginCounterSuccess = new Counter("user_login_counter_success");
// const loginCounterError = new Counter("user_login_counter_error");

// const productCounterSuccess = new Counter("user_create_product_counter_success");
// const productCounterError = new Counter("user_create_product_counter_error");

const uniqueId = uuidv4();


// function generateGUID() {
//     const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let guid = '';
//     for (let i = 0; i < 16; i++) {
//         guid += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return guid;
// }

export function productCreate () {
    let registerRequest = {
        fullName: "string",
        email: `product_uuid_${uniqueId}@gmail.com`,
        password: 'noekasep@123OK!!',
        retryPassword: 'noekasep@123OK!!',
        role: "Owner",
        storeName: "string"
    };

    const registerResponse = registerUser(registerRequest);
    if (registerResponse.status === 200) {
        registerCounterSuccess.add(1);
    } else {
        registerCounterError.add(1);
    }
    // sleep(1);

    // const loginResponse = loginUser({
    //     email: registerRequest.email,
    //     password: registerRequest.password,
    // });

    // let token = loginResponse.json().data.accessToken; 
    // // console.log(token)

    // if (loginResponse.status === 200) {
    //     loginCounterSuccess.add(1);
    // } else {
    //     loginCounterError.add(1);
    // }

    // sleep(1);
    // const PRODUCT_PAYLOAD = {
    //     storeId: registerResponse.storeId,
    //     guid: generateGUID(),
    //     name: "test product k6",
    //     price: 10000,
    //     cost: 5000,
    //     sku: generateGUID(),
    //     image: "",
    //     category: 1,
    // };

    // const productResponse = createProduct(PRODUCT_PAYLOAD, token);
    // console.log("Create product response:", JSON.stringify(productResponse));
    // check(createResponse, {
    //     'Product created successfully': (r) => r && r.status === 201,
    // });

    // if (productResponse.status === 201) {
    //     productCounterSuccess.add(1);
    // } else {
    //     productCounterError.add(1);
    // }

    sleep(2);
}
