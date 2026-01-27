import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill credentials
    await page.getByPlaceholder('you@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('desenv');
    
    // Click Sign In
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify redirection to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    // Verify dashboard loaded by checking a module or stat card
    await expect(page.getByTestId('stat-card-alerts')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByPlaceholder('you@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify error message
    // Adjust selector based on actual UI implementation, generic text search for now
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
