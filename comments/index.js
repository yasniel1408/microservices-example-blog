const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/comments/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/comments/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  try {
    console.log("comments - CommentCreated: ", {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    });
    await axios.post("http://event-bus-service:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });
  } catch (error) {
    console.log(error);
  }

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log(`comments - ${type}: `, data);

  if (type === "CommentModerated") {
    const { id, status, postId, content } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find(({ id: currentId }) => id === currentId);

    comment.status = status;

    await axios.post("http://event-bus-service:4005/events", {
      type: "CommentUpdated",
      data: { id, status, postId, content },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
