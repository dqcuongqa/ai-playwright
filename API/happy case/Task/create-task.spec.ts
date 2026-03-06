import { test, expect } from '@playwright/test';

test.describe('Create Task API - Happy Case', () => {
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
        console.log(`Selected user ID for task creation: ${userId}`);
    });

    test('Should create a task successfully', async ({ request, baseURL }) => {
        test.setTimeout(120000); // Set timeout to 120 seconds for task creation
        
        const response = await request.post(getUrl(baseURL, '/api/v1/tasks'), {
            headers: { 'Authorization': `Bearer ${token}` },
            data: {
                styleId: "{style_id}",
                userId: userId,
                inputData: {
                    prompt_client: "Sample prompt text",
                    image_client: "https://example.com/sample-image.jpg"
                }
            }
        });

        const body = await response.json();
        console.log(`Create Task Response Status: ${response.status()}`);
        console.log('Create Task Response Body:', JSON.stringify(body, null, 2));
        
        expect([200, 201]).toContain(response.status());
        expect(body.success).toBe(true);
        
        // Verify task was created with correct data
        if (body.data) {
            expect(body.data).toHaveProperty('id');
            expect(body.data.userId).toBe(userId);
            expect(body.data.styleId).toBe("{style_id}");
            console.log(`Task created with ID: ${body.data.id}`);
        }
    });
});
