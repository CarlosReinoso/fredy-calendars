// Import required modules
const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

// Function to get Puppeteer options based on the environment
async function getOptions(isDev) {
  let options;

  if (isDev) {
    // Set the path to Chrome executable based on the local OS
    const executablePath =
      process.platform === 'win32'
        ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        : process.platform === 'linux'
        ? '/usr/bin/google-chrome'
        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

    options = {
      args: [],
      executablePath,
      headless: true,
    };
  } else {
    // Options for serverless environments using chrome-aws-lambda
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }

  return options;
}

// Exported API function
module.exports = async (req, res) => {
  const pageToScreenshot = req.query.page; // URL to screenshot
  const isDev = req.query.isDev === 'true'; // Set isDev to true when testing locally

  // Ensure the URL is valid and secure
  if (!pageToScreenshot || !pageToScreenshot.startsWith('https://')) {
    res.status(400).json({
      error: 'Invalid URL. Make sure to include https:// in the URL parameter.',
    });
    return;
  }

  try {
    // Get Puppeteer options for the environment
    const options = await getOptions(isDev);
    // Launch the browser with the specified options
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    // Set the viewport size
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    // Navigate to the specified URL
    await page.goto(pageToScreenshot, { waitUntil: 'networkidle2' });

    // Capture the screenshot
    const screenshot = await page.screenshot({ type: 'png' });

    // Close the browser
    await browser.close();

    // Set the response headers and send the screenshot
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(screenshot);
  } catch (error) {
    console.error('Error taking screenshot:', error);
    res.status(500).json({ error: 'Failed to take screenshot.' });
  }
};
