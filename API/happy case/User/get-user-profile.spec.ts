import { test, expect } from '@playwright/test';

test.describe('Get User Profile API - Happy Case', () => {
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

    test('Should get current user profile successfully', async ({ request, baseURL }) => {
        // The endpoint is /api/v1/users/me based on the provided image
        const response = await request.get(getUrl(baseURL, '/api/v1/users/me'), {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();
        console.log(`Get User Profile Response Status: ${response.status()}`);
        console.log('Get User Profile Response Body:', body);

        expect(response.status()).toBe(200);

     
    });
});
