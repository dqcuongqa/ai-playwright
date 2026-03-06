import { test, expect } from '@playwright/test';

test.describe('Login API - Empty Username', () => {
    test('Should fail to login with empty username', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/api/v1/auths/login`, {
            data: {
                username: '',
                password: process.env.API_PASSWORD,
            },
        });

        expect(response.status()).not.toBe(200);
        const body = await response.json();
        console.log('Empty Username Response:', body);
    });
});
