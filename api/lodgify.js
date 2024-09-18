const { logNodeModules } = require("../util/hasPaths");
const setupPuppeteer = require("../services/puppeteer/puppeteerSetup");
const { loginToLodgify } = require("../services/lodgify");
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

    const calendarSyncPageUrl =
      "https://app.lodgify.com/#/reservation/settings/export-import";
    await page.goto(calendarSyncPageUrl, {
      waitUntil: "networkidle2",
    });
    console.log(`at ${calendarSyncPageUrl}`);
    await delay(5000);

    const frames = await page.frames();
    const targetFrame =
      frames.find((frame) =>
        frame.url().includes("PropertyOwner/BookingSettings")
      ) || page.mainFrame();

    console.log("hasIframe", !!targetFrame);

    const syncClicked = await targetFrame.evaluate(() => {
      const button = document.querySelector("#btn-synchronize-calendars");
      if (button) {
        button.scrollIntoView({ behavior: "smooth", block: "center" });
        button.click();
        console.log("Sync button clicked successfully.");
        return true;
      }
      console.error("Sync button not found.");
      return false;
    });

    if (!syncClicked) {
      throw new Error("Sync button could not be clicked.");
    }

    console.log("Synchronization process should be initiated.");
    await browser.close();
    return res.json(
      { message: "Sync button clicked successfully!" },
      { status: 200 }
    );
  } catch (error) {
    await handleError(page, error, res, "Error during process");
  }
};
