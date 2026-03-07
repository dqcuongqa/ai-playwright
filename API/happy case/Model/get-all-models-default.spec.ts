import { test, expect } from '@playwright/test';

test.describe('Get All Models API - Default Pagination', () => {
    let token = '';

    test.beforeAll(async ({ request, baseURL }) => {
        const loginResponse = await request.post(`${baseURL}/api/v1/auths/login`, {
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

    test('Should get all models successfully with default pagination', async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/v1/models`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log(`Get All Models Response Status: ${response.status()}`);
        const contentType = response.headers()['content-type'];
        console.log(`Content-Type: ${contentType}`);
        
        const responseText = await response.text();
        console.log('Response (first 500 chars):', responseText.substring(0, 500));
        
        expect(response.status()).toBe(200);
        
        if (contentType?.includes('application/json')) {
            const body = JSON.parse(responseText);
            console.log('Get All Models Response Body:', JSON.stringify(body, null, 2));
            
            const models = body.data || body.models || body;
            expect(models).toBeDefined();
            console.log(`Total models found: ${Array.isArray(models) ? models.length : 'N/A'}`);
        }
    });
});
