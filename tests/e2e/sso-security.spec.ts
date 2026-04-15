import { test, expect } from '@playwright/test';

const APP_URLS = {
  auth: process.env.AUTH_URL || 'http://localhost:3001',
  tuvi: process.env.TUVI_URL || 'http://localhost:3002',
  anmenh: process.env.ANMENH_URL || 'http://localhost:3003',
  portal: process.env.PORTAL_URL || 'http://localhost:3000',
};

test.describe('SSO & Security Tests', () => {
  const testUser = {
    email: `sso_test_${Date.now()}@example.com`,
    password: 'Password123!',
  };

  test.beforeEach(async ({ page }) => {
    // Register a new user for each test to ensure a clean state
    await page.goto(`${APP_URLS.auth}/register`);
    await page.locator('input[name="email"]').fill(testUser.email);
    await page.locator('input[name="password"]').fill(testUser.password);
    await page.locator('button[type="submit"]').click();
    
    // Wait for registration to complete and redirect to login or dashboard
    await page.waitForURL(new RegExp(`${APP_URLS.auth}/login|${APP_URLS.auth}/dashboard`));
    
    // If redirected to login, log in
    if (page.url().includes('/login')) {
      await page.locator('input[name="email"]').fill(testUser.email);
      await page.locator('input[name="password"]').fill(testUser.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL(new RegExp(`${APP_URLS.auth}/dashboard`));
    }
  });

  test('5.2.1 SSO: Login at Auth -> Access TuVi & AnMenh', async ({ page, context }) => {
    // User is already logged in via beforeEach
    
    // 1. Access TuVi
    await page.goto(APP_URLS.tuvi);
    // Verify login state in TuVi (Assuming a logout button or profile name exists)
    // Since I don't know the exact UI, I'll check for the absence of "Login" and presence of some authenticated element
    // For now, let's assume if we are not redirected to /login, it's working.
    await expect(page).not.toHaveURL(new RegExp(`${APP_URLS.auth}/login`));
    
    // 2. Access AnMenh
    await page.goto(APP_URLS.anmenh);
    await expect(page).not.toHaveURL(new RegExp(`${APP_URLS.auth}/login`));
    // In AnMenh, the dashboard should be accessible
    await page.goto(`${APP_URLS.anmenh}/dashboard`);
    await expect(page.locator('h1:has-text("Dashboard"), text=Chào mừng')).toBeVisible();
  });

  test('5.2.2 SSO: Global Logout', async ({ page }) => {
    // 1. Verify logged in on TuVi
    await page.goto(APP_URLS.tuvi);
    await expect(page).not.toHaveURL(new RegExp(`${APP_URLS.auth}/login`));

    // 2. Log out from Auth system
    // NextAuth usually provides a /api/auth/signout endpoint
    await page.goto(`${APP_URLS.auth}/api/auth/signout`);
    // The signout page usually has a "Sign out" button or does it automatically
    const signOutButton = page.locator('button:has-text("Sign out"), button:has-text("Đăng xuất")');
    if (await signOutButton.isVisible()) {
      await signOutButton.click();
    }
    await page.waitForURL(new RegExp(`${APP_URLS.auth}/login`));

    // 3. Verify logged out from TuVi
    await page.goto(APP_URLS.tuvi);
    // In a real scenario, TuVi middleware should redirect to auth/login
    // For now, let's check if the login-required state is triggered
    // This depends on how TuVi handles session. Let's assume it redirects.
    await expect(page).toHaveURL(new RegExp(`${APP_URLS.auth}/login`));
  });

  test('5.3.1 Security: JWT Tampering', async ({ page, context }) => {
    // 1. Ensure we are on AnMenh Dashboard
    await page.goto(`${APP_URLS.anmenh}/dashboard`);
    await expect(page.locator('h1:has-text("Dashboard"), text=Chào mừng')).toBeVisible();

    // 2. Manipulate the session cookie
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'vutera-auth-session');
    
    if (!sessionCookie) {
      throw new Error('Session cookie not found');
    }

    // Tamper with the cookie value
    await context.addCookies([{
      ...sessionCookie,
      value: sessionCookie.value + 'tampered'
    }]);

    // 3. Refresh and check if access is denied
    await page.reload();
    
    // Should be redirected to login
    await expect(page).toHaveURL(new RegExp(`${APP_URLS.auth}/login`));
  });

  test('5.3.2 Security: Premium Access Control (PDF)', async ({ page }) => {
    // Registering a new user defaults to FREE plan
    
    // 1. Go to AnMenh BatTrach page
    await page.goto(`${APP_URLS.anmenh}/bat-trach`);
    
    // 2. Perform calculation to show PDF button
    await page.locator('input[type="number"]').fill('1990');
    await page.locator('button:has-text("Tra Cứu Hướng")').click();
    
    const pdfButton = page.locator('button:has-text("Xuất báo cáo PDF"), button:has-text("FileText")');
    await expect(pdfButton).toBeVisible();

    // 3. Try to click PDF button
    // Since we identified that there's no server-side check in generatePremiumReport,
    // this test will actually "fail" (the PDF will be generated) unless we've implemented the check.
    // For the purpose of this task, I will implement the test to check if an alert or a redirect to pricing occurs.
    
    await pdfButton.click();
    
    // Expected: A FREE user should see a "Upgrade to Premium" message or be redirected.
    // If the PDF is just downloaded, it's a security flaw.
    // Let's check if a "Premium" or "Upgrade" message appears.
    const upgradeMessage = page.locator('text=Upgrade to Premium, text=Nâng cấp lên Premium');
    
    // We expect this to BE visible for a FREE user.
    // If it's NOT visible, the test fails (meaning security flaw exists).
    await expect(upgradeMessage).toBeVisible();
  });
});
