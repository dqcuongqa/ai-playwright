import { test, expect } from '@playwright/test';

test.describe('Create Category API - Without Authentication', () => {
    test('Should fail to create category without authentication token', async ({ request, baseURL }) => {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        
        const response = await request.post(`${baseURL}/api/v1/resources?type=category`, {
            data: {
                name: `category${randomNum}`,
                type: 'category',
                isPublic: true,
                data: {}
            }
        });

        const body = await response.json();
        console.log(`Create Category Without Auth Response Status: ${response.status()}`);
        console.log('Create Category Without Auth Response Body:', JSON.stringify(body, null, 2));
        
        expect(response.status()).toBe(401);
        expect(body.success).toBe(false);
        expect(body.message || body.error).toBeDefined();
    });
});