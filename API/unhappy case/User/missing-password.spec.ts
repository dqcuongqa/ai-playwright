import { test, expect } from '@playwright/test';

test.describe('Create User API - Missing Password', () => {
    let token = '';

    const getUrl = (baseURL: string | undefined, path: string) => {
        return baseURL ? `${baseURL}${path}` : `https://api.example.com${path}`;
    };

    test.beforeAll(async ({ request, baseURL }) => {
        const loginResponse = await request.post(getUrl(baseURL, '/api/v1/auths/login'), {
            data: { username: process.env.API_USERNAME, password: process.env.API_PASSWORD }
        });
        expect(loginResponse.status()).toBe(200);
        const body = await loginResponse.json();
        token = body.token || body.accessToken || body?.data?.token || body?.data?.accessToken;
        expect(token).toBeDefined();
    });

    test('Should fail to create a user when password is missing', async ({ request, baseURL }) => {
        const response = await request.post(getUrl(baseURL, '/api/v1/users'), {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                username: 'testuser',
                email: 'testdata@example.com'
            },
        });

        const body = await response.json();
        console.log('Missing Password Error Response:', body);
        expect([400, 422]).toContain(response.status());
    });
});
