const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const Post = require("../models/Post");

// @route GET api/posts/me
// @desc Get posts
// @access Private
router.get("/me", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.userId }).populate("user", ["username"]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route GET api/posts
// @desc Get posts
// @access Public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ publish: true }).populate("user", ["username"]);
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post("/", verifyToken, async (req, res) => {
  const { title, content, publish } = req.body;

  // Simple validation
  if (!title) return res.status(400).json({ success: false, message: "Title is required" });

  try {
    const newPost = new Post({
      title,
      content,
      publish,
      user: req.userId,
    });

    await newPost.save();

    res.json({ success: true, message: "Happy learning!", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/posts
// @desc Update post
// @access Private
router.put("/:id", verifyToken, async (req, res) => {
  const { title, content, publish } = req.body;

  // Simple validation
  if (!title) return res.status(400).json({ success: false, message: "Title is required" });

  try {
    let updatedPost = {
      title,
      content: content || "",
      publish: publish || false,
    };

    const postUpdateCondition = { _id: req.params.id, user: req.userId };

    updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, { new: true });

    // User not authorized to update post or post not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not z",
      });

    res.json({
      success: true,
      message: "Update successfully!",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    // User not authorized or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized",
      });

    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
