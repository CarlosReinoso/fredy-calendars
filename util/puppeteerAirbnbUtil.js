const { handleError } = require("./errorHandler");
const { delay } = require("../util/index");

const email = process.env.AIRBNB_LOGIN;
const password = process.env.AIRBNB_PASSWORD;

async function airbnbLoginPage(page) {
  await page.goto("https://www.airbnb.com/login", {
    waitUntil: "networkidle2",
  });
  console.log("at: https://www.airbnb.com/login");
}
async function emailLoginMethod(page, res) {
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
}
async function emailTypeAndClick(page, res) {
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
    await delay(5000);
  } catch (error) {
    await handleError(page, error, res, "Error during login in EMAIL page");
  }
}
async function typePasswordAndClickLogin(page, res) {
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
    await delay(5000);
  } catch (error) {
    await handleError(page, error, res, "Error clicking the Log In button:");
  }
}
async function handle2AuthModal(page) {
  // Check if the pop-up appeared by looking for a specific element
  const popupAppeared = await page.evaluate(() => {
    return !!document.querySelector('[data-testid="modal-container"]'); // Modify with actual selector of your pop-up
  });

  if (popupAppeared) {
    console.log("Pop-up detected. Proceeding to handle it.");
    // You can add logic here if the pop-up needs specific handling
    return true;
  } else {
    console.log("No pop-up detected, continuing...");
    return false;
  }
}

async function clickSmsButton(page, res) {
  try {
    const hasSmsButton = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const smsButton = buttons.find((button) =>
        button.textContent.includes("Text message (SMS)")
      );

      if (smsButton) {
        smsButton.click();
        return "Clicked the 'Text message (SMS)' button."; // Return the success message
      } else {
        return "SMS button not found."; // Return the failure message
      }
    });

    console.log(hasSmsButton);
    return hasSmsButton;
  } catch (error) {
    await handleError(page, error, res, "Error during clicking sms button");
  }
}

async function clickAllRefreshButtons(page, res) {
  try {
    const result = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const refreshButtons = buttons.filter((button) =>
        button.textContent.includes("Refresh")
      );

      const messages = [];

      refreshButtons.forEach((refreshButton, index) => {
        if (
          !refreshButton.disabled &&
          !refreshButton.getAttribute("aria-disabled")
        ) {
          refreshButton.click();
          messages.push(
            `Clicked the 'Refresh' button ${index + 1} successfully.`
          );
        } else {
          messages.push(
            `Refresh button ${
              index + 1
            } is disabled, not clickable, or not found.`
          );
        }
      });

      return messages;
    });

    console.log(result.join("\n"));
    return result;
  } catch (error) {
    await handleError(page, error, res, "Error clicking the Refresh buttons");
  }
}

module.exports = {
  airbnbLoginPage,
  emailLoginMethod,
  emailTypeAndClick,
  typePasswordAndClickLogin,
  handle2AuthModal,
  clickSmsButton,
  clickAllRefreshButtons,
};
