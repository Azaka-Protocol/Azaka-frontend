import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('heading', { name: /trade finance for african exporters/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /connect wallet/i })).toBeVisible();
  });

  test('should navigate to connect page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByRole('link', { name: /connect wallet/i }).click();
    await expect(page).toHaveURL('/connect');
  });
});

test.describe('Connect Page', () => {
  test('should display role selection', async ({ page }) => {
    await page.goto('/connect');
    
    await expect(page.getByText(/exporter/i)).toBeVisible();
    await expect(page.getByText(/importer/i)).toBeVisible();
    await expect(page.getByText(/issuing bank/i)).toBeVisible();
    await expect(page.getByText(/freight forwarder/i)).toBeVisible();
  });
});
