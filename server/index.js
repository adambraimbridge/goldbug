const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/favicons", express.static(path.join(__dirname, "favicons")));
app.use("/", express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Run
app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
