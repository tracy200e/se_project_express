// import express & mongoose
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

// instantiate the express application & set up the port environment
const app = express();
const { PORT = 3001 } = process.env;

// connect to the WTWR MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
