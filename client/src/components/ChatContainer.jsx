import React, { useEffect, useState } from "react";
import { MdImage } from "react-icons/md";
import { MdCheck, MdArrowBackIos, MdAdd } from "react-icons/md";
import { addParticipantToGroup, getFollowers } from "../actions/users";
import { useDispatch } from "react-redux";
import { useSocket } from "../context/context";
import messagesound from "../assets/sounds/message.mp3";
import { IoMdEye } from "react-icons/io";
const ChatContainer = ({
  matches,
  setSelectedConvo,
  selectedConvo,
  messages,
  user,
  onlineUsers,
  scrollRef,
  fileRef,
  message,
  handleChange,
  handleSubmit,
  setConversations,
  setMessages,
}) => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const [selectedUsers, setSelectedUsers] = useState([]);
  useEffect(() => {
    if (selectedConvo.isGroup) {
      socket &&
        socket.on("newGroupMessage", (data) => {
          if (!document.hasFocus()) {
            const sound = new Audio(messagesound);
            sound.play();
          }

          if (
            (data.conversationId || data.groupId) === selectedConvo._id &&
            data.sender._id !== user._id
          ) {
            setMessages((message) => [...message, data]);
          }

          setConversations((prev) =>
            prev.map((conversation) =>
              conversation._id === data.conversationId ||
              conversation._id === data.groupId
                ? {
                    ...conversation,
                    lastMessage: {
                      text: data.text,
                      sender: data?.sender,
                    },
                  }
                : conversation
            )
          );
        });
    }

    return () => socket && socket.off("newGroupMessage");
  }, [socket, messages, selectedConvo._id]);
  return (
    <div className=" w-full flex-1 h-full px-3 flex flex-col">
      <div className="flex justify-between items-center h-[50px]">
        <div className="flex items-center gap-2">
          {
            <span
              className="cursor-pointer"
              onClick={() => setSelectedConvo("")}
            >
              <MdArrowBackIos></MdArrowBackIos>
            </span>
          }
          <div className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-500 overflow-hidden">
            <img
              className="w-full min-h-full object-cover object-center"
              src={
                !selectedConvo.isGroup
                  ? selectedConvo.participants[0].profilePic
                  : selectedConvo.img || ""
              }
              alt="dp"
            />
          </div>
          <p className="cursor-pointer flex items-center  gap-1 capitalize hover:text-blue-300 text-xs">
            {selectedConvo.isGroup
              ? selectedConvo.name
              : selectedConvo.participants[0].name}
          </p>
        </div>
        {selectedConvo.isGroup && (
          <div className="pr-5 z-50 relative flex">
            <span
              onClick={() => {
                !users.length && getFollowers(setUsers, dispatch);
              }}
              className="text-sm flex items-center gap-1 border hover:bg-gray-100 cursor-pointer p-2 whitespace-nowrap"
            >
              <p>
                {selectedConvo.creator === user._id
                  ? "Add Participants"
                  : "View Participants"}
              </p>{" "}
              {selectedConvo.creator === user._id ? (
                <MdAdd></MdAdd>
              ) : (
                <IoMdEye></IoMdEye>
              )}
            </span>
            <div
              className={`absolute right-0 bg-white  w-fit min-w-[300px] mt-[50px]  rounded-lg gap-3 scrollbar-styled easeinOut ${
                users.length
                  ? " p-3   h-[400px] overflow-auto  "
                  : " w-0 h-0 overflow-hidden "
              }`}
            >
              <p className="text-sm font-semibold"> Participants </p>
              {selectedConvo.participants.map((user, i) => (
                <div
                  className={`flex my-2 cursor-pointer gap-1 p-6 min-w-[250px] bg-gray-300shadow-md items-center`}
                  key={i}
                >
                  <span className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      className="w-full min-h-full object-fit object-center"
                      src={user.profilePic || ""}
                      alt="dp"
                    />
                  </span>

                  <p className="text-xs">{user.name}</p>
                </div>
              ))}
              {!selectedUsers.length && selectedConvo.creator === user._id && (
                <p className="text-xs text-red-400">
                  Select Users to add to group
                </p>
              )}
              {users.length &&
                users
                  .filter((usertop) =>
                    selectedConvo?.participants?.every(
                      (convo) => convo._id !== usertop._id
                    )
                  )
                  .map((user, i) => (
                    <div
                      onClick={() => {
                        if (!selectedUsers?.includes(user._id)) {
                          setSelectedUsers((pre) => [...pre, user._id]);
                        } else {
                          setSelectedUsers((pre) =>
                            pre.filter((person) => person !== user._id)
                          );
                        }
                      }}
                      className={`flex my-2 cursor-pointer gap-1 p-6 min-w-[250px] ${
                        selectedUsers.indexOf(user._id) !== -1
                          ? " bg-gray-300"
                          : "transparent"
                      } shadow-md items-center`}
                      key={i}
                    >
                      <span className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          className="w-full min-h-full object-fit object-center"
                          src={user.profilePic || ""}
                          alt="dp"
                        />
                      </span>

                      <p className="text-xs">{user.name}</p>
                    </div>
                  ))}

              {!!selectedUsers.length ? (
                <button
                  onClick={() => {
                    addParticipantToGroup(
                      selectedConvo._id,
                      selectedUsers,
                      dispatch,
                      setConversations,
                      setSelectedUsers,
                      setUsers
                    );
                  }}
                  className="p-2 bg-black min-w-[200px w-full mt-3 text-white"
                >
                  ADD
                </button>
              ) : (
                <button
                  onClick={() => setUsers([])}
                  className="p-2 bg-black min-w-[200px w-full mt-3 text-white"
                >
                  EXIT
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-100 scrollbar-styled overflow-y-scroll flex px-5 pt-5 flex-col flex-1">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`${
              message?.sender === user._id || message.sender._id === user._id
                ? "self-end "
                : " self-start bg-blue-300 "
            } py-2 flex items-center bg-white rounded-md px-3 min-w-[80px] max-w-[70%] mb-5`}
          >
            {selectedConvo.isGroup && message.sender._id !== user._id && (
              <div className="items-center justify-center mx-1 ">
                <span className="rounded-full block w-8 bg-gray-500  h-8 border overflow-hidden">
                  <img
                    className="w-full max-w-full min-h-full object-cover object-center"
                    src={message.sender.profilePic}
                    alt="dp"
                  />
                </span>
              </div>
            )}
            <div className="flex flex-col w-full h-full">
              {selectedConvo.isGroup && message.sender._id !== user._id && (
                <p className="text-[8px] text-gray-500">
                  {message.sender.name}
                </p>
              )}
              <p className="">{message.text}</p>
              <div className="self-end flex items-start ">
                {" "}
                <span
                  className={` flex w-5 ${
                    message.seen ? "text-blue-500 " : " text-gray-500 "
                  }`}
                >
                  {message?.sender === user._id && (
                    <>
                      <MdCheck className="text-[12px]"></MdCheck>
                      {((!selectedConvo.isGroup &&
                        onlineUsers.includes(
                          selectedConvo.participants[0]._id
                        )) ||
                        message.seen) && (
                        <MdCheck className="-translate-x-[8px] text-[13px] -translate-y-[0.8px]"></MdCheck>
                      )}
                    </>
                  )}
                </span>{" "}
                <p className="text-[7px] text-gray-500">
                  {message.createdAt.slice(11, 16)}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div ref={scrollRef} className="w-full" id="scrollref"></div>
      </div>
      <div className="flex px-5 items-center justify-between w-full h-[70px]">
        <form className="w-full flex" action="">
          <span
            onClick={() => fileRef.current.click()}
            className="flex cursor-pointer items-center text-blue-400 mr-3"
          >
            <MdImage />
          </span>
          <input type="file" hidden ref={fileRef} name="" />
          <input
            placeholder="Write message..."
            name="text"
            value={message.text}
            onChange={handleChange}
            onSubmit={handleSubmit}
            type="text"
            className="px-3 rounded-3xl outline-none bg-gray-100 h-14 w-8/12"
          />
          <button onClick={handleSubmit} className="text-sm text-blue-400 ml-2">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
