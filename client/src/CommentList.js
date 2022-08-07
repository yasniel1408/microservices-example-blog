import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments?.map(({ id, content, status }) => {
    if (status === "pending")
      return <li key={id}>{"Waiting moderation ..."}</li>;
    if (status === "rejected") return <li key={id}>{"Rejected Comment X"}</li>;

    return <li key={id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
