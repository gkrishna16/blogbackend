const router = require(`express`).Router();
const User = require(`../models/User`);
const Post = require(`../models/Post`);
const bcrypt = require("bcrypt");

router.put(`/:id`, async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json(`You can update only your account.`);
  }
});

// DELETE
router.delete(`/:id`, async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json(`User has been deleted...`);
      } catch (error) {}
    } catch (error) {
      res.status(404).json(`User not found.`);
    }
  } else {
    res.status(401).json(`You can delete only your own content.`);
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

// Get user by id
router.get(`/:id`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(400).json(`The request failed.`);
  }
});

router.get(`/`, async (req, res) => {
  try {
    User.find({}, (err, users) => {
      if (err) {
        console.log(err);
        return;
      } else {
        const { password, ...others } = users;
        return res.status(200).json({ ...others });
      }
    });
  } catch (error) {
    res.status(401).status(error);
  }
});

module.exports = router;
