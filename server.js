// 모듈
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// 스키마
const Post = require("./models/post");

// 설정
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

// DB 연결
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// 테스트용 get
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 게시물
app.post("/posts", async (req, res) => {
  const { title, content } = req.body;

  const newPost = new Post({ title, content });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/posts", async (req, res) => {
  const { id, search } = req.query;

  try {
    let posts;
    if (id) {
      posts = await Post.findById(id);
    } else if (search) {
      posts = await Post.find({ title: { $regex: search, $options: "i" } });
    } else {
      posts = await Post.find();
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/posts", async (req, res) => {
  const { id } = req.query;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 구동
app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});
