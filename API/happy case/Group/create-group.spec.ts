import { test, expect } from '@playwright/test';

test.describe('Create Group API - Happy Case', () => {
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

    test('Should create a group successfully', async ({ request, baseURL }) => {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        
        const response = await request.post(`${baseURL}/api/v1/resources?type=group`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: `group${randomNum}`,
                type: 'group',
                userId: userId,
                isPublic: true,
                data: {}
            }
        });

        const body = await response.json();
        console.log(`Create Group Response Status: ${response.status()}`);
        console.log('Create Group Response Body:', JSON.stringify(body, null, 2));
        
        expect([200, 201]).toContain(response.status());
        expect(body.success).toBe(true);
        
        if (body.data) {
            expect(body.data).toHaveProperty('id');
            expect(body.data.name).toBe(`group${randomNum}`);
            expect(body.data.type).toBe('group');
            expect(body.data.isPublic).toBe(true);
            console.log(`Group created with ID: ${body.data.id}`);
            console.log(`Group name: ${body.data.name}`);
        }
    });
});
