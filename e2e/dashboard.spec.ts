import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('desenv');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should load dashboard stats', async ({ page }) => {
    // Verify stats cards are present using reliable test IDs
    await expect(page.getByTestId('stat-card-alerts')).toBeVisible();
    await expect(page.getByTestId('stat-card-applications')).toBeVisible(); 

    // Verify Drivers Module is present
    await expect(page.getByTestId('drivers-module-title')).toBeVisible();
    await expect(page.getByText('Drivers List')).toBeVisible();
  });

});
