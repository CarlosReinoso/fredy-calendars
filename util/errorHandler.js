// util/errorHandler.js

const fs = require('fs');
const path = require('path');
const os = require('os'); // Import the os module to get the temp directory

// Error handling function
async function handleError(page, error, res, errorMessage = "An error occurred") {
  try {
    // Use os.tmpdir() to get the appropriate temp directory for the current OS
    const screenshotPath = path.join(os.tmpdir(), 'screenshot.png'); // Use a cross-platform temp path
    console.log("🚀 ~ handleError ~ screenshotPath:", screenshotPath);

    // Capture a screenshot for debugging
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log("Screenshot taken for debugging.");

    // Read the screenshot file
    const screenshot = fs.readFileSync(screenshotPath);
    console.log("🚀 ~ handleError ~ screenshot:", screenshot);

    // Log the error message
    console.error(`${errorMessage}:`, error);

    // Set response headers and send the screenshot as an image
    res.setHeader("Content-Type", "image/png");
    res.status(500);
    res.send(screenshot); // Directly send the raw image data
  } catch (screenshotError) {
    // Handle errors that occur during screenshot capture or logging
    console.error("Failed to capture screenshot or send response:", screenshotError);
    res.status(500).json({
      message: "Failed to capture screenshot during error handling.",
      error: screenshotError.message,
    });
  } finally {
    // Close the browser to ensure cleanup
    if (page.browser()) await page.browser().close();
  }
}

module.exports = handleError;
