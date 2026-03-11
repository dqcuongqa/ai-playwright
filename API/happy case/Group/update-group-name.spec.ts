import { test, expect } from '@playwright/test';

test.describe('Update Group Name API - Happy Case', () => {
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

        // Create a group to update
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        const createResponse = await request.post(`${baseURL}/api/v1/resources?type=group`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: `group-to-update-${randomNum}`,
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

    test('Should update group name successfully', async ({ request, baseURL }) => {
        const newRandomNum = Math.floor(Math.random() * 1000) + 1;
        const newName = `updated-group-${newRandomNum}`;
        
        const response = await request.put(`${baseURL}/api/v1/resources/${groupId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: newName
            }
        });

        const body = await response.json();
        console.log(`Update Group Name Response Status: ${response.status()}`);
        console.log('Update Group Name Response Body:', JSON.stringify(body, null, 2));
        
        expect(response.status()).toBe(200);
        expect(body.success).toBe(true);
        
        if (body.data) {
            expect(body.data.id).toBe(groupId);
            expect(body.data.name).toBe(newName);
            console.log(`Group ${groupId} name updated to: ${newName}`);
        }
    });
});