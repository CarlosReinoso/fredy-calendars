const fs = require("fs");
const path = require("path");
const os = require("os");

async function handleError(
  page,
  error,
  res,
  errorMessage = "An error occurred"
) {
  try {
    const screenshot = await takeSreenshot(page);
    console.error(errorMessage, error);

    res.setHeader("Content-Type", "image/png");
    res.status(500);
    res.send(screenshot);
    // await sendPageHTML(page, res);
  } catch (screenshotError) {
    console.error(
      "Failed to capture screenshot or send response:",
      screenshotError
    );
    res.status(500).json({
      message: "Failed to capture screenshot during error handling.",
      error: screenshotError.message,
    });
  } finally {
    if (page.browser()) await page.browser().close();
  }
}

async function sendPageHTML(page, res) {
  try {
    const pageHTML = await page.content();

    console.log("Captured HTML content of the page.");

    res.setHeader("Content-Type", "text/html");

    return res.send(pageHTML);
  } catch (error) {
    console.error("Error capturing page HTML:", error);
    res.status(500).send("Failed to capture HTML content.");
  }
}

async function timeout(ms, errorMessage) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);
  });
}

async function takeSreenshot(page) {
  const screenshotPath = path.join(os.tmpdir(), `screenshot.png`);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log("Screenshot taken for debugging.");

  const screenshot = fs.readFileSync(screenshotPath);
  return screenshot;
}
async function consoleScreenshot(page, msg) {
  const screenshot = await takeSreenshot(page);
  const screenshotBase64 = screenshot.toString("base64");
  console.log(msg || "", screenshotBase64); // Log first 1000 characters for brevity
}

async function respondScreenshot(page, res, msg) {
  console.log("🚀 ~ respondScreenshot:", msg || "");
  const screenshot = await takeSreenshot(page);
  res.setHeader("Content-Type", "image/png");
  res.status(500);
  return res.send(screenshot);
}

module.exports = {
  handleError,
  sendPageHTML,
  timeout,
  consoleScreenshot,
  respondScreenshot,
};
