const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res
      .status(400)
      .send({ message: "Username, email and password are required" });
  if (username.includes("@"))
    return res.status(400).send({ message: "Username must not include @" });

  try {
    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUsername)
      return res
        .status(400)
        .send({ message: "User has already been registered" });

    if (existingEmail)
      return res
        .status(400)
        .send({ message: "Email has already been registered" });

    // username and email invalid
    const hashPassword = await argon2.hash(password);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Internal server error: " + err.message });
  }
});

router.post("/login", async (req, res) => {
  const { identify, password } = req.body;

  if (!identify || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  try {
    const user = await User.findOne(
      identify.includes("@") ? { email: identify } : { username: identify }
    );
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username or password" });

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(401).send({ message: "Incorrect password." });
    }

    const accessToken = await jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).json({
      success: true,
      message: "Login successfully.",
      accessToken,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = router;
