const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Image = require("../models/Image");
const verifyToken = require("../middleware/verifyToken");

// @route GET api/images/me
// @desc Get all images
// @access Private
router.get("/me", verifyToken, async (req, res) => {
  try {
    const image = await Image.find({ user: req.userId }).populate("user", [
      "username",
    ]);
    res.json({ success: true, image });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route POST api/images
// @desc post images
// @access Private
router.post("/", verifyToken, upload.single("images"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Create new image
    const image = new Image({
      profile_img: result.secure_url,
      cloudinary_id: result.public_id,
      user: req.userId,
    });
    // save image in mongodb
    // images: file
    await image.save();
    res.status(200).send({
      image,
    });
  } catch (err) {
    console.log(err);
  }
});

// @route DELETE api/images/:id
// @desc delete image
// @access Private
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const imageDeleteCondition = { _id: req.params.id, user: req.userId };
    const deletedImage = await Image.findOneAndDelete(imageDeleteCondition);

    // User not authorized or post not found
    if (!deletedImage)
      return res.status(401).json({
        success: false,
        message: "Post not found or user not authorized",
      });

    res.json({ success: true, image: deletedImage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
module.exports = router;
