import React, { useEffect, useState } from "react";
import { MdMoreHoriz } from "react-icons/md";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineModeComment as Comment } from "react-icons/md";
import { IoMdRepeat as RePost } from "react-icons/io";
import { MdBookmarkBorder as BookMarkEmpty } from "react-icons/md";
import { MdBookmark as BookMarkFilled } from "react-icons/md";
import { IoIosHeart as IoIosHeartFull } from "react-icons/io";
import { IoIosArrowDown as CaretDown } from "react-icons/io";
import { IoIosArrowUp as CaretUp } from "react-icons/io";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { likePost, replyPost, retweetPost } from "../actions/posts";
import { savePost } from "../actions/users";
import CommentCard from "./CommentCard";
import PostDetailsCard from "./PostDetailsCard";

const PostCard = ({ post }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showPostDetails, setshowPostDetails] = useState(false);
  const [bookmarked, setBookMarked] = useState(post.saves.includes(user?.id));
  const [commentState, setCommentState] = useState(false);
  const [liked, setliked] = useState(post.likes.includes(user.id || user._id));
  const [comment, setComment] = useState("");
  const handleLike = () => {
    if (user.id || user._id) setliked(post.likes.includes(user.id || user._id));
    if (user.id || user._id) dispatch(likePost(post._id));
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleBookMark = () => {
    setBookMarked(!bookmarked);

    if (user.id || user._id) {
      dispatch(savePost(post._id));
      // setBookMarked(post.saves.includes(user.id || user._id));
    }
  };

  const handleRetweet = () => {
    if (user.id || user._id) {
      const data = {
        postId: post._id,
        currentCreator: user.name,
      };

      dispatch(retweetPost(data));
    }
  };

  const handleComment = (e) => {
    e.preventDefault();

    if ((user.id || user._id) && comment) {
      const data = {
        text: comment,
        name: user.name,
      };

      dispatch(replyPost(post._id, data));
      setCommentState(false);
      setComment("");
    } else {
      console.log("Please Login");
    }
  };

  useEffect(() => {
    setliked(post.likes.includes(user.id || user._id));
  }, [post.likes]);

  useEffect(() => {
    setBookMarked(post.saves.includes(user.id || user._id));
    // console.log(post.saves.includes(user.id || user._id), post._id);
  }, [post.saves]);

  return (
    <div className="w-full flex flex-col bg-dark gap-1  mb-10 bg-border rounded-lg  ">
      {post.isRetweet && (
        <div className="text-xs p-3 flex capitalize gap-2 items-center text-gray-400 font-extralight">
          <RePost />{" "}
          {user.name === post.creator.name ? "You " : post.creator.name}{" "}
          reposted
        </div>
      )}
      <div className="flex items-center p-5">
        <Link to={`/profile/${post.creator.creatorId}`}>
          {
            <div className="rounded-full items-center flex flex-col justify-center h-10 w-10 cursor-pointer overflow-hidden bg-gray-200 relative">
              <div className="h-4 w-4 rounded-full bg-gray-300"></div>
              <div className="h-10 w-10 -mb-7 rounded-full bg-gray-300"></div>
            </div>
          }
        </Link>
        <div className="flex  flex-col pl-2">
          <Link
            to={`/profile/${post.creator.creatorId}`}
            className="cursor-pointer flex items-center capitalize gap-1  hover:text-blue-300 text-xs"
          >
            {post.creator.name}
          </Link>
          <p className="cursor-pointer flex items-center  gap-1  text-[10px]">
            Nairobi
          </p>
        </div>
        <div className="flex flex-1 h-full w-auto"></div>
        <span
          onClick={() => setshowPostDetails(!showPostDetails)}
          className="relative cursor-pointer"
        >
          <MdMoreHoriz />
          {showPostDetails && (
            <PostDetailsCard
              setBookMarked={setBookMarked}
              bookmarked={bookmarked}
              setshowPostDetails={setshowPostDetails}
              id={post._id}
              creatorId={post.creator.creatorId}
            />
          )}
        </span>
      </div>

      <div className="overflow-hidden justify-end items-center  flex px-5 pb-5 w-full">
        <img
          src={post.file}
          alt=""
          className="w-[90%] object-center object-cover max-h-[550px] rounded-xl"
        />
      </div>

      <div className="w-full px-5  flex overflow-hidden  items-center  max-h-[50px]">
        <p className="text-sm capitalize whitespace-normal w-9/12">
          {post.title}
        </p>
      </div>
      <div className="p-5 items-center border-b-2  border-gray-100 flex justify-between">
        <span
          onClick={handleLike}
          className="flex items-center  min-w-[50px] gap-1 cursor-pointer text-[24px]"
        >
          {!liked ? (
            <IoIosHeartEmpty />
          ) : (
            <IoIosHeartFull className="text-red-500" />
          )}
          <p className="text-[10px]">
            {post.likes.length ? post.likes.length : ""}
          </p>
        </span>
        <span
          onClick={() => {
            if (!!post.replies.length) setCommentState(true);
          }}
          className="cursor-pointer flex items-center min-w-[50px]  gap-1  text-[24px]"
        >
          <Comment />
          <p className="text-[10px]">
            {post.replies.length ? post.replies.length : ""}
          </p>
        </span>
        <span
          onClick={handleRetweet}
          className="cursor-pointer flex items-center min-w-[50px] gap-1  text-[24px]"
        >
          <RePost />
          <p className="text-[10px]">
            {post.retweets.length ? post.retweets.length : ""}
          </p>
        </span>
        <span
          onClick={handleBookMark}
          className="cursor-pointer flex items-center min-w-[50px] gap-1  text-[24px]"
        >
          {!bookmarked ? <BookMarkEmpty /> : <BookMarkFilled />}
          <p className="text-[10px]">
            {post.saves.length ? post.saves.length : ""}
          </p>
        </span>
      </div>
      <div className="flex flex-col p-5 easeinOut items-start justify-start gap-2  py-4">
        <span
          onClick={() => setCommentState(!commentState)}
          className="text-blue-400 flex gap-2 items-center  text-sm cursor-pointer"
        >
          {!commentState ? (
            <>
              {post.replies.length ? (
                <>
                  <CaretDown /> Comments{" "}
                </>
              ) : (
                "Add comment"
              )}
            </>
          ) : (
            <>
              <CaretUp /> {!!post.replies.length && "Hide Comments"}
            </>
          )}
        </span>
        {(user.id || user._id) && (
          <div
            className={`easeinOut  w-full  mb-2  justify-between flex items-center text-sm cursor-pointer ${
              commentState ? "h-[70px]" : "h-0"
            }`}
          >
            <input
              onChange={handleChange}
              value={comment}
              type="text"
              placeholder="Add a comment"
              className="h-full pl-5 rounded-lg outline-none border-none bg-transparen w-11/12"
            />
            <p
              onClick={handleComment}
              className={`text-blue-400 text-xs  ${
                commentState ? "flex" : "hidden"
              }  py-4`}
            >
              Send
            </p>
          </div>
        )}
        {!!post.replies.length && commentState && (
          <div
            className={`flex flex-col  w-full ${
              user.id || user._id ? "border-t" : ""
            } `}
          >
            {post.replies?.map((reply, i) => (
              <CommentCard reply={reply} key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
