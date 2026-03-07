import { test, expect } from '@playwright/test';

test.describe('Get All Groups API - Happy Case', () => {
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

    test('Should get all groups successfully', async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/v1/resources?type=group`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();
        console.log(`Get All Groups Response Status: ${response.status()}`);
        console.log('Get All Groups Response Body:', JSON.stringify(body, null, 2));
        
        expect(response.status()).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        expect(Array.isArray(body.data)).toBe(true);
        
        if (body.data.length > 0) {
            console.log(`Total groups found: ${body.data.length}`);
            console.log('First group:', JSON.stringify(body.data[0], null, 2));
        }
    });
});
