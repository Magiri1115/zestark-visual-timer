import { test, expect } from '@playwright/test';

test.describe('Visual Bar Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display current time and timezone', async ({ page }) => {
    // Clock should be visible
    const clock = page.locator('div[class*="clockContainer"]');
    await expect(clock).toBeVisible();
    
    // Time should be in HH:MM:SS format
    const time = page.getByTestId('current-time');
    await expect(time).toHaveText(/\d{2}:\d{2}:\d{2}/);
  });

  test('should allow setting timer between 1 and 60 minutes', async ({ page }) => {
    const timeValue = page.getByTestId('timer-value');
    const plusBtn = page.getByRole('button', { name: '＋' });
    const minusBtn = page.getByRole('button', { name: '－' });

    // Default is 30
    await expect(timeValue).toHaveText('30分00秒');

    // Increment
    await plusBtn.click();
    await expect(timeValue).toHaveText('31分00秒');

    // Decrement
    await minusBtn.click();
    await minusBtn.click();
    await expect(timeValue).toHaveText('29分00秒');
  });

  test('should display 30 segments in visual bar', async ({ page }) => {
    const segments = page.getByTestId('segment');
    await expect(segments).toHaveCount(30);
  });

  test('should show start and reset buttons in S1 state', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: '開始' });
    const resetBtn = page.getByRole('button', { name: 'リセット' });
    await expect(startBtn).toBeVisible();
    await expect(resetBtn).toBeVisible();
  });
});
