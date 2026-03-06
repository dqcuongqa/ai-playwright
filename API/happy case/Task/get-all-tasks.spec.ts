import { test, expect } from '@playwright/test';

test.describe('Get All Tasks API - Happy Case', () => {
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

    test('Should get all tasks successfully', async ({ request, baseURL }) => {
        const response = await request.get(getUrl(baseURL, '/api/v1/tasks?page=1&limit=10'), {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();
        console.log(`Get All Tasks Response Status: ${response.status()}`);
        console.log('Get All Tasks Response Body:', JSON.stringify(body, null, 2));
        
        expect(response.status()).toBe(200);
        expect(body.success).toBe(true);
        
        // Verify response has data
        const tasks = body.data || body.tasks || body;
        expect(tasks).toBeDefined();
        console.log(`Total tasks found: ${Array.isArray(tasks) ? tasks.length : 'N/A'}`);
        
        // Verify pagination info if exists
        if (body.meta) {
            console.log(`Pagination - Page: ${body.meta.currentPage}, Total: ${body.meta.totalItems}`);
        }
    });
});
