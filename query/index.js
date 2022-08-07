const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, postId, status } = data;
    const post = posts[postId];
    console.log(post.comments);
    const comment = post.comments.find(({ id: currentId }) => id === currentId);
    comment.status = status;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvents(type, data);

  console.log(`query - ${type}: `, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");

  const result = await axios.get("http://localhost:4005/events");

  result.data.forEach(({ type, data }) => {
    console.log("Processing event...", type);
    handleEvents(type, data);
  });
});
