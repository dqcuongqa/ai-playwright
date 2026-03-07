import { test, expect } from '@playwright/test';

test.describe('Create Model API - Happy Case', () => {
    let token = '';

    const providers = ['piapi', 'replicate', 'ahv'];
    
    const jsonConfigs = [
        {
            model: 'Qubico/flux1-schnell',
            task_type: 'img2img',
            input: {
                prompt: '{prompt_client}',
                image: '{image_client}'
            }
        },
        {
            model: 'gemini',
            task_type: 'nano-banana-pro',
            input: {
                prompt: '{prompt_client}',
                output_format: '{format_client}',
                safety_level: '{safety_level_client}',
                resolution: '{resolution_client}',
                aspect_ratio: '{aspect_client}',
                image_urls: ['{image_client}']
            }
        },
        {
            model: 'Qubico/qwen-image',
            task_type: 'txt2img',
            input: {
                prompt: '{prompt_client}',
                seed: '{seed_client}',
                steps: '{steps_client}',
                width: '{width_client}',
                height: '{height_client}',
                flow_shift: '{flow_shift_client}'
            }
        },
        {
            model: 'Qubico/qwen-edit-image',
            task_type: 'image-edit',
            input: {
                image1: '{image_client}',
                prompt: '{prompt_client}',
                seed: '{seed_client}',
                steps: '{steps_client}',
                flow_shift: '{flow_shift_client}'
            }
        },
        {
            model: 'Qubico/z-image',
            task_type: 'txt2img',
            input: {
                prompt: '{prompt_client}',
                flow_shift: '{flow_shift_client}',
                width: '{width_client}',
                height: '{height_client}',
                batch_size: '{batch_size_client}',
                seed: '{seed_client}'
            }
        }
    ];

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

    test('Should create a model successfully', async ({ request, baseURL }) => {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        const randomProvider = providers[Math.floor(Math.random() * providers.length)];
        const randomConfig = jsonConfigs[Math.floor(Math.random() * jsonConfigs.length)];
        
        const response = await request.post(`${baseURL}/api/v1/models`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: `test${randomNum}`,
                jsonConfig: JSON.stringify(randomConfig),
                price: '0.01',
                processMeanTime: 10,
                provider: randomProvider,
                modelAPI: `test-api-${randomNum}`,
                description: 'Test model description'
            }
        });

        const body = await response.json();
        console.log(`Create Model Response Status: ${response.status()}`);
        console.log('Create Model Response Body:', JSON.stringify(body, null, 2));
        
        expect([200, 201]).toContain(response.status());
        expect(body.success).toBe(true);
        
        if (body.data) {
            expect(body.data).toHaveProperty('id');
            expect(body.data.name).toBe(`test${randomNum}`);
            expect(body.data.provider).toBe(randomProvider);
            console.log(`Model created with ID: ${body.data.id}`);
            console.log(`Model name: ${body.data.name}`);
            console.log(`Provider: ${body.data.provider}`);
        }
    });
});
