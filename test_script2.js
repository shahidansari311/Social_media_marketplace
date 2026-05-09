import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Try taking screenshot of marketplace
  await page.goto('http://localhost:5173/Marketplace');
  await page.setViewportSize({ width: 375, height: 812 }); // Mobile
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'marketplace_mobile.png' });

  await page.setViewportSize({ width: 1280, height: 800 }); // Desktop
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'marketplace_desktop.png' });

  await browser.close();
})();
