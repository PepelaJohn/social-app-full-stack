import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosHeartEmpty } from "react-icons/io";
import { fetchPostReply, replyPost } from "../actions/posts";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown as CaretDown } from "react-icons/io";
import { IoIosArrowUp as CaretUp } from "react-icons/io";
const CommentCard = ({ reply }) => {
  const [comments, setComments] = useState([]);
  const user = useSelector((state) => state.user);
  // console.log(user);

  const [loading, setLoading] = useState(false);

  const [replyMessage, setReplyMessage] = useState("");
  const [commentState, setCommentState] = useState(false);
  const dispatch = useDispatch();
  // console.log(reply);

  const handleReply = (e) => {
    e.preventDefault();
    if (!!replyMessage.trimStart()) {
      // immediately replying is impossible as this does not have an id,
      // PROBABLE SOLUTION - return an id from the server and set the id to the comment
      const newComment = {
        parentId: reply._id,
        replies: [],
        text: replyMessage,
        user: {
          name: user.name || "",
          username: user.username || "",
          id: {
            _id: user._id,
            profilePic: user.profilePic || "",
          },
        },
      };

      setComments((prev) => [newComment, ...prev]);
      dispatch(
        replyPost(reply._id, {
          text: replyMessage,
          name: user.name,
          parent: "comment",
        })
      );
      // setCommentState(false);
      setReplyMessage("");
    }
  };

  useEffect(() => {
    if (commentState && !!reply.replies.length) {
      dispatch(fetchPostReply(reply._id, setComments, setLoading));
    }
  }, [commentState]);
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-w-[100px] ">
          Loading...
        </div>
      ) : (
        <div className="flex justify-center min-h-[80px]  my-3 flex-col">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${reply?.user?.id}`}>
              <div className="rounded-full items-center flex flex-col justify-center h-8 w-8 cursor-pointer overflow-hidden bg-gray-200 relative">
                {reply?.user?.id?.profilePic ? (
                  <img
                    src={reply?.user?.id?.profilePic}
                    alt="dp"
                    className="w-full min-h-full object-center object-cover"
                  />
                ) : (
                  <>
                    <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                    <div className="h-8 w-8 -mb-7 rounded-full bg-gray-300"></div>
                  </>
                )}
              </div>
            </Link>

            <div className="flex-col text-[10px] flex">
              <Link to={`/profile/${reply?.user?.id}`}>
                {reply?.user?.name}
              </Link>
              <p className="cursor-pointer flex text-[8px] items-center  gap-1 hover:text-blue-400 hover:underline ">
                {reply?.user?.username}
              </p>
            </div>
          </div>
          <div className="flex ">
            <span className="block w-4"></span>
            <div className="text-xs py-2 flex flex-col  w-full   text-ellipsis gap-2 border-l my-2 pl-5">
              <p className="text-ellipsis">{reply?.text}</p>
              <div className="flex  items-center text-gray-500 cursor-pointer  gap-5">
                <p
                  onClick={() => {
                    setCommentState((prev) => !prev);
                    setReplyMessage("")
                  }}
                  className="text-[8px] hover:text-gray-700 whitespace-nowrap flex items-center gap-1 easeinOut cursor-pointer"
                >
                  {!commentState ? (
                    <>
                      {reply.replies.length ? (
                        <>
                          <CaretDown /> Comments
                        </>
                      ) : (
                        "Add comment"
                      )}
                    </>
                  ) : (
                    <>
                      <CaretUp /> Back
                    </>
                  )}
                </p>
              </div>
              {commentState && (
                <>
                  {" "}
                  <div
                    className={`easeinOut  w-full flex-1   mb-2  justify-between flex items-center text-sm cursor-pointer `}
                  >
                    <input
                      onChange={(e) => setReplyMessage(e.target.value)}
                      value={replyMessage}
                      type="text"
                      placeholder="Add a comment"
                      className="h-full pl-5 rounded-lg outline-none py-4 border-none bg-transparen w-11/12"
                    />
                    {!!replyMessage.length && (
                      <p
                        onClick={handleReply}
                        className={`text-blue-400 border text-xs   px-4 py-2`}
                      >
                        Send
                      </p>
                    )}
                  </div>
                  {!!comments?.length && (
                    <div className="w-full">
                      {comments.map((comment, i) => {
                        return (
                          <CommentCard key={i + comment.text} reply={comment} />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentCard;
