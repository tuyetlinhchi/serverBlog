const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  publish: {
    type: Boolean,
  },
  // comments: {
  //   type: String,
  // },
  // vote:{
  //   type: Number,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});
module.exports = mongoose.model("posts", PostSchema);
