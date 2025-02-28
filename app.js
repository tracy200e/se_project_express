// import dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mainRouter = require("./routes/index");

const errorHandler = require("./middlewares/error-handler");

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

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
