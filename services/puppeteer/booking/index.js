const { delay } = require("../../../util");
const { handleError, sendPageHTML } = require("../../../util/errorHandler");
const { clickButtonByText } = require("../common");

const email = process.env.BOOKING_LOGIN;
const password = process.env.BOOKING_PASSWORD;

async function loginToBooking(page, res) {
  try {
    await page.waitForSelector('input[name="loginname"]', { visible: true });
    await page.type('input[name="loginname"]', email, { delay: 100 });
    await page.click('button[type="submit"]');

    await delay(3000);
    console.log("Username filled and clicked");
  } catch (error) {
    await handleError(
      page,
      error,
      res,
      "Error during Username and 'Next' button"
    );
  }

  try {
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', password, { delay: 100 });
    await page.click('button[type="submit"]');
    console.log("Filled in password and click 'Sign in'");
    await delay(3000);

    const isBotCheckPresent = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes("Are you a robot?");
    });

    if (isBotCheckPresent) {
      await pressAndHoldButton(page, res);
    } else {
      console.log("isBotCheckPresent:", isBotCheckPresent);
    }
  } catch (error) {
    await handleError(
      page,
      error,
      res,
      "Error during Username and 'Next' button"
    );
  }
}
async function pressAndHoldButton(page, res) {
  console.log('Bot check detected. Handling "Press and hold"...');

  //   const formContent = await page.evaluate(() => {
  //     const formElement = document.querySelector("form.nw-signin"); // Target the form element by class
  //     if (formElement) {
  //       return formElement.outerHTML; // Log the full form HTML
  //     } else {
  //       return "Form not found.";
  //     }
  //   });

  //   console.log("🚀 ~ Form content: ", formContent);
//   await delay(10000);
  //   const buttonHTML = await page.evaluate(() => {
  //     // Check if the "Press and Hold" button is present in the DOM
  //     const buttons = Array.from(document.querySelectorAll("button"));
  //     const pressAndHoldButton = buttons.find((button) =>
  //       button.textContent.includes("Press and hold")
  //     );

  //     if (pressAndHoldButton) {
  //       // Return the outerHTML of the button
  //       return pressAndHoldButton.outerHTML;
  //     } else {
  //       return "Button not found";
  //     }
  //   });

  //   // Log the button's HTML
  //   console.log("🚀 ~ Press and hold button HTML: ", buttonHTML);

  //   // Option: Using page.evaluate() to find the iframe and interact with it
  //   const result1 = await page.evaluate(() => {
  //     // Find the iframe in the DOM based on the title attribute
  //     const iframe = document.querySelector(
  //       'iframe[title="Human verification challenge"]'
  //     );

  //     if (iframe) {
  //       // Access the iframe content
  //       const iframeDocument =
  //         iframe.contentDocument || iframe.contentWindow.document;

  //       // Search for the button inside the iframe
  //       const buttons = Array.from(iframeDocument.querySelectorAll("button"));
  //       const pressAndHoldButton = buttons.find((button) =>
  //         button.textContent.includes("Press and hold")
  //       );

  //       if (pressAndHoldButton) {
  //         pressAndHoldButton.click(); // Optionally click the button
  //         return pressAndHoldButton.outerHTML; // Return the outerHTML of the button
  //       } else {
  //         return "Button not found inside iframe";
  //       }
  //     } else {
  //       return "Iframe not found";
  //     }
  //   });

  //   console.log("🚀 ~ Result1:", result1);

  const result = await page.evaluate(() => {
    // Get all iframes in the DOM
    const iframes = Array.from(document.querySelectorAll("iframe"));

    if (iframes.length > 0) {
      // Map through all iframes and return their outerHTML or attributes for logging
      return iframes.map((iframe) => {
        return {
          title: iframe.getAttribute("title"),
          src: iframe.getAttribute("src"),
          outerHTML: iframe.outerHTML, // You can log more attributes if needed
        };
      });
    } else {
      return "No iframes found";
    }
  });

  console.log("🚀 ~ Iframes in the DOM:", result);

  try {
    console.log("Pressing and holding the button...");
    // Use page.evaluate to inspect the DOM and log the button

    await page.evaluate(() => {
      const btn = document.querySelector('button[type="button"]');
      console.log("🚀 ~ awaitpage.evaluate ~ btn:", btn);

      const mouseDownEvent = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      });
      btn.dispatchEvent(mouseDownEvent);

      setTimeout(() => {
        const mouseUpEvent = new MouseEvent("mouseup", {
          bubbles: true,
          cancelable: true,
        });
        btn.dispatchEvent(mouseUpEvent);
        console.log("Released the button.");
      }, 10000);
    });
  } catch (error) {
    await handleError(page, error, res, "Error failed bot check");
  }
}

async function clickSyncButton(page, res) {
  try {
    await clickButtonByText(page, res, "Refresh connection");
    await delay(3000);
  } catch (error) {
    await handleError(
      page,
      error,
      res,
      "Error with clicking 'Refresh connection'"
    );
  }
}

module.exports = {
  loginToBooking,
  clickSyncButton,
};
