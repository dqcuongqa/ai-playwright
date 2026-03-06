import { test, expect } from '@playwright/test';

test.describe('Login API - Empty Password', () => {
    test('Should fail to login with empty password', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/api/v1/auths/login`, {
            data: {
                username: process.env.API_USERNAME,
                password: '',
            },
        });

        expect(response.status()).not.toBe(200);
        const body = await response.json();
        console.log('Empty Password Response:', body);
    });
});
