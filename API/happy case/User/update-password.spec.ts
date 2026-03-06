import { test, expect } from '@playwright/test';

test.describe('Update User Password - Happy Case', () => {
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
        console.log(`Selected user ID for password update: ${userId}`);
    });

    test('Should update password successfully', async ({ request, baseURL }) => {
        const newPassword = 'updated_password';
        
        const response = await request.put(getUrl(baseURL, `/api/v1/users/${userId}`), {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                password: newPassword
            }
        });

        const body = await response.json();
        console.log(`Update Password Response Status: ${response.status()}`);
        console.log('Update Password Response Body:', JSON.stringify(body, null, 2));
        expect([200, 201]).toContain(response.status());
        expect(body.success).toBe(true);
        console.log('Password updated successfully');
    });
});
