const express = require("express");
const User = require("../models/User");
const auth = require("../auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, birthDate, sex, mobile, about, address } = req.body;

  try {
    const user = await new User({
      firstName,
      lastName,
      email,
      sex,
      password,
      birthDate,
      address: address || "",
      mobile: mobile || "",
      about: about || "",
    }).save();

    await auth.setPassword(user, password);
    await user.save();
    const token = await auth.generateToken(user);

    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "No account matches this email" });

  const isAuthenticated = await auth.validatePassword(user, password);

  if (!isAuthenticated) return res.status(400).json({ message: "Invalid login credentials" });

  // generate fresh token on login
  const token = await auth.generateToken(user);
  res.json({ token, user });
});

router.get("/getuser", auth.authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
