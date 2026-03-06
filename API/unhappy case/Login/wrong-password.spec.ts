import { test, expect } from '@playwright/test';

test.describe('Login API - Wrong Password', () => {
    test('Should fail to login with wrong password', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/api/v1/auths/login`, {
            data: {
                username: process.env.API_USERNAME,
                password: 'wrongpassword',
            },
        });

        expect(response.status()).not.toBe(200);
        const body = await response.json();
        console.log('Wrong Password Response:', body);
    });
});
