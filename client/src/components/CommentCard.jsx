import React from "react";
import { Link } from "react-router-dom";
import { IoIosHeartEmpty } from "react-icons/io";
const CommentCard = ({ reply }) => {
  return (
    <div className="flex justify-center min-h-[80px] max-h-[100px  my-3 flex-col">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${reply.user.id}`}>
          <div className="rounded-full items-center flex flex-col justify-center h-8 w-8 cursor-pointer overflow-hidden bg-gray-200 relative">
            <div className="h-3 w-3 rounded-full bg-gray-300"></div>
            <div className="h-8 w-8 -mb-7 rounded-full bg-gray-300"></div>
          </div>
        </Link>

        <div className="flex-col text-[10px] flex">
          <Link to={`/profile/${reply.user.id}`}>{reply.user.name}</Link>
          <p className="cursor-pointer flex text-[8px] items-center  gap-1 hover:text-blue-400 hover:underline ">
            {reply.user.username}
          </p>
        </div>
      </div>
      <div className="flex ">
        <span className="block w-4"></span>
        <div className="text-xs py-2 flex flex-col max-w-[85%]  text-ellipsis gap-2 border-l my-2 pl-5">
          <p className="text-ellipsis">{reply.text}</p>
          <div className="flex  items-center text-gray-500 cursor-pointer  gap-5">
            <IoIosHeartEmpty className="hover:text-gray-600 easeinOut" />
            <p className="text-[10px] hover:text-gray-700 easeinOut cursor-pointer">
              Reply
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
