import { APIRequestContext, expect } from '@playwright/test';

export async function getAuthToken(request: APIRequestContext, baseURL: string): Promise<string> {
    const loginResponse = await request.post(`${baseURL}/api/v1/auths/login`, {
        data: { 
            username: process.env.API_USERNAME, 
            password: process.env.API_PASSWORD 
        }
    });
    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    const token = body.token || body.accessToken || body?.data?.token || body?.data?.accessToken;
    expect(token).toBeDefined();
    return token;
}
