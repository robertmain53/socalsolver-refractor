import { test, expect } from '@playwright/test';

test('pressure converter works', async ({ page }) => {
  await page.goto('/en/convert-pressure');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Pressure Unit Converter/i);
  const input = page.getByLabel('Value');
  await input.fill('2');
  await expect(page.getByText(/Pascal/)).toBeVisible();
  // quick check output changes
  const output = page.locator('output#Pa');
  await expect(output).toContainText('2');
});
