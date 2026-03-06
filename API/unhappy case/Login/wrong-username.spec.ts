import { test, expect } from '@playwright/test';

test.describe('Login API - Wrong Username', () => {
    test('Should fail to login with wrong username', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/api/v1/auths/login`, {
            data: {
                username: 'wrongusername',
                password: process.env.API_PASSWORD,
            },
        });

        expect(response.status()).not.toBe(200);
        const body = await response.json();
        console.log('Wrong Username Response:', body);
    });
});
