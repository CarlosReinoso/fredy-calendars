const fs = require("fs");
const path = require("path");

function logNodeModules() {
  const modulePath = path.resolve(
    "node_modules",
    "puppeteer-extra-plugin-user-preferences"
  );
  if (fs.existsSync(modulePath)) {
    console.log(`Module found at: ${modulePath}`);
  } else {
    console.error("Module not found at the expected path:", modulePath);
  }
  const modulesPath = path.resolve(
    __dirname,
    "..", // Move one level up to the project root
    "node_modules",
    "puppeteer-extra-plugin-stealth",
    "evasions"
  );
  console.log("🚀 ~ logNodeModules ~ modulesPath: evasions ");

  try {
    const files = fs.readdirSync(modulesPath);
    console.log("🚀 ~ logNodeModules ~ files:", !!files);
  } catch (error) {
    console.error("Error reading node_modules:", error);
  }
}

module.exports = {
  logNodeModules,
};
