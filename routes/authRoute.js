const router = require(`express`).Router();
const User = require(`../models/User`);
const bcrypt = require("bcrypt");

router.post(`/register`, async (req, res) => {
  const { username, password, email, profilePic } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPass,
      email,
      profilePic,
    });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post(`/login`, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    !user && res.status(400).json(`Wrong user`);
    const validated = await bcrypt.compare(req.body.password, user.password);
    console.log(validated);
    !validated && res.status(400).json(`Wrong credentials.`);

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
