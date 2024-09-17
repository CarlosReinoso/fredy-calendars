const { default: axios } = require("axios");
const { isProd, apiBaseUrl } = require("../../util/isProd");

const enterCodeApi = isProd
  ? `${apiBaseUrl}/api/enter-code`
  : "http://localhost:3001/api/enter-code";

async function waitForCodeFromAPI() {
  try {
    while (true) {
      const response = await axios.get(enterCodeApi);

      if (response.data.code) {
        // Clear the server-side stored code to free memory
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
module.exports = {
  enterCodeApi,
  waitForCodeFromAPI,
};
