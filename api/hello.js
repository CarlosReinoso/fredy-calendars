console.log("meta above", process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD);
console.log(
  "AWS_LAMBDA_FUNCTION_VERSION",
  process.env.AWS_LAMBDA_FUNCTION_VERSION
);

module.exports = async (req, res) => {
  try {
    console.log("meta", process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD);
    console.log(
      "AWS_LAMBDA_FUNCTION_VERSION",
      process.env.AWS_LAMBDA_FUNCTION_VERSION
    );

    res.statusCode = 200;
    res.setHeader("Content-Type", `application/json`);
    res.end(JSON.stringify({ hello: true }));
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.json({
      error: err.toString(),
    });
    res.end();
  }
};
