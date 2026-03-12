import { test, expect } from '@playwright/test';

test.describe('Create Category API - Invalid Group ID', () => {
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

    test('Should fail to create category with invalid group ID', async ({ request, baseURL }) => {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        const invalidGroupId = 'invalid-group-id-123';
        
        const response = await request.post(`${baseURL}/api/v1/resources?type=category`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: `category${randomNum}`,
                type: 'category',
                userId: userId,
                groupId: invalidGroupId,
                isPublic: true,
                data: {}
            }
        });

        const body = await response.json();
        console.log(`Create Category Invalid Group ID Response Status: ${response.status()}`);
        console.log('Create Category Invalid Group ID Response Body:', JSON.stringify(body, null, 2));
        
        expect([400, 404, 422]).toContain(response.status());
        expect(body.success).toBe(false);
        expect(body.message || body.error).toBeDefined();
    });

    test('Should fail to create category with non-existent group ID', async ({ request, baseURL }) => {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        const nonExistentGroupId = '999999999';
        
        const response = await request.post(`${baseURL}/api/v1/resources?type=category`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: `category${randomNum}`,
                type: 'category',
                userId: userId,
                groupId: nonExistentGroupId,
                isPublic: true,
                data: {}
            }
        });

        const body = await response.json();
        console.log(`Create Category Non-existent Group ID Response Status: ${response.status()}`);
        console.log('Create Category Non-existent Group ID Response Body:', JSON.stringify(body, null, 2));
        
        expect([400, 404, 422]).toContain(response.status());
        expect(body.success).toBe(false);
        expect(body.message || body.error).toBeDefined();
    });
});