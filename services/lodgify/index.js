const { delay } = require("../../util");
const { handleError } = require("../../util/errorHandler");

const email = process.env.LODGIFY_LOGIN;
const password = process.env.LODGIFY_PASSWORD;

async function loginToLodgify(page, res) {
  try {
    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', email, { delay: 100 });
    await page.keyboard.press("Enter");

    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', password, { delay: 100 });
    await page.keyboard.press("Enter");
    await delay(5000);
    console.log("Logged into Lodgify successfully.");
  } catch (error) {
    await handleError(page, error, res, "Error during Lodgify login");
  }
}
async function navigateAndClickSyncButton(page, res) {
  try {
    const calendarSyncPageUrl =
      "https://app.lodgify.com/#/reservation/settings/export-import";
    await page.goto(calendarSyncPageUrl, {
      waitUntil: "domcontentloaded",
    });
    console.log(`at ${calendarSyncPageUrl}`);
    await delay(20000);

    const frames = await page.frames();
    frames.forEach((frame) => console.log("Frame URL: ", frame.url()));
    const targetFrame =
      frames.find((frame) =>
        frame.url().includes("PropertyOwner/BookingSettings")
      ) || page.mainFrame();

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
  } catch (error) {
    await handleError(page, error, res, "Error trying to click sync");
  }
}

module.exports = {
  loginToLodgify,
  navigateAndClickSyncButton,
};
