const express = require("express");
const hbs = require("hbs");

const app = express();

// app.set("view engine", "hbs");
// app.set("views", path.join(__dirname, "../views"));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello");
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})
