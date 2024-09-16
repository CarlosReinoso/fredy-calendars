const handleError = require("./errorHandler");

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

// Function to find and click the SMS button
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
    console.error("Error handling verification pop-up:", error);
    await handleError(page, error, res, "Error during account verification:");
  }
}

module.exports = {
  handle2AuthModal,
  clickSmsButton,
};
