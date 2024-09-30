const express = require("express");
const userRouter = require("./router/user");
const cors = require("cors");
const mongoose = require("mongoose");
const slideRouter = require("./router/slides");
const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(slideRouter);

mongoose
  .connect(
    "mongodb+srv://vikash5821:vsH582146@storyapp.agcit.mongodb.net/story?retryWrites=true&w=majority&appName=storyApp"
  )
  .then(() => {
    console.log("connected to DB");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(5000, () => {
  console.log("server is running ");
});
