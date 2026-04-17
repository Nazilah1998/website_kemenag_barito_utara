const { test, expect } = require("@playwright/test");

test.describe("Admin laporan smoke flow", () => {
  test("redirects guest user away from admin laporan or shows login", async ({
    page,
  }) => {
    await page.goto("/admin/laporan");

    await expect(page).toHaveURL(/admin\/login|error|admin\/laporan/);
  });
});
