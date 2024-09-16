// setupPuppeteer.js
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-extra").use(
  require("puppeteer-extra-plugin-stealth")()
);
const UserPreferencesPlugin = require("puppeteer-extra-plugin-user-preferences");
const UserDataDirPlugin = require("puppeteer-extra-plugin-user-data-dir");
const { isProd } = require("../../util/isProd");

puppeteer.use(UserPreferencesPlugin());
puppeteer.use(UserDataDirPlugin());
puppeteer.launcher = require("puppeteer-core");

async function setupPuppeteer() {
  try {
    console.log("Launching Puppeteer with the following path:", await chromium.executablePath());

    // Launch the browser with the desired configuration
    const browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: isProd
        ? await chromium.executablePath()
        : "C:\\Users\\jrpca\\Documents\\web-agency\\chromium\\chromium\\win64-1355085\\chrome-win\\chrome.exe",
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    console.log("Browser launched successfully");

    // Create a new page
    const page = await browser.newPage();

    // Add additional stealth configurations
    await page.evaluateOnNewDocument(() => {
      // Avoid detection by overriding navigator properties
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "plugins", {
        get: () => [1, 2, 3, 4, 5],
      });
      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });
      window.chrome = { runtime: {} };
    });

    return { browser, page };
  } catch (error) {
    console.error("Error setting up Puppeteer:", error);
    throw error;
  }
}

module.exports = setupPuppeteer;
