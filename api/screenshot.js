const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  const url = req.query.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const file = await page.screenshot({
    type: "png",
  });
  await browser.close();

  res.statusCode = 200;
  res.setHeader("Content-Type", `image/png`);
  res.end(file);
};
