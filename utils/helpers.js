class Helpers {
  static generateRandomEmail() {
    return `test${Date.now()}@example.com`;
  }

  static async takeScreenshot(page, name) {
    await page.screenshot({ path: `screenshots/${name}.png` });
  }

  static async waitForTimeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = Helpers;
