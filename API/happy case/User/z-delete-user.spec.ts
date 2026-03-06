import { test, expect } from '@playwright/test';

test.describe('Delete User API - Happy Case', () => {
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
    });

    test('Should delete a user successfully and verify deletion', async ({ request, baseURL }) => {
        // Step 1: Get list of users
        const getUsersResponse = await request.get(getUrl(baseURL, '/api/v1/users'), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        expect(getUsersResponse.status()).toBe(200);
        const usersBody = await getUsersResponse.json();
        console.log('Get Users Response:', JSON.stringify(usersBody, null, 2));
        
        // Get first user from the list
        const users = usersBody.data || usersBody.users || usersBody;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
        userId = users[0].id || users[0]._id;
        expect(userId).toBeDefined();
        console.log(`Selected user ID for deletion: ${userId}`);

        // Step 2: Delete the user
        const deleteResponse = await request.delete(getUrl(baseURL, `/api/v1/users/${userId}`), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const deleteBody = await deleteResponse.json();
        console.log(`Delete User Response Status: ${deleteResponse.status()}`);
        console.log('Delete User Response Body:', JSON.stringify(deleteBody, null, 2));
        expect([200, 204]).toContain(deleteResponse.status());

        // Step 3: Verify user is deleted by trying to get it
        const verifyResponse = await request.get(getUrl(baseURL, `/api/v1/users/${userId}`), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`Verify Deletion Response Status: ${verifyResponse.status()}`);
        const verifyBody = await verifyResponse.json();
        console.log('Verify Deletion Response Body:', JSON.stringify(verifyBody, null, 2));
        expect([404, 400]).toContain(verifyResponse.status());
    });
});
