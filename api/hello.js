import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  let browser = null;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    console.log('Browser launched successfully');
    // Rest of your code...
  } catch (error) {
    console.error('Error launching browser:', error);
    res.status(500).json({ error: 'Failed to launch browser' });
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}