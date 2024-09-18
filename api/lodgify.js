const { logNodeModules } = require("../util/hasPaths");
const setupPuppeteer = require("../services/puppeteer/puppeteerSetup");

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

    // Replace with your Lodgify credentials
    const email = process.env.LODGIFY_LOGIN;
    const password = process.env.LODGIFY_PASSWORD;

    // Log in to Lodgify
    try {
      await page.waitForSelector('input[type="email"]', { visible: true });
      await page.type('input[type="email"]', email);
      await page.keyboard.press("Enter");

      await page.waitForSelector('input[type="password"]', { visible: true });
      await page.type('input[type="password"]', password);
      await page.keyboard.press("Enter");

      await page.waitForNavigation({ waitUntil: "networkidle2" });
      console.log("Logged into Lodgify successfully.");
    } catch (loginError) {
      console.error("Error during Lodgify login:", loginError);
      await browser.close();
      return res.json(
        { message: "Login failed, please check your credentials." },
        { status: 500 }
      );
    }

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
