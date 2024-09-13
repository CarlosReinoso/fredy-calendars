const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

module.exports = async (req, res) => {
  console.log("Launching browser hello...");
  try {
    const url = req.query.url;

    // Launch Puppeteer with @sparticuz/chromium
    const browser = await puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(), // Make sure to use the function call here
      headless: chromium.headless, // Specify headless mode if needed
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.goto(url);

    // Extract meta tags data from the page
    const metaData = await page.evaluate(() => {
      const data = {};
      const metaTags = document.querySelectorAll("meta");
      metaTags.forEach((tag, i) => {
        const key = tag.getAttribute("name")
          ? tag.getAttribute("name")
          : tag.getAttribute("property")
          ? tag.getAttribute("property")
          : tag.getAttribute("http-equiv")
          ? tag.getAttribute("http-equiv")
          : tag.getAttribute("itemprop");
        tag.getAttribute("charset")
          ? (data["charset"] = tag.getAttribute("charset"))
          : (data[key == null ? i : key] = tag.getAttribute("content"));
      });
      return data;
    });

    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `application/json`);
    res.end(JSON.stringify(metaData));
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
    res.end();
  }
};
