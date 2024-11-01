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
  .connect("mongodb://localhost:27017/onyu", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Succesfully connected to database");
  })
  .catch((err) => {
    console.log("Failed to connect database");
  });

// 테스트용 get
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 게시물 post
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
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 구동
app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});
