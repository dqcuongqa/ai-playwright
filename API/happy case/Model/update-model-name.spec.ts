import { test, expect } from '@playwright/test';

test.describe('Update Model Name - Happy Case', () => {
    let token = '';
    let modelId = '';

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

        const getModelsResponse = await request.get(`${baseURL}/api/v1/models`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        expect(getModelsResponse.status()).toBe(200);
        const modelsBody = await getModelsResponse.json();
        const models = modelsBody.data || modelsBody.models || modelsBody;
        expect(Array.isArray(models)).toBe(true);
        expect(models.length).toBeGreaterThan(0);
        
        modelId = models[0].id || models[0]._id;
        expect(modelId).toBeDefined();
        console.log(`Selected model ID for name update: ${modelId}`);
    });

    test('Should update model name successfully', async ({ request, baseURL }) => {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        const newName = `updated-name-${randomNum}`;
        
        const response = await request.put(`${baseURL}/api/v1/models/${modelId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: newName
            }
        });

        const body = await response.json();
        console.log(`Update Model Name Response Status: ${response.status()}`);
        console.log('Update Model Name Response Body:', JSON.stringify(body, null, 2));
        
        expect([200, 201]).toContain(response.status());
        expect(body.success).toBe(true);
        
        if (body.data) {
            expect(body.data.name).toBe(newName);
            console.log(`Model name updated to: ${body.data.name}`);
        }
    });
});
