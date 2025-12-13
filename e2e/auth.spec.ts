import { test, expect, Page } from '@playwright/test';

test.describe('Authentication', () => {
    test('landing page loads', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/VitalAIze/i);
    });

    const getAuthContext = async (page: Page) => {
        const iframe = page.locator('iframe[src*="clerk"]');
        if (await iframe.count() > 0) {
            return page.frameLocator('iframe[src*="clerk"]').first();
        }
        return page;
    };

    test('sign in page loads', async ({ page }) => {
        await page.goto('/sign-in');
        const authContext = await getAuthContext(page);
        await expect(authContext.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    });

    test('sign up page loads', async ({ page }) => {
        await page.goto('/sign-up');
        const authContext = await getAuthContext(page);
        await expect(authContext.getByRole('heading', { name: /create your account/i })).toBeVisible();
    });

    test('forgot password page loads', async ({ page }) => {
        await page.goto('/forgot-password');
        const authContext = await getAuthContext(page);
        await expect(authContext.getByRole('heading', { name: /forgot password/i })).toBeVisible();
    });

    test('navigate from sign-in to sign-up', async ({ page }) => {
        await page.goto('/sign-in');
        const authContext = await getAuthContext(page);
        await authContext.getByRole('link', { name: /sign up/i }).click();
        await expect(page).toHaveURL(/.*sign-up.*/);
        const signUpContext = await getAuthContext(page);
        await expect(signUpContext.getByRole('heading', { name: /create your account/i })).toBeVisible();
    });

    test('navigate from sign-in to forgot-password', async ({ page }) => {
        await page.goto('/sign-in');
        const authContext = await getAuthContext(page);
        await authContext.getByRole('link', { name: /forgot password/i }).click();
        await expect(page).toHaveURL(/.*forgot-password.*/);
        const forgotContext = await getAuthContext(page);
        await expect(forgotContext.getByRole('heading', { name: /forgot password/i })).toBeVisible();
    });

    test('protected route redirects to sign-in', async ({ page }) => {
        await page.goto('/home');
        await expect(page).toHaveURL(/.*sign-in.*/);
    });
});
