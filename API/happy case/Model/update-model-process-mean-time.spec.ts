import { test, expect } from '@playwright/test';

test.describe('Update Model Process Mean Time - Happy Case', () => {
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

        const createRes = await request.post(`${baseURL}/api/v1/models`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: `pmtupd_${Date.now()}`,
                jsonConfig: JSON.stringify({ model: 'test', task_type: 'txt2img', input: {} }),
                price: '0.01',
                processMeanTime: 10,
                provider: 'piapi',
                modelAPI: `api_${Date.now()}`,
                description: 'For process mean time update test'
            },
        });
        expect([200, 201]).toContain(createRes.status());
        const createBody = await createRes.json();
        const created = createBody.data || createBody;
        modelId = created.id || created._id;
        expect(modelId).toBeDefined();
        console.log(`Created model ID for process mean time update: ${modelId}`);
    });

    test('Should update model process mean time successfully', async ({ request, baseURL }) => {
        const newProcessMeanTime = 20;
        
        const response = await request.put(`${baseURL}/api/v1/models/${modelId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                processMeanTime: newProcessMeanTime
            }
        });

        const body = await response.json();
        console.log(`Update Model Process Mean Time Response Status: ${response.status()}`);
        console.log('Update Model Process Mean Time Response Body:', JSON.stringify(body, null, 2));
        
        expect([200, 201]).toContain(response.status());
        expect(body.success).toBe(true);
        
        if (body.data) {
            expect(body.data.processMeanTime).toBe(newProcessMeanTime);
            console.log(`Model process mean time updated to: ${body.data.processMeanTime}`);
        }
    });
});
