const express = require("express");
const Story = require("../model/slides");
const User = require("../model/user");
const slideRouter = express.Router();

slideRouter.post("/addStory", async (req, res) => {
  const { slides, category, userID } = req.body;
  try {
    const newStory = new Story({
      slides,
      category,
      userID,
    });
    await newStory.save();

    res.json({ message: "Story added successfully", story: newStory });
  } catch (error) {
    res.json({ message: "Server error", error });
  }
});

slideRouter.get("/getUserStory/:userID", async (req, res) => {
  try {
    const userID = req.params.userID;
    const userStories = await Story.find({ userID });
    res.json(userStories);
  } catch (error) {
    res.json(error);
  }
});

slideRouter.get("/getStory", async (req, res) => {
  try {
    const stories = await Story.find();
    res.json(stories);
  } catch (error) {
    res.json(error);
  }
});

slideRouter.get("/fetchStory/:storyId", async (req, res) => {
  const { storyId } = req.params;
  try {
    const story = await Story.findById(storyId);
    res.json(story);
  } catch (error) {
    res.json(error);
  }
});

slideRouter.post("/save-story", async (req, res) => {
  const { userId, storyId } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storyIndex = user.savedStories.indexOf(storyId);

    if (storyIndex !== -1) {
      user.savedStories.splice(storyIndex, 1);
      await user.save();
      return res.json({ message: "unsaved" });
    }

    user.savedStories.push(storyId);
    await user.save();

    res.json({ message: "saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

slideRouter.get("/saved-stories/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedSlides = await Story.aggregate([
      { $unwind: "$slides" },
      { $match: { "slides._id": { $in: user.savedStories } } },
      { $project: { slides: 1, category: 1 } },
    ]);

    res.status(200).json({ savedSlides });
  } catch (error) {
    console.error("Error fetching saved slides:", error);
    res.status(500).json({ message: "Server error" });
  }
});

slideRouter.post("/like/:postID", async (req, res) => {
  const { userID, index } = req.body;
  const { postID } = req.params;
  try {
    const post = await Story.findById(postID);
    if (!post) return res.json({ message: "failed" });

    const slide = post.slides[index];
    const userLikeIndex = slide.likes.indexOf(userID);

    if (userLikeIndex !== -1) {
      slide.likes.splice(userLikeIndex, 1);
      await post.save();
      return res.json({ message: "unliked" });
    } else {
      slide.likes.push(userID);
      await post.save();
      return res.json({ message: "liked" });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
});

slideRouter.put("/update/:storyId", async (req, res) => {
  const storyId = req.params.storyId;
  const { category, slides } = req.body;

  try {
    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { category, slides },
      { new: true }
    );

    if (!updatedStory) {
      return res.json({ message: "story not found" });
    }

    res.json({ message: "success" });
  } catch (error) {
    res.json(error);
  }
});

slideRouter.get("/story/slide/:slideID", async (req, res) => {
  const { slideID } = req.params;

  try {
    const story = await Story.findOne(
      { "slides._id": slideID },
      { "slides.$": 1 }
    );

    if (story && story.slides.length > 0) {
      return res.status(200).json(story.slides[0]);
    } else {
      return res.status(404).json({ message: "Slide not found" });
    }
  } catch (error) {
    console.error("Error fetching slide by slideId:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = slideRouter;
