const mongoose = require("mongoose");

const userModel = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  savedStories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Story" }],
});

const User = mongoose.model("User", userModel);
module.exports = User;
