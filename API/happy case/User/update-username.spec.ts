import { test, expect } from '@playwright/test';

test.describe('Update User Username - Happy Case', () => {
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

        // Get list of users and select first user
        const getUsersResponse = await request.get(getUrl(baseURL, '/api/v1/users'), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        expect(getUsersResponse.status()).toBe(200);
        const usersBody = await getUsersResponse.json();
        const users = usersBody.data || usersBody.users || usersBody;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
        
        userId = users[0].id || users[0]._id;
        expect(userId).toBeDefined();
        console.log(`Selected user ID for username update: ${userId}`);
    });

    test('Should update username successfully', async ({ request, baseURL }) => {
        const newUsername = 'updated_username';
        
        const response = await request.put(getUrl(baseURL, `/api/v1/users/${userId}`), {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                username: newUsername
            }
        });

        const body = await response.json();
        console.log(`Update Username Response Status: ${response.status()}`);
        console.log('Update Username Response Body:', JSON.stringify(body, null, 2));
        expect([200, 201]).toContain(response.status());
        expect(body.success).toBe(true);
        
        // Verify the update by getting user details
        const verifyResponse = await request.get(getUrl(baseURL, `/api/v1/users/${userId}`), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const verifyBody = await verifyResponse.json();
        const userData = verifyBody.data || verifyBody;
        expect(userData.username).toBe(newUsername);
        console.log(`Verified username updated to: ${userData.username}`);
    });
});
