const { handleError, sendPageHTML, timeout } = require("../util/errorHandler");
const { logNodeModules } = require("../util/hasPaths");
const { delay } = require("../util");
const {
  handle2AuthModal,
  clickSmsButton,
} = require("../util/puppeteerAirbnbUtil");
const setupPuppeteer = require("../services/puppeteer/puppeteerSetup");
const {
  enterCodeApi,
  waitForCodeFromAPI,
  enterVerificationCode,
} = require("../services/puppeteer/verificationCode");
const { default: axios } = require("axios");

const email = process.env.AIRBNB_LOGIN;
const password = process.env.AIRBNB_PASSWORD;

// Function to perform the actual wait for the code from the API

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
      await enterVerificationCode(page)
    }



    return await handleError(page, "error", res, "Error ");

    await sendPageHTML(page, res);

    const availabilityPage =
      "https://www.airbnb.co.uk/multicalendar/1228348447908449096/availability-settings/";
    await page.goto(`${availabilityPage}`, { waitUntil: `networkidle2` });
    console.log(`at: ${availabilityPage}`);
    // Scroll down to ensure all content is loaded
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        const scrollInterval = setInterval(() => {
          window.scrollBy(0, window.innerHeight);
          if (
            window.scrollY + window.innerHeight >=
            document.body.scrollHeight
          ) {
            clearInterval(scrollInterval);
            resolve();
          }
        }, 200);
      });
    });

    await delay(2000);

    try {
      console.log("🚀 Attempting to click the Refresh button...");
      // Use page.evaluate to find the button and simulate a more realistic click
      const refreshClicked = await page.evaluate(() => {
        // Locate the button by class name
        const buttons = document.querySelectorAll("button.l1ovpqvx");
        console.log("🚀 ~ Buttons found:", buttons);
        let clicked = false;
        buttons.forEach((button) => {
          // Check if the button contains the text "Refresh"
          if (button.innerText.includes("Refresh")) {
            // Ensure the button is enabled
            if (!button.disabled && !button.getAttribute("aria-disabled")) {
              // Scroll the button into view
              button.scrollIntoView({ behavior: "smooth", block: "center" });
              // Simulate a more realistic user interaction
              const rect = button.getBoundingClientRect();
              const clickEvent = new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2,
              });
              // Dispatch the click event
              button.dispatchEvent(clickEvent);
              clicked = true;
              console.log("🚀 Refresh button clicked successfully.");
            } else {
              console.log("🚀 Refresh button is disabled or not clickable.");
            }
          }
        });
        return clicked;
      });
      if (refreshClicked) {
        console.log(
          "Refresh button clicked successfully using enhanced simulation."
        );
      } else {
        console.log("Failed to click the Refresh button, no action taken.");
        throw new Error("Refresh button not found or could not be clicked.");
      }
      // Wait for the page to update or any indication of completion
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Adjust this timeout based on expected action delay
    } catch (refreshError) {
      console.error("Error clicking the Refresh button:", refreshError);
      return res.json(
        { message: "Error clicking the Refresh button." },
        { status: 500 }
      );
    }
    // Close the browser
    await browser.close();

    // Return a successful response
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
