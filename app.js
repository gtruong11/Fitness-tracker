require("dotenv").config()
const express = require("express")
const app = express()
const router = require("./api")
const morgan = require("morgan")

// Setup your Middleware and API Router here
app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});


app.use("/api", router)

module.exports = app;
