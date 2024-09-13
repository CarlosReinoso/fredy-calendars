const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

module.exports = async function (req, res) {
  let browser = null;
  try {
    console.log("Launching browser...");
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    console.log("Browser launched successfully");

    const page = await browser.newPage();

    // Go to the Airbnb login page
    await page.goto("https://www.airbnb.com/login", {
      waitUntil: "networkidle2",
    });

    // Click the "Continue with email" button
    // try {
    //   await page.waitForSelector('button[aria-label="Continue with email"]', {
    //     visible: true,
    //     timeout: 10000,
    //   });
    //   await page.click('button[aria-label="Continue with email"]');
    //   console.log("Clicked 'Continue with email' button.");
    // } catch (clickError) {
    //   console.error("Error clicking 'Continue with email' button:", clickError);
    //   await browser.close();
    //   res.statusCode = 500;
    //   return res.json({
    //     message: "Failed to click 'Continue with email' button.",
    //   });
    // }

    // // Replace with your Airbnb credentials
    // const email = process.env.AIRBNB_LOGIN;
    // const password = process.env.AIRBNB_PASSWORD;

    // // Log in to Airbnb with email
    // try {
    //   await page.waitForSelector('input[type="email"]', {
    //     visible: true,
    //     timeout: 10000,
    //   });
    //   await page.type('input[type="email"]', email);
    //   await page.waitForSelector('button[data-veloute="submit-btn-cypress"]', {
    //     visible: true,
    //     timeout: 10000,
    //   });
    //   await page.evaluate(() => {
    //     const button = document.querySelector(
    //       'button[data-veloute="submit-btn-cypress"]'
    //     );
    //     if (button) {
    //       button.scrollIntoView();
    //       button.focus();
    //       button.click();
    //     }
    //   });
    //   console.log("Clicked 'Continue' button using JavaScript evaluate.");
    //   await page.waitForSelector('input[type="password"]', {
    //     visible: true,
    //     timeout: 10000,
    //   });
    //   await page.type('input[type="password"]', password);
    //   await page.waitForSelector('button[type="submit"]', {
    //     visible: true,
    //     timeout: 10000,
    //   });
    //   await page.click('button[type="submit"]');
    //   console.log("Clicked login button.");
    //   await page.waitForNavigation({ waitUntil: "networkidle2" });
    // } catch (loginError) {
    //   console.error("Error during login:", loginError);
    //   await browser.close();
    //   res.statusCode = 500;
    //   return res.json({
    //     message: "Login failed, please check your credentials and selectors.",
    //   });
    // }

    // // Navigate to the calendar page after successful login
    // await page.goto(
    //   "https://www.airbnb.co.uk/multicalendar/1228348447908449096/availability-settings/",
    //   { waitUntil: "networkidle2" }
    // );

    // // Scroll down to ensure all content is loaded
    // await page.evaluate(async () => {
    //   await new Promise((resolve) => {
    //     const scrollInterval = setInterval(() => {
    //       window.scrollBy(0, window.innerHeight);
    //       if (
    //         window.scrollY + window.innerHeight >=
    //         document.body.scrollHeight
    //       ) {
    //         clearInterval(scrollInterval);
    //         resolve();
    //       }
    //     }, 200); // Adjust this interval to control the scroll speed
    //   });
    // });

    // // Wait a moment after scrolling to ensure elements have settled
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // Use a native delay

    // try {
    //   console.log("🚀 Attempting to click the Refresh button...");
    //   // Use page.evaluate to find the button and simulate a more realistic click
    //   const refreshClicked = await page.evaluate(() => {
    //     // Locate the button by class name
    //     const buttons = document.querySelectorAll("button.l1ovpqvx");
    //     console.log("🚀 ~ Buttons found:", buttons);
    //     let clicked = false;
    //     buttons.forEach((button) => {
    //       // Check if the button contains the text "Refresh"
    //       if (button.innerText.includes("Refresh")) {
    //         // Ensure the button is enabled
    //         if (!button.disabled && !button.getAttribute("aria-disabled")) {
    //           // Scroll the button into view
    //           button.scrollIntoView({ behavior: "smooth", block: "center" });
    //           // Simulate a more realistic user interaction
    //           const rect = button.getBoundingClientRect();
    //           const clickEvent = new MouseEvent("click", {
    //             bubbles: true,
    //             cancelable: true,
    //             view: window,
    //             clientX: rect.left + rect.width / 2,
    //             clientY: rect.top + rect.height / 2,
    //           });
    //           // Dispatch the click event
    //           button.dispatchEvent(clickEvent);
    //           clicked = true;
    //           console.log("🚀 Refresh button clicked successfully.");
    //         } else {
    //           console.log("🚀 Refresh button is disabled or not clickable.");
    //         }
    //       }
    //     });
    //     return clicked;
    //   });

    //   if (refreshClicked) {
    //     console.log(
    //       "Refresh button clicked successfully using enhanced simulation."
    //     );
    //   } else {
    //     console.log("Failed to click the Refresh button, no action taken.");
    //     throw new Error("Refresh button not found or could not be clicked.");
    //   }

    //   // Wait for the page to update or any indication of completion
    //   await new Promise((resolve) => setTimeout(resolve, 3000)); // Adjust this timeout based on expected action delay
    // } catch (refreshError) {
    //   console.error("Error clicking the Refresh button:", refreshError);
    //   res.statusCode = 500;
    //   return res.json({
    //     message: "Error clicking the Refresh button.",
    //   });
    // }

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
