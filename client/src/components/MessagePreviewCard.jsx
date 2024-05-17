import React from "react";
import { MdCheck } from "react-icons/md";
import { useSelector } from "react-redux";
// import Image8 from '../assets/'
// import { useNavigate } from "react-router-dom";
const MessagePreviewCard = ({ convo, onClickFunc, selected, isOnline }) => {
  // console.log(convo, 'SGSGSGSGF');
  // const navigate = useNavigate();

  const userId = useSelector((state) => state.user._id);

  return (
    <div
      onClick={onClickFunc}
      className={`w-11/12 max-w-[500px] mx-[15px] easeinOut self-center py-7 rounded-2x  mb-2 shadow   border-gray-200 cursor-pointer px-5 flex ${
        selected ? "bg-gray-100" : ""
      }`}
    >
      <div className=" flex gap-3 flex-1">
        <div className="relative w-fit-h-fit">
          {" "}
          <div className="h-10 w-10 relative rounded-full bg-gray overflow-hidden flex items-center z-0 justify-center">
            <img
              className="w-full min-h-full object-cover object-center"
              src={
                !convo.isGroup
                  ? convo.participants[0].profilePic
                  : convo.img || ""
              }
              alt="dp"
            />
          </div>
          {isOnline && (
            <span className="bg-green-400 absolute h-3 w-3 right-0 rounded-full z-50 op-[100%] bottom-0"></span>
          )}
        </div>
        <div className="flex-col flex-1">
          <p className="text-[12px]">
            {!convo.isGroup ? convo.participants[0].name : convo.name}
          </p>
          <p
            className={`text-[12px] overflow-ellipsis  mt-1 flex items-center whitespace-pre  w-11/12 overflow-hidden `}
          >
            {userId === convo.lastMessage.sender ? (
              <span
                className={` flex w-5 ${
                  convo.lastMessage.seen ? "text-blue-500" : "text-gray-500"
                }`}
              >
                <MdCheck></MdCheck>
                {(isOnline || convo.lastMessage.seen) && (
                  <MdCheck className="-translate-x-[7.5px] text-[13px] -translate-y-[0.8px]"></MdCheck>
                )}
              </span>
            ) : (
              ""
            )}
            {!!convo?.lastMessage?.text && convo?.lastMessage?.text}
          </p>
        </div>
      </div>
      <div className="h-full flex flex-col justify-between">
        <p className="relative flex justify-center items-start text-gray-600 gap-2 text-[9px] ">
          {convo.updatedAt.slice(11, 16)}
        </p>
        {convo.isGroup && (
          <span className="h-[12px] w-[12px] items-center justify-center flex self-end bg-blue-400 text-[7px] font-semibold text-white rounded-full">
            G
          </span>
        )}
      </div>
    </div>
  );
};

export default MessagePreviewCard;
