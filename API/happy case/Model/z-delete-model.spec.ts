import { test, expect } from '@playwright/test';

test.describe('Delete Model API - Happy Case', () => {
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

    test('Should delete the first model successfully', async ({ request, baseURL }) => {
        const getAllResponse = await request.get(`${baseURL}/api/v1/models`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        expect(getAllResponse.status()).toBe(200);
        const getAllBody = await getAllResponse.json();
        expect(getAllBody.success).toBe(true);
        expect(getAllBody.data).toBeDefined();
        expect(getAllBody.data.length).toBeGreaterThan(0);
        
        const firstModelId = getAllBody.data[0].id;
        console.log(`Deleting first model with ID: ${firstModelId}`);
        
        const deleteResponse = await request.delete(`${baseURL}/api/v1/models/${firstModelId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const deleteBody = await deleteResponse.json();
        console.log(`Delete Model Response Status: ${deleteResponse.status()}`);
        console.log('Delete Model Response Body:', JSON.stringify(deleteBody, null, 2));
        
        expect([200, 204]).toContain(deleteResponse.status());
        
        if (deleteResponse.status() === 200) {
            expect(deleteBody.success).toBe(true);
        }
        
        console.log(`Model with ID ${firstModelId} deleted successfully`);
    });
});
