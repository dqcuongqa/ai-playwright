import { test, expect } from '@playwright/test';

test.describe('Delete Group API - Happy Case', () => {
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

        // Create a group to delete
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        const createResponse = await request.post(`${baseURL}/api/v1/resources?type=group`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: `group-to-delete-${randomNum}`,
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
        console.log(`Created group ${groupId} for deletion test`);
    });

    test('Should delete group successfully', async ({ request, baseURL }) => {
        const response = await request.delete(`${baseURL}/api/v1/resources/${groupId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();
        console.log(`Delete Group Response Status: ${response.status()}`);
        console.log('Delete Group Response Body:', JSON.stringify(body, null, 2));
        
        expect([200, 204]).toContain(response.status());
        
        // Verify group is deleted by trying to get it
        const getResponse = await request.get(`${baseURL}/api/v1/resources/${groupId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log(`Verify Delete Response Status: ${getResponse.status()}`);
        expect([404, 400]).toContain(getResponse.status());
        console.log(`Group ${groupId} successfully deleted`);
    });
});