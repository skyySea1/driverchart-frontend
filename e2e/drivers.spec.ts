import { test, expect } from '@playwright/test';

test.describe('Driver Management', () => {
  test.beforeEach(async ({ page }) => {
    // Basic login
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('desenv');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto('/drivers');
  });

  test('should show 404 for disabled drivers page', async ({ page }) => {
    // Drivers page is disabled/removed from router
    await expect(page.getByText('Page Not Found')).toBeVisible();
    await expect(page.getByText('404')).toBeVisible();
  });
  
  // validation test removed as page is disabled
});
