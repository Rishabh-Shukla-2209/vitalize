import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    // Note: We might need to adjust this depending on the actual page title
    // But for now we just want to see if the runner works.
    await expect(page).toHaveTitle(/VitalAIze/i);
});
