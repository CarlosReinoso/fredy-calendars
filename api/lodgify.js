const { logNodeModules } = require("../util/hasPaths");
const setupPuppeteer = require("../services/puppeteer/puppeteerSetup");
const { handleError } = require("../util/errorHandler");
const { loginToLodgify } = require("../services/lodgify");

module.exports = async (req, res) => {
  logNodeModules();

  let browser = null;
  let page = null;
  try {
    console.log("Setting up Puppeteer...");

    ({ browser, page } = await setupPuppeteer());

    // Go to the Lodgify login page
    await page.goto("https://app.lodgify.com", {
      waitUntil: "networkidle2",
    });

    await loginToLodgify(page, res);

    // Navigate to the calendar sync page
    await page.goto(
      "https://app.lodgify.com/#/reservation/settings/export-import",
      {
        waitUntil: "networkidle2",
      }
    );

    // Check if the button is inside an iframe
    const frames = await page.frames();
    const targetFrame =
      frames.find((frame) =>
        frame.url().includes("PropertyOwner/BookingSettings")
      ) || page.mainFrame();

    // Evaluate inside the frame to find and click the button
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
    console.error("Error during the process:", error);
    return res.json(
      { message: "Error during the process", error },
      { status: 500 }
    );
  }
};
