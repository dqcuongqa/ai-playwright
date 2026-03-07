import { test, expect } from '@playwright/test';

test.describe('Update Model Provider - Happy Case', () => {
    let token = '';
    let modelId = '';

    const providers = ['piapi', 'replicate', 'ahv'];

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

        const randomId = Math.floor(Math.random() * 10000) + 1;
        const jsonConfig = {
            model: 'test-model',
            task_type: 'txt2img',
            input: {
                prompt: '{prompt_client}'
            }
        };
        
        const createResponse = await request.post(`${baseURL}/api/v1/models`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: `TestModel${randomId}`,
                jsonConfig: JSON.stringify(jsonConfig),
                price: '0.01',
                processMeanTime: 10,
                provider: 'piapi',
                modelAPI: `test-api-${randomId}`,
                description: 'Model for provider update test'
            }
        });
        expect([200, 201]).toContain(createResponse.status());
        const createBody = await createResponse.json();
        modelId = createBody.data?.id || createBody.data?._id || createBody.id || createBody._id;
        expect(modelId).toBeDefined();
        console.log(`Created model ID for provider update: ${modelId}`);
    });

    test('Should update model provider successfully', async ({ request, baseURL }) => {
        const newProvider = providers[Math.floor(Math.random() * providers.length)];
        
        const response = await request.put(`${baseURL}/api/v1/models/${modelId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                provider: newProvider
            }
        });

        const body = await response.json();
        console.log(`Update Model Provider Response Status: ${response.status()}`);
        console.log('Update Model Provider Response Body:', JSON.stringify(body, null, 2));
        
        expect([200, 201]).toContain(response.status());
        expect(body.success).toBe(true);
        
        if (body.data) {
            expect(body.data.provider).toBe(newProvider);
            console.log(`Model provider updated to: ${body.data.provider}`);
        }
    });
});
