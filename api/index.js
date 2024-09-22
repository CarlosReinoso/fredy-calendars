const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const routes = require("../routes/index");

app.use(cors());

app.use(express.json());

app.use("/api", routes);
app.use(express.static(path.join(__dirname, "../ui")));


app.get("/", function (req, res) {
  res.status(200).json({ hello: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Node server running on port ${PORT}`);
});
