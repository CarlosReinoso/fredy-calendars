const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const routes = require("../routes/index");

app.use(cors());

app.use(express.json()); // Middleware to parse JSON bodies

// Serve static files from the "ui" folder
app.use(express.static(path.join(__dirname, "../ui")));

// Use the API route
app.use("/api", routes);

app.get("/test", function (req, res) {
  res.status(200).json({ hello: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
