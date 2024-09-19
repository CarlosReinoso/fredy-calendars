const { loginToBooking, clickSyncButton } = require("../services/puppeteer/booking");
const setupPuppeteer = require("../services/puppeteer/puppeteerSetup");
const { delay } = require("../util");
const { handleError } = require("../util/errorHandler");
const { logNodeModules } = require("../util/hasPaths");

module.exports = async (req, res) => {
  logNodeModules();

  let browser = null;
  let page = null;
  try {
    console.log("Setting up Puppeteer...");

    ({ browser, page } = await setupPuppeteer());

    const calendarSyncPageUrl =
      "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/sync/index.html?lang=en&ses=3dc926df2db22c99d84ac961c589375d&hotel_id=12813815";
    await page.goto(calendarSyncPageUrl, {
      waitUntil: "networkidle2",
    });
    console.log(`at ${calendarSyncPageUrl}`);
    await delay(5000);

    await loginToBooking(page, res);
    await clickSyncButton(page, res);

    await browser.close();
    return res.json(
      { message: "Sync button clicked successfully!" },
      { status: 200 }
    );
  } catch (error) {
    await delay(5000);
    await handleError(page, error, res, "Error during process");
  }
};
