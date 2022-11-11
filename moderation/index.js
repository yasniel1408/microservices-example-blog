const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  console.log(`moderation - ${type}: `, data);

  if (type === "CommentCreated") {
    console.log(`moderation - ${type}: `, req.body);

    const { id, content, postId } = data;
    const status = content.includes("orange") ? "rejected" : "approved";

    try {
      console.log(`moderation - CommentModerated: `, req.body);
      await axios.post("http://event-bus-service:4005/events", {
        type: "CommentModerated",
        data: { id, status, postId },
      });
    } catch (error) {
      console.log(error);
    }
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
