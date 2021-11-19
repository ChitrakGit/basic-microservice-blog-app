import React, { useState, useEffect } from 'react';
import axios from 'axios';
// postId
const CommentList = ({ comments }) => {
  // const [comments, setComments] = useState([]);

  // const fetchData = async () => {
  //   const res = await axios.get(
  //     `http://localhost:4001/posts/${postId}/comments`
  //   );

  //   setComments(res.data);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);
  console.log(`comList`, comments)
  const renderedComments = comments.map(comment => {
    let content = "blank";
    if(comment.status == 'approved') content = comment.content;
    else if(comment.status == 'pending') content = "Waiting For moderation";
    else if(comment.status == 'rejected') content = "comment rejected";
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;