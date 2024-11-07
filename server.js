// 모듈
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// 스키마
const Post = require("./models/post");
const User = require("./models/user");

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

// 유저
app.post("/users", async (req, res) => {
  const { userId, userPassword } = req.body;

  const newUser = new User({ userId, userPassword });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users/login", async (req, res) => {
  const { userId, userPassword } = req.body;

  console.log(userId, userPassword);

  try {
    const user = await User.findOne({ userId, userPassword });
    if (!user) {
      return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "로그인 성공!", userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 구동
app.listen(3000, () => {
  console.log(`Server listening on 3000`);
});
