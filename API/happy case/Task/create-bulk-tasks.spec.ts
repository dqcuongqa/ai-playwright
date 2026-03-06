import { test, expect } from '@playwright/test';

// This test creates 10 tasks - takes about 5-6 minutes
test.describe.skip('Create Bulk Tasks - 10 Tasks', () => {
    let token = '';
    let userId = '';

    const getUrl = (baseURL: string | undefined, path: string) => {
        return baseURL ? `${baseURL}${path}` : `https://api.example.com${path}`;
    };

    const prompts = [
        "Sample prompt text",
        "A majestic mountain landscape with snow peaks",
        "A serene forest with tall trees and morning mist",
        "A futuristic city with flying cars and neon lights",
        "A peaceful beach with crystal clear water",
        "A magical fantasy castle in the clouds",
        "A cozy coffee shop on a rainy day",
        "A vibrant flower garden in full bloom",
        "A mysterious ancient temple in the jungle",
        "A stunning aurora borealis in the night sky"
    ];

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
        console.log(`Selected user ID for bulk task creation: ${userId}`);
    });

    test('Should create 10 tasks successfully', async ({ request, baseURL }) => {
        test.setTimeout(360000); // Set timeout to 6 minutes for 10 tasks
        
        let successCount = 0;
        let failCount = 0;
        const results = [];

        console.log('\n=== Starting bulk task creation (10 tasks) ===\n');

        for (let i = 1; i <= 10; i++) {
            try {
                const promptIndex = (i - 1) % prompts.length;
                const response = await request.post(getUrl(baseURL, '/api/v1/tasks'), {
                    headers: { 'Authorization': `Bearer ${token}` },
                    data: {
                        styleId: "{style_id}",
                        userId: userId,
                        inputData: {
                            prompt_client: `${prompts[promptIndex]} - Task ${i}`,
                            image_client: "https://example.com/sample-image.jpg"
                        }
                    }
                });

                const body = await response.json();
                
                if ([200, 201].includes(response.status()) && body.success) {
                    successCount++;
                    console.log(`✅ Task ${i}/10 created successfully - ID: ${body.data?.id}`);
                } else {
                    failCount++;
                    console.log(`❌ Task ${i}/10 failed - Status: ${response.status()}`);
                }

                results.push({
                    taskNumber: i,
                    status: response.status(),
                    success: body.success,
                    taskId: body.data?.id
                });

            } catch (error: any) {
                failCount++;
                console.log(`❌ Task ${i}/10 error: ${error?.message || error}`);
                results.push({
                    taskNumber: i,
                    error: error?.message || String(error)
                });
            }
        }

        console.log('\n=== Bulk Task Creation Summary ===');
        console.log(`Total tasks: 10`);
        console.log(`✅ Success: ${successCount}`);
        console.log(`❌ Failed: ${failCount}`);
        console.log(`Success rate: ${(successCount / 10 * 100).toFixed(2)}%`);

        // Expect at least 8/10 success rate (80%)
        expect(successCount).toBeGreaterThanOrEqual(8);
    });
});
