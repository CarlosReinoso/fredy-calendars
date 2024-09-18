const { delay } = require("../../util");
const { handleError } = require("../../util/errorHandler");

const email = process.env.LODGIFY_LOGIN;
console.log("🚀 ~ module.exports= ~ email:", email);
const password = process.env.LODGIFY_PASSWORD;
console.log("🚀 ~ module.exports= ~ password:", password);

async function loginToLodgify(page, res) {
  try {
    await page.waitForSelector('input[type="email"]', { visible: true });
    await page.type('input[type="email"]', email, { delay: 100 });
    await page.keyboard.press("Enter");

    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', password, { delay: 100 });
    await page.keyboard.press("Enter");
    await delay(5000);
    console.log("Logged into Lodgify successfully.");
  } catch (error) {
    await handleError(page, error, res, "Error during Lodgify login");
  }
}

module.exports = {
  loginToLodgify,
};
