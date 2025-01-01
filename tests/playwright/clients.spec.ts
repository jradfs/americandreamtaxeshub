import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('sb-access-token', 'mock-token');
  });
  await page.goto('/clients');
});

test('should navigate to clients page and display heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible();
});

test('should display loading state', async ({ page }) => {
  await expect(page.getByText('Loading...')).toBeVisible();
});

test('should display client data', async ({ page }) => {
  await page.route('/api/clients', async route => {
    route.fulfill({
      status: 200,
      json: [
        { id: '1', full_name: 'John Doe', company_name: 'Acme Corp' },
        { id: '2', full_name: 'Jane Smith', company_name: 'Beta Co' },
      ],
    });
  });

  await expect(page.getByRole('cell', { name: 'John Doe' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Acme Corp' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Jane Smith' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Beta Co' })).toBeVisible();
});

test('should display empty state', async ({ page }) => {
  await page.route('/api/clients', async route => {
    route.fulfill({
      status: 200,
      json: [],
    });
  });

  await expect(page.getByText('No clients found.')).toBeVisible();
});
