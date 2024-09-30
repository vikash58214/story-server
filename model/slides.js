const mongoose = require("mongoose");

const storySlideSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const storySchema = new mongoose.Schema({
  slides: {
    type: [storySlideSchema],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
