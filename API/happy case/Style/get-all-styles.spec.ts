import { test, expect } from '@playwright/test';

test.describe('Get All Styles API - Happy Case', () => {
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

    test('Should get all styles successfully', async ({ request, baseURL }) => {
        const response = await request.get(getUrl(baseURL, '/api/v1/resources?type=style'), {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const body = await response.json();
        console.log(`Get All Styles Response Status: ${response.status()}`);
        console.log('Get All Styles Response Body:', JSON.stringify(body, null, 2));
        
        expect(response.status()).toBe(200);
        expect(body.success).toBe(true);
        
        // Verify response has data
        const styles = body.data || body.styles || body;
        expect(styles).toBeDefined();
        console.log(`Total styles found: ${Array.isArray(styles) ? styles.length : 'N/A'}`);
    });
});
