const PouchDB = require("pouchdb");
const express = require("express");
const app = express();

app.use("/db", require("express-pouchdb")(PouchDB));
app.use("/", require("")

const $port = process.env.PORT || 3000;
app.listen($port, () => {
  console.log(`Running on http://localhost:${process.env.PORT}`);
});
