const { handleError } = require("../util/errorHandler");
const { logNodeModules } = require("../util/hasPaths");
const { delay } = require("../util");
const {
  handle2AuthModal,
  clickSmsButton,
  clickAllRefreshButtons,
} = require("../util/puppeteerAirbnbUtil");
const setupPuppeteer = require("../services/puppeteer/puppeteerSetup");
const {
  enterVerificationCode,
} = require("../services/puppeteer/verificationCode");

const email = process.env.AIRBNB_LOGIN;
const password = process.env.AIRBNB_PASSWORD;

module.exports = async (req, res) => {
  logNodeModules();

  let browser = null;
  let page = null;
  try {
    console.log("Setting up Puppeteer...");

    ({ browser, page } = await setupPuppeteer());

    await page.goto("https://www.airbnb.com/login", {
      waitUntil: "networkidle2",
    });
    console.log("at: https://www.airbnb.com/login");

    //EMAIL LOGIN METHOD
    try {
      await page.waitForSelector('button[aria-label="Continue with email"]', {
        visible: true,
        timeout: 30000,
      });
      await page.click('button[aria-label="Continue with email"]');
      console.log("Clicked 'Continue with email' button.");
    } catch (error) {
      await handleError(
        page,
        error,
        res,
        "Error clicking 'Continue with email' button:"
      );
    }

    //EMAIL INPUT AND SUBMIT
    try {
      await page.waitForSelector('input[type="email"]', {
        visible: true,
        timeout: 30000,
      });
      await page.type('input[type="email"]', email);
      await page.waitForSelector('button[data-veloute="submit-btn-cypress"]', {
        visible: true,
        timeout: 30000,
      });

      await delay(5000);

      try {
        await page.evaluate(() => {
          const button = document.querySelector(
            'button[data-veloute="submit-btn-cypress"]'
          );
          if (button) {
            button.scrollIntoView();
            button.focus();
            button.click();
          }
        });
        console.log("Email Button clicked successfully.");
      } catch (clickError) {
        console.error("Error clicking the email button:", clickError);
      }
    } catch (error) {
      await handleError(page, error, res, "Error during login in EMAIL page");
    }

    await delay(5000);

    //INPUT PASSWORD AND CLICK LOGIN BUTTON
    try {
      await page.waitForSelector('input[type="password"]', {
        visible: true,
        timeout: 30000,
      });
      await page.type('input[type="password"]', password, { delay: 100 });
      console.log("Password entered successfully.");
    } catch (error) {
      await handleError(page, error, res, "Error entering the password:");
    }

    try {
      await page.waitForSelector('button[type="submit"]', {
        visible: true,
        timeout: 30000,
      });
      await page.click('button[type="submit"]', { delay: 100 });
      console.log("Log In button clicked successfully.");
    } catch (error) {
      await handleError(page, error, res, "Error clicking the Log In button:");
    }

    // 2AUTH MODAL
    await delay(5000);

    const is2AuthModal = await handle2AuthModal(page);
    if (is2AuthModal) {
      await clickSmsButton(page);
      await delay(5000);
      await enterVerificationCode(page);
      await delay(5000);
    }

    const availabilityPage =
      "https://www.airbnb.co.uk/multicalendar/1228348447908449096/availability-settings/";

    await page.goto(`${availabilityPage}`, { waitUntil: `networkidle2` });
    console.log(`at: ${availabilityPage}`);

    await delay(5000);

    await clickAllRefreshButtons(page);

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
