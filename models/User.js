const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  //set role if you can
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("users", UserSchema);
