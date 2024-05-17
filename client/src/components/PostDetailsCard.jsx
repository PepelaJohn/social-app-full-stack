import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deletePost } from "../actions/posts";
import { savePost } from "../actions/users";

const PostDetailsCard = ({ setBookMarked, bookmarked, id, creatorId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!(user.id || user._id);
  const handleBookMark = () => {
    setBookMarked(!bookmarked);
 
    if (user.id || user._id) {
      
      dispatch(savePost(id));
      // setBookMarked(post.saves.includes(user.id || user._id));
    }
  };
  const isCurrentUserPostOwner =
    isLoggedIn && (user.id || user._id) === creatorId;

  const handleDeletePost = () => {
    if (isCurrentUserPostOwner) {
      dispatch(deletePost(id));
    } else {
      console.log("Invalid user");
    }
  };
  return (
    <div className="absolute right-0 top-[100%] bg-white text-xs rounded-lg flex justify-center flex-col shadow-3xl min-w-[300px] ">
      <span onClick={handleBookMark} className="p-5 flex items-center  hover:bg-gray-50 easeinOut ">
        {!bookmarked ? "Save":"Unsave"}
      </span>
      <span className="p-5 flex items-center hover:bg-gray-50 easeinOut ">
        Report
      </span>
      {isCurrentUserPostOwner && (
        <span
          onClick={handleDeletePost}
          className="p-5 hover:bg-gray-50 easeinOut  flex items-center text-red-400"
        >
          Delete
        </span>
      )}
    </div>
  );
};

export default PostDetailsCard;
