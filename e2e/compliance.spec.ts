import { test, expect } from '@playwright/test';

test.describe('Compliance Documents', () => {
  test.beforeEach(async ({ page }) => {
     await page.goto('/login');
    await page.getByPlaceholder('you@example.com').fill('admin@example.com');
    await page.getByPlaceholder('••••••••').fill('desenv');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test.skip('should verify compliance sections exist', async ({ page }) => {
    await page.goto('/drivers');
    await expect(page.getByText('Drivers List')).toBeVisible();
    
    // Open first driver
    await page.locator('table tbody tr').first().click(); // Row click opens Profile
    // Double click needed? DefaultTable.vue says @row-dblclick="openEdit", @row-click="openProfile"
    // The previous test logic assumed clicking row opens Edit?
    // Let's check DriversModule.vue again. 
    // Step 1912: row-dblclick="openEdit", row-click="openProfile".
    
    // In Profile view, do we see compliance sections?
    // Profile view usually shows charts/logs.
    // Edit Modal shows Forms.
    // To check Upload Buttons (ActionsIcon), we need Edit Modal.
    // So we should DOUBLE CLICK the row.
    
    await page.locator('table tbody tr').first().dblclick();
    
    // Wait for modal
    await expect(page.getByText('Edit Driver')).toBeVisible();
    
    // Verify Sections via Headers
    await expect(page.getByText('License Information')).toBeVisible();
    await expect(page.getByText('Medical Cert (MEC)')).toBeVisible();
    await expect(page.getByText('MVR (Annual)')).toBeVisible();
    await expect(page.getByText('Drug & Alcohol')).toBeVisible();
    await expect(page.getByText('Road Test (Cert)')).toBeVisible();
  });
});
