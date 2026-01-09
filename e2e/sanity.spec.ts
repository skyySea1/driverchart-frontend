import { test, expect } from '@playwright/test';

test('sanity check - login page', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/DOT Compliance/);

  // Check if the login card is visible
  await expect(page.getByText('Sign In To CharterSafe')).toBeVisible();

  // Check for email and password inputs
  await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
  await expect(page.getByPlaceholder('••••••••')).toBeVisible();
  
  // Check for Sign In button
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
});
