import { test, expect } from '@playwright/test';

test.describe('Filter Models API - By Status', () => {
    let token = '';

    test.beforeAll(async ({ request, baseURL }) => {
        const loginResponse = await request.post(`${baseURL}/api/v1/auth/login`, {
            data: { 
                username: process.env.API_USERNAME, 
                password: process.env.API_PASSWORD 
            }
        });
        expect(loginResponse.status()).toBe(200);
        const body = await loginResponse.json();
        token = body.token || body.accessToken || body?.data?.token || body?.data?.accessToken;
        expect(token).toBeDefined();
    });

    test('Should filter models by status', async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/v1/models`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
                status: 'active'
            }
        });

        const body = await response.json();
        console.log('Get Models by Status Response:', JSON.stringify(body, null, 2));
        expect(response.status()).toBe(200);
    });
});
