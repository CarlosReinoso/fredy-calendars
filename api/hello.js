const fs = require("fs");
const handleError = require("../util/errorHandler");
const { isProd } = require("../util/isProd");

const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-extra").use(
  require("puppeteer-extra-plugin-stealth")()
);

const UserPreferencesPlugin = require("puppeteer-extra-plugin-user-preferences");
const UserDataDirPlugin = require("puppeteer-extra-plugin-user-data-dir");
const { logNodeModules } = require("../util/hasPaths");
const { delay } = require("../util");

puppeteer.use(UserPreferencesPlugin());
puppeteer.use(UserDataDirPlugin());
puppeteer.launcher = require("puppeteer-core");

const email = process.env.AIRBNB_LOGIN;
const password = process.env.AIRBNB_PASSWORD;
console.log("🚀 ~ password:", password);

module.exports = async (req, res) => {
  logNodeModules();
  console.log(
    "Launching Puppeteer with the following path:",
    await chromium.executablePath()
  );

  let browser = null;
  try {
    console.log("Launching browser...");

    browser = await puppeteer.launch({
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

      await new Promise((resolve) => setTimeout(resolve, 5000));

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

    await new Promise((resolve) => setTimeout(resolve, 5000));

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

    // Navigate to the calendar page after successful login
    await delay(5000);
    
    try {
      // Log the page content when the verification prompt appears
      const pageContent = await page.content();

      // Send the HTML content as a response so you can view it in the browser
      res.setHeader("Content-Type", "text/html"); // Set content type to HTML for better rendering
      return res.send(pageContent); // Send the full page content
    } catch (error) {
      console.error("Error capturing page content:", error);
      res.statusCode = 500;
      return res.json({
        message: "Error capturing page content",
        error,
      });
    }

    await handleError(
      page,
      "error",
      res,
      "https://www.airbnb.co.uk/multicalendar/1228348447908449096/availability-settings/"
    );
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

    await new Promise((resolve) => setTimeout(resolve, 2000));

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
