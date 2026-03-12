import { test, expect } from '@playwright/test';

test.describe('Update Category API - Invalid ID', () => {
    let token = '';

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
    });

    test('Should fail to update category with invalid ID', async ({ request, baseURL }) => {
        const invalidId = 'invalid-category-id-123';
        
        const response = await request.put(`${baseURL}/api/v1/resources/${invalidId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: 'updated-category-name'
            }
        });

        const body = await response.json();
        console.log(`Update Category Invalid ID Response Status: ${response.status()}`);
        console.log('Update Category Invalid ID Response Body:', JSON.stringify(body, null, 2));
        
        expect([400, 404]).toContain(response.status());
        expect(body.success).toBe(false);
        expect(body.message || body.error).toBeDefined();
    });

    test('Should fail to update category with non-existent ID', async ({ request, baseURL }) => {
        const nonExistentId = '999999999';
        
        const response = await request.put(`${baseURL}/api/v1/resources/${nonExistentId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                name: 'updated-category-name'
            }
        });

        const body = await response.json();
        console.log(`Update Category Non-existent ID Response Status: ${response.status()}`);
        console.log('Update Category Non-existent ID Response Body:', JSON.stringify(body, null, 2));
        
        expect(response.status()).toBe(404);
        expect(body.success).toBe(false);
        expect(body.message || body.error).toBeDefined();
    });
});