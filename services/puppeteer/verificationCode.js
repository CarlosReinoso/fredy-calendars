const { default: axios } = require("axios");
const { isProd, apiBaseUrl } = require("../../util/isProd");
const { handleError, timeout } = require("../../util/errorHandler");
const { delay } = require("../../util");

const enterCodeApi = isProd
  ? `${apiBaseUrl}/api/enter-code`
  : "http://localhost:3001/api/enter-code";

async function waitForCodeFromAPI(page, res) {
  try {
    while (true) {
      const response = await axios.get(enterCodeApi);

      if (response.data.code) {
        await clearCodeFromServer(enterCodeApi);
        return response.data.code;
      }
      await delay(1000);
    }
  } catch (error) {
    await handleError(
      page,
      error,
      res,
      "Error while fetching the code from API"
    );
  }
}

async function clearCodeFromServer(enterCodeApi) {
  try {
    await axios.post(enterCodeApi, { clear: true });
  } catch (error) {
    console.error("Error clearing the verification code on the server:", error);
  }
}

async function enterVerificationCode(page, res) {
  console.log("at enterVerificationCode");
  await axios.post(enterCodeApi, { waiting: true });
  await clickButtonByText(page, "Send again");
  await delay(5000);
  await handleError(page, "error", res, "TESTY");

  const code = await Promise.race([
    waitForCodeFromAPI(page, res),
    timeout(30000, "Timed out waiting for verification code."),
  ]);
  console.log(`Success: Received verification code from UI: ${code}`);

  try {
    const codeDigits = code.split("");

    const result = await page.evaluate((digits) => {
      const messages = [];
      digits.forEach((digit, index) => {
        const input = document.querySelector(
          `#airlock-code-input_codeinput_${index}`
        );
        if (input) {
          input.value = digit;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          messages.push(
            `Entered digit ${digit} into input field ${index + 1}.`
          );
        } else {
          messages.push(`Input field ${index + 1} not found.`);
        }
      });
      return messages;
    }, codeDigits);
    console.log("Verification Code Entry Results:", result.join("\n"));
    await delay(3000);
    await handleError(page, "error", res, "TESTY");
    // return result;
  } catch (error) {
    console.error("Error during entering verification code:", error);
    await handleError(page, error, res, "Error during entering code");
  }
}

async function clickButtonByText(page, buttonText) {
  try {
    const result = await page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const targetButton = buttons.find((button) =>
        button.textContent.includes(text)
      );

      if (
        targetButton &&
        !targetButton.disabled &&
        !targetButton.getAttribute("aria-disabled")
      ) {
        targetButton.click();
        return true; // Button clicked
      }
      return false; // Button not found or not clickable
    }, buttonText);

    return result;
  } catch (error) {
    console.error(`Error clicking button with text '${buttonText}':`, error);
    return false;
  }
}

module.exports = {
  enterCodeApi,
  waitForCodeFromAPI,
  enterVerificationCode,
};
