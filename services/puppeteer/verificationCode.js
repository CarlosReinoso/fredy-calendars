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

  let code;
  
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} to receive verification code.`);

      code = await Promise.race([
        waitForCodeFromAPI(page, res),
        timeout(30000, "Timed out waiting for verification code."),
      ]);

      if (code) {
        console.log(`Success: Received verification code on attempt ${attempt + 1}: ${code}`);
        break;
      }

    } catch (error) {
      console.log(error.message);

      if (error.message.includes("Timed out")) {
        console.log("Verification code not received, clicking 'Send again' button...");

        const sendAgainClicked = await clickSendAgainButton(page);

        if (sendAgainClicked) {
          console.log("Clicked 'Send again' button. Waiting for another 30 seconds...");
          await delay(3000); // Give it a few seconds before retrying
        } else {
          console.log("'Send again' button not found or couldn't be clicked.");
        }
      } else {
        console.error("Error waiting for code:", error);
        await handleError(page, error, res, "Error during entering code");
        return;
      }
    }
  }

  if (code) {
    const codeDigits = code.split("");

    try {
      const result = await page.evaluate((digits) => {
        const messages = [];
        digits.forEach((digit, index) => {
          const input = document.querySelector(`#airlock-code-input_codeinput_${index}`);
          if (input) {
            input.value = digit;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            messages.push(`Entered digit ${digit} into input field ${index + 1}.`);
          } else {
            messages.push(`Input field ${index + 1} not found.`);
          }
        });
        return messages;
      }, codeDigits);

      console.log("Verification Code Entry Results:", result.join("\n"));
      await delay(3000);
    } catch (error) {
      await handleError(page, error, res, "Error during entering code");
    }
  } else {
    console.log("Failed to receive verification code after 2 attempts.");
    await handleError(page, "No verification code received", res, "Error during entering code");
  }
}

async function clickSendAgainButton(page) {
  try {
    const result = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const sendAgainButton = buttons.find((button) =>
        button.textContent.includes("Send again")
      );

      if (
        sendAgainButton &&
        !sendAgainButton.disabled &&
        !sendAgainButton.getAttribute("aria-disabled")
      ) {
        sendAgainButton.click();
        return true; // Button clicked
      }
      return false; // Button not found or not clickable
    });

    return result;
  } catch (error) {
    console.error("Error clicking 'Send again' button:", error);
    return false;
  }
}

module.exports = {
  enterCodeApi,
  waitForCodeFromAPI,
  enterVerificationCode,
};
