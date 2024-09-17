const { handleError } = require("./errorHandler");
const { delay } = require("../util/index");

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

async function clickSmsButton(page) {
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

async function clickRefreshBtn(page) {
  try {
    const result = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const refreshButton = buttons.find((button) =>
        button.textContent.includes("Refresh")
      );

      if (refreshButton && !refreshButton.disabled && !refreshButton.getAttribute("aria-disabled")) {
        refreshButton.click();
        return "Clicked the 'Refresh' button successfully."; // Return the success message
      } else {
        return "Refresh button is disabled, not clickable, or not found."; // Return the failure message
      }
    });

    console.log(result);
    return result;
  } catch (error) {
    await handleError(page, error, res, "Error clicking the Refresh button");
  }
}


module.exports = {
  handle2AuthModal,
  clickSmsButton,
  clickRefreshBtn,
};
