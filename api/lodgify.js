const { logNodeModules } = require("../util/hasPaths");
const setupPuppeteer = require("../services/puppeteer/puppeteerSetup");
const {
  loginToLodgify,
  navigateAndClickSyncButton,
} = require("../services/lodgify");
const { delay } = require("../util");
const { handleError } = require("../util/errorHandler");

module.exports = async (req, res) => {
  logNodeModules();

  let browser = null;
  let page = null;
  try {
    console.log("Setting up Puppeteer...");

    ({ browser, page } = await setupPuppeteer());

    await page.goto("https://app.lodgify.com", {
      waitUntil: "networkidle2",
    });

    await loginToLodgify(page, res);
    await navigateAndClickSyncButton(page, res);

    await browser.close();
    return res.json(
      { message: "Sync button clicked successfully!" },
      { status: 200 }
    );
  } catch (error) {
    await delay(5000)
    await handleError(page, error, res, "Error during process");
  }
};
