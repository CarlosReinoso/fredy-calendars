const express = require("express");
const path = require("path");
const app = express();
const routes = require("./routes/index.js"); // Adjust path as necessary

app.use(express.json()); // Middleware to parse JSON bodies

// Serve static files from the "ui" folder
app.use(express.static(path.join(__dirname, 'ui')));

// Use the API route
app.use("/api", routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
