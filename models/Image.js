const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  profile_img: String,
  cloudinary_id: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});
module.exports = mongoose.model("images", imageSchema);
