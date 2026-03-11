import { test, expect } from '@playwright/test';

test.describe('Get Group By ID API - Happy Case', () => {
    let token = '';
    let userId = '';
    let groupId = '';

    test.beforeAll(async ({ request, baseURL }) => {
        // Login to get token
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

        // Create a group to get
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        const createResponse = await request.post(`${baseURL}/api/v1/resources?type=group`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: `group-get-by-id-${randomNum}`,
                type: 'group',
                userId: userId,
                isPublic: true,
                data: {}
            }
        });
        expect([200, 201]).toContain(createResponse.status());
        const createBody = await createResponse.json();
        groupId = createBody.data.id;
        expect(groupId).toBeDefined();
    });

    test('Should get group by ID successfully', async ({ request, baseURL }) => {
        const response = await request.get(`${baseURL}/api/v1/resources/${groupId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();
        console.log(`Get Group By ID Response Status: ${response.status()}`);
        console.log('Get Group By ID Response Body:', JSON.stringify(body, null, 2));
        
        expect(response.status()).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data).toBeDefined();
        
        if (body.data) {
            expect(body.data.id).toBe(groupId);
            expect(body.data.type).toBe('group');
            expect(body.data).toHaveProperty('name');
            expect(body.data).toHaveProperty('isPublic');
            console.log(`Successfully retrieved group: ${body.data.name}`);
        }
    });
});