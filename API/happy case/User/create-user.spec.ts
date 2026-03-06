import { test, expect } from '@playwright/test';
import { getAuthToken } from '../../../utils/auth.helper';

test.describe('Create User API - Happy Case', () => {
    let token = '';

    test.beforeAll(async ({ request, baseURL }) => {
        token = await getAuthToken(request, baseURL!);
    });

    test('Should create a user successfully with all fields', async ({ request, baseURL }) => {
        const response = await request.post(`${baseURL}/api/v1/users`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                username: 'testuser',
                password: 'testdata',
                email: 'testdata@example.com',
                cdnUrl: 'https://example.com/avatar.png'
            },
        });

        const body = await response.json();
        console.log(`Create User Response Status: ${response.status()}`);
        console.log('Create User Response Body:', JSON.stringify(body, null, 2));
        expect([200, 201]).toContain(response.status());
        expect(body.success).toBe(true);
        expect(body.data).toHaveProperty('username');
        expect(body.data).toHaveProperty('email');
        expect(body.data).toHaveProperty('cdnUrl');
    });
});
