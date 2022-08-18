const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const auth = require("./routes/auth");
const posts = require("./routes/post");
const images = require("./routes/image");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const app = express();
const port = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression);

const connectMongo = async () => {
  try {
    await mongoose.connect(`${MONGODB_URL}`, {});
    console.log("Connected to Mongo");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
connectMongo();

app.use("/api/auth", auth);
app.use("/api/posts", posts);
app.use("/api/images", images);

app.listen(port, () => {
  console.log(`app running on http://localhost:${port}`);
});
