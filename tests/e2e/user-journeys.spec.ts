import { test, expect } from '@playwright/test';

const APP_URLS = {
  auth: process.env.AUTH_URL || 'http://localhost:3001',
  tuvi: process.env.TUVI_URL || 'http://localhost:3002',
  anmenh: process.env.ANMENH_URL || 'http://localhost:3003',
  portal: process.env.PORTAL_URL || 'http://localhost:3000',
};

test.describe('Harmony Ecosystem User Journeys', () => {
  
  test('Journey 1: Search -> TuVi -> Lock -> CTA -> Auth -> AnMenh', async ({ page }) => {
    // 1. Start at TuVi Landing Page (Simulating Google Search landing)
    await page.goto(APP_URLS.tuvi);
    await expect(page).toHaveURL(new RegExp(APP_URLS.tuvi));
    await expect(page.locator('h1')).toBeVisible();

    // 2. Xem kết quả cơ bản (Enter basic info to get basic results)
    // Assuming there is a birth date input and a button
    const dateInput = page.locator('input[type="date"]');
    if (await dateInput.isVisible()) {
      await dateInput.fill('1990-01-01');
      await page.locator('button:has-text("Xem kết quả"), button:has-text("Luận giải")').click();
    }

    // 3. Gặp Content Lock (Scroll to detailed section which should be locked)
    // Look for elements with 'blur' class or 'Premium' text
    const lockMessage = page.locator('text=Dành cho thành viên Premium');
    await page.waitForSelector('text=Dành cho thành viên Premium', { timeout: 10000 }).catch(() => {
      console.log('Content lock not found, maybe already unlocked or layout changed');
    });
    await expect(lockMessage).toBeVisible();

    // 4. Click CTA to unlock
    const ctaButton = page.locator('a:has-text("Nâng cấp"), a:has-text("Xem chi tiết"), button:has-text("Unlock")');
    await ctaButton.click();

    // 5. Redirect sang Auth
    await expect(page).toHaveURL(new RegExp(APP_URLS.auth));

    // 6. Đăng ký/Đăng nhập
    // Mocking a simple login
    await page.locator('input[name="email"]').fill('testuser@example.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page.locator('button[type="submit"]').click();

    // 7. Bridge UI -> AnMenh Dashboard
    // Check if we hit a bridge page or directly to AnMenh
    await expect(page).toHaveURL(new RegExp(APP_URLS.anmenh));
    
    // 8. Xem kết quả chi tiết (Verify we are on AnMenh Dashboard)
    await expect(page.locator('h1:has-text("Dashboard"), text=Chào mừng')).toBeVisible();
  });

  test('Journey 2: Portal -> TuVi -> AnMenh (SSO check)', async ({ page }) => {
    // 1. Start at Harmony Portal
    await page.goto(APP_URLS.portal);
    await expect(page).toHaveURL(new RegExp(APP_URLS.portal));

    // 2. Navigate to TuVi
    const tuviLink = page.locator('a[href*="tuvi"]');
    await tuviLink.click();
    await expect(page).toHaveURL(new RegExp(APP_URLS.tuvi));

    // 3. Navigate to AnMenh
    const anmenhLink = page.locator('a[href*="anmenh"]');
    await anmenhLink.click();
    
    // 4. SSO check (Should land on AnMenh without being asked to login if session exists)
    await expect(page).toHaveURL(new RegExp(APP_URLS.anmenh));
    await expect(page.locator('h1:has-text("Dashboard"), text=Chào mừng')).toBeVisible();
  });
});
