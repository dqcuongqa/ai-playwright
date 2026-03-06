import { test, expect } from '@playwright/test';

test.describe('Login API - Happy Cases', () => {

    test('Login successfully and receive a token', async ({ request, baseURL }) => {
        const url = `${baseURL}/api/v1/auths/login`;

        const response = await request.post(url, {
            data: {
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD,
            },
        });

       // Expecting HTTP status code 200
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        console.log('Success Response:', responseBody);

        //Assert that a token is returned in the response
        const token = responseBody.token || responseBody.accessToken || responseBody?.data?.token || responseBody?.data?.accessToken;

        expect(token, 'Expected response to contain a token').toBeDefined();
        expect(typeof token).toBe('string');
    });

});
