const express = require("express");
const router = express.Router();

let currentRequestResolver = null;
console.log("🚀 ~ currentRequestResolver:", currentRequestResolver);
let verificationCode = null;
console.log("🚀 ~ verificationCode:", verificationCode);

// POST route to handle code submission
router.post("/enter-code", (req, res) => {
  const { code, waiting, clear } = req.body;
  console.log("🚀 ~ router.post ~ clear:", clear)
  console.log("🚀 ~ router.post ~ waiting:", waiting);
  console.log("🚀 ~ router.post ~ code:", code);

  if (clear) {
    // Clear the stored code and resolver
    verificationCode = null;
    currentRequestResolver = null;
    return res.status(200).json({ message: "Verification code cleared." });
  }

  // If `waiting` is true, set up a resolver for later use
  if (waiting) {
    currentRequestResolver = (receivedCode) => {
      verificationCode = receivedCode; // Store the code temporarily
      console.log(
        "🚀 ~ router.post ~ verificationCode:// Store the code temporarily ",
        verificationCode
      );
      currentRequestResolver = null; // Clear resolver after use
    };
    return res.status(202).json({ message: "waitinging for code..." });
  }

  // If the code is being submitted and the resolver is set, resolve it
  if (code && currentRequestResolver) {
    currentRequestResolver(code);
    res.status(200).json({ message: "Code received successfully." });
  } else if (code) {
    // Directly process the code if no resolver is waitinging (fallback)
    verificationCode = code;
    res
      .status(200)
      .json({ message: "Code received without waitinging process." });
  } else {
    res.status(400).json({ error: "Verification code is required." });
  }
});

// GET route to check if the code is available
router.get("/enter-code", (req, res) => {
  if (verificationCode) {
    res.status(200).json({ code: verificationCode });
    verificationCode = null; // Clear the code once it has been used
  } else {
    res.status(202).json({ message: "No code available yet." }); // Using 202 to indicate ongoing process
  }
});

module.exports = router;
