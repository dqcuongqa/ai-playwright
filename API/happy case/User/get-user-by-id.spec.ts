import { test, expect } from '@playwright/test';

test.describe('Get User by ID API - Happy Case', () => {
    let token = '';
    let userId = '';

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

        // Get the current user's profile to extract a valid ID for testing
        const meResponse = await request.get(getUrl(baseURL, '/api/v1/users/me'), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const meBody = await meResponse.json();
        // API returns { success, message, data: { user: { id, ... } } }
        const userObj = meBody.data?.user ?? meBody;
        userId = userObj.id || userObj._id || userObj.userId;
        expect(userId).toBeDefined();
    });

    test('Should get user details successfully by ID', async ({ request, baseURL }) => {
        const response = await request.get(getUrl(baseURL, `/api/v1/users/${userId}`), {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();
        console.log(`Get User by ID Response Status: ${response.status()}`);
        console.log('Get User by ID Response Body:', body);

        expect(response.status()).toBe(200);

        // Assert that the fetched user's ID matches the requested one (API may wrap in data/user)
        const userData = body.data?.user ?? body.data ?? body;
        const fetchedId = userData.id || userData._id || userData.userId;
        expect(fetchedId).toBe(userId);
    });
});
