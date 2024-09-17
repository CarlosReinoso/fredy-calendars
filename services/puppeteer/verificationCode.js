const { default: axios } = require("axios");
const { isProd, apiBaseUrl } = require("../../util/isProd");
const { handleError } = require("../../util/errorHandler");

const enterCodeApi = isProd
  ? `${apiBaseUrl}/api/enter-code`
  : "http://localhost:3001/api/enter-code";

async function waitForCodeFromAPI() {
  try {
    while (true) {
      const response = await axios.get(enterCodeApi);

      if (response.data.code) {
        await clearCodeFromServer(enterCodeApi);
        return response.data.code;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error("Error while fetching the code from API:", error);
    throw new Error("Failed to fetch the verification code.");
  }
}

async function clearCodeFromServer(enterCodeApi) {
  try {
    await axios.post(enterCodeApi, { clear: true });
  } catch (error) {
    console.error("Error clearing the verification code on the server:", error);
  }
}

async function enterVerificationCode(page) {
  await axios.post(enterCodeApi, { waiting: true });

  const code = await Promise.race([
    waitForCodeFromAPI(),
    timeout(30000, "Timed out waiting for verification code."),
  ]);

  try {
    const codeDigits = code.split("");

    const result = await page.evaluate((digits) => {
      digits.forEach(async (digit, index) => {
        const input = document.querySelector(
          `#airlock-code-input_codeinput_${index}`
        );
        if (input) {
          input.value = digit;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          await handleError(page, error, res, "No input fields found");
        }
      });
    }, codeDigits);

    console.log("enterVerificationCode", result);
    return result;
  } catch (error) {
    await handleError(page, error, res, "Error during entering code");
  }
}

module.exports = {
  enterCodeApi,
  waitForCodeFromAPI,
  enterVerificationCode,
};
