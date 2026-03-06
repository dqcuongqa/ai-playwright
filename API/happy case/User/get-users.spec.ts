import { test, expect } from '@playwright/test';

test.describe('Get Users API - Happy Case', () => {
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

    test('Should get a list of users successfully with default pagination', async ({ request, baseURL }) => {
        const response = await request.get(getUrl(baseURL, '/api/v1/users'), {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();
        console.log(`Get Users Response Status: ${response.status()}`);
        expect(response.status()).toBe(200);

        // Typically the result is an array or an object containing a data/items array
        console.log('Get Users Response Body:', body);
    });

    test('Should get a list of users successfully with custom limit (limit=5)', async ({ request, baseURL }) => {
        const response = await request.get(getUrl(baseURL, '/api/v1/users'), {
            headers: { 'Authorization': `Bearer ${token}` },
            params: {
                limit: 5,
                page: 1
            }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log('Get Users Limit=5 Response Body:', body);
    });
});
