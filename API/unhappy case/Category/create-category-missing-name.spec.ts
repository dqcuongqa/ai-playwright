import { test, expect } from '@playwright/test';

test.describe('Create Category API - Missing Name', () => {
    let token = '';
    let userId = '';

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
        userId = body.user?.id || body?.data?.user?.id || body?.data?.id;
        expect(token).toBeDefined();
        expect(userId).toBeDefined();
    });

    test('Should fail to create category without name', async ({ request, baseURL }) => {
        // Get a group ID first
        const groupResponse = await request.get(`${baseURL}/api/v1/resources?type=group`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const groupBody = await groupResponse.json();
        const groupId = groupBody.data?.[0]?.id;
        
        const response = await request.post(`${baseURL}/api/v1/resources?type=category`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                type: 'category',
                userId: userId,
                groupId: groupId,
                isPublic: true,
                data: {}
            }
        });

        const body = await response.json();
        console.log(`Create Category Missing Name Response Status: ${response.status()}`);
        console.log('Create Category Missing Name Response Body:', JSON.stringify(body, null, 2));
        
        expect([400, 422]).toContain(response.status());
        expect(body.success).toBe(false);
        expect(body.message || body.error).toBeDefined();
    });
});