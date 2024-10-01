const { logNodeModules } = require("../util/hasPaths");
const { delay } = require("../util");
const {
  handle2AuthModal,
  clickSmsButton,
  clickAllRefreshButtons,
  emailLoginMethod,
  emailTypeAndClick,
  typePasswordAndClickLogin,
  airbnbLoginPage,
} = require("../util/puppeteerAirbnbUtil");
const setupPuppeteer = require("../services/puppeteer/puppeteerSetup");
const {
  enterVerificationCode,
} = require("../services/puppeteer/verificationCode");
const { respondScreenshot } = require("../util/errorHandler");

module.exports = async (req, res) => {
  logNodeModules();

  let browser = null;
  let page = null;
  try {
    console.log("Setting up Puppeteer...");

    ({ browser, page } = await setupPuppeteer());

    await airbnbLoginPage(page);
    await emailLoginMethod(page, res);
    await emailTypeAndClick(page, res);
    await typePasswordAndClickLogin(page, res);

    const is2AuthModal = await handle2AuthModal(page);
    if (is2AuthModal) {
      await clickSmsButton(page, res);
      await delay(5000);
      await enterVerificationCode(page, res);
      await delay(5000);
    }

    const availabilityPage =
      "https://www.airbnb.co.uk/multicalendar/1228348447908449096/availability-settings/";

    await page.goto(`${availabilityPage}`, { waitUntil: `networkidle2` });
    console.log(`at: ${availabilityPage}`);

    await delay(5000);

    await clickAllRefreshButtons(page, res);
    await browser.close();

    res.statusCode = 200;
    return res.json({
      message: "Refresh button clicked successfully!",
    });
  } catch (error) {
    console.error("Error during the process:", error);
    res.statusCode = 500;
    return res.json({
      message: "Error during the process",
      error,
    });
  }
};
