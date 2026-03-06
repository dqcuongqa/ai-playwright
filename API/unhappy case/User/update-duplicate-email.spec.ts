import { test, expect } from '@playwright/test';

test.describe('Update User - Duplicate Email', () => {
    let token = '';
    let userId = '';
    let existingEmail = '';

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

        // Get list of users
        const getUsersResponse = await request.get(getUrl(baseURL, '/api/v1/users'), {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        expect(getUsersResponse.status()).toBe(200);
        const usersBody = await getUsersResponse.json();
        const users = usersBody.data || usersBody.users || usersBody;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(1);
        
        // Select first user to update
        userId = users[0].id || users[0]._id;
        // Get second user's email (existing email)
        existingEmail = users[1].email;
        
        expect(userId).toBeDefined();
        expect(existingEmail).toBeDefined();
        console.log(`Selected user ID: ${userId}`);
        console.log(`Existing email to test duplicate: ${existingEmail}`);
    });

    test('Should fail to update user with duplicate email', async ({ request, baseURL }) => {
        const response = await request.put(getUrl(baseURL, `/api/v1/users/${userId}`), {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                email: existingEmail
            }
        });

        const body = await response.json();
        console.log('Duplicate Email Error Response:', JSON.stringify(body, null, 2));
        expect([400, 409, 422]).toContain(response.status());
        expect(body.success).toBe(false);
    });
});
