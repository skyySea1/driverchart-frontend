import { test, expect } from '@playwright/test';

test.describe('Applications Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('desenv');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await page.goto('/applications');
  });

  test('should list applications', async ({ page }) => {
    await expect(page.getByTestId('applications-title')).toBeVisible();
    // Check tabs
    await expect(page.getByText('All')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
  });

  test('should view application details', async ({ page }) => {
    // Click first application in table
    const firstApp = page.locator('table tbody tr').first();
    if (await firstApp.isVisible()) {
        await firstApp.click();
        // Verify detail view/modal
        await expect(page.getByText('Personal Info')).toBeVisible();
    }
  });
});
