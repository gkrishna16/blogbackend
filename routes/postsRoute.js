const router = require(`express`).Router();
const User = require(`../models/Post`);
const Post = require(`../models/Post`);
const bcrypt = require("bcrypt");
const { application } = require("express");

// CREATE POST
router.post(`/`, async (req, res) => {
  const newPost = await Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

// UPDATE POST
router.put(`/:id`, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(401).json(`You can only update your own post.`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete(`/:id`, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json(`Post has been deleted.`);
      } catch (error) {
        res.status(401).json("You can delete your own posts");
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const post = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL POSTS

router.get(`/`, async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
