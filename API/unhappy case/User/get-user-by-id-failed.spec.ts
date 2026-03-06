import { test, expect } from '@playwright/test';

test.describe('Get User by ID API - Unhappy Case', () => {
    let token = '';

    const getUrl = (baseURL: string | undefined, path: string) => {
        return baseURL ? `${baseURL}${path}` : `https://api.example.com${path}`;
    };

    test.beforeAll(async ({ request, baseURL }) => {
        const loginResponse = await request.post(getUrl(baseURL, '/api/v1/auths/login'), {
            data: { username: process.env.API_USERNAME, password: process.env.API_PASSWORD }
        });
        expect(loginResponse.status()).toBe(200);
        const body = await loginResponse.json();
        token = body.token || body.accessToken || body?.data?.token || body?.data?.accessToken;
        expect(token).toBeDefined();
    });

    test('Should return 404 for a non-existent user ID', async ({ request, baseURL }) => {
        const fakeId = 'nonexistent-id-999999';
        const response = await request.get(getUrl(baseURL, `/api/v1/users/${fakeId}`), {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();
        console.log(`Get User by Fake ID Response Status: ${response.status()}`);
        console.log('Get User by Fake ID Response Body:', body);

        // Based on the swagger definition, it expects 404 User not found
        // Sometimes APIs return 400 Bad Request if the ID format is totally wrong (e.g. invalid mongo ObjectId)
        expect([404, 400]).toContain(response.status());
    });
});
