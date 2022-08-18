const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };

  try {
    console.log("posts - PostCreated: ", { id, title });
    await axios.post("http://event-bus-service:4005/events", {
      type: "PostCreated",
      data: { id, title },
    });
  } catch (error) {
    console.log(error);
  }

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Recived Event:", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
