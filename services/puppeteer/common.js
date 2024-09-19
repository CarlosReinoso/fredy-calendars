const { handleError } = require("../../util/errorHandler");

async function clickButtonByText(page, res, buttonText) {
  try {
    const result = await page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const targetButton = buttons.find((button) =>
        button.textContent.includes(text)
      );

      if (targetButton) {
        if (
          !targetButton.disabled &&
          !targetButton.getAttribute("aria-disabled")
        ) {
          targetButton.click();
          return true;
        } else {
          return false;
        }
      } else {
        console.log(`Button with text "${text}" not found.`);
        return false;
      }
    }, buttonText);

    if (result) {
      console.log(`Success: Button with text "${buttonText}" was clicked.`);
      return result; // Successful click
    } else {
      throw new Error(
        `Failed: Button with text "${buttonText}" was not clicked.`
      );
    }
  } catch (error) {
    await handleError(
      page,
      error,
      res,
      `Error while trying to click button with text '${buttonText}':`
    );
  }
}

module.exports = {
  clickButtonByText,
};
