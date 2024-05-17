import React, { useEffect, useRef, useState } from "react";
import { Sectionwrapper } from "../HOC";
import { MessagePreviewCard } from "../components";

import { MdSearch } from "react-icons/md";

import NewConvo from "../components/NewConvo";
import ChatContainer from "../components/ChatContainer";
// import Image8 from "../img/portfolio/7.png";

import messagesound from "../assets/sounds/message.mp3";

import {
  getMessage,
  getMessages,
  sendGroupMessage,
  sendMessage,
} from "../actions/users";

import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../context/context";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "../utils/constants";
import { ERROR } from "../constants";
// import CreateGroup from "../components/CreateGroup";
function Messages() {
  const matches = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [createGroupMode, setCreateGroupMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [getusermode, setGetusermode] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedConvo, setSelectedConvo] = useState("");
  const dispatch = useDispatch();
  const fileRef = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    // scrollRef.current.scrollTo(10)
    const scroll = document.getElementById("scrollref");
    scroll?.scrollIntoView({ scrollType: "smooth" });
  }, [messages]);

  const [message, setMessage] = useState({
    text: "",
    img: "",
    // recepientId: '',
  });

  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    const lastMessagefromOthers =
      !!messages.length && messages[messages.length - 1]?.sender !== user._id;

    if (lastMessagefromOthers) {
      !selectedConvo.isGroup &&
        socket &&
        socket.emit("markMessagesAsSeen", {
          conversationId: selectedConvo._id,
          userId: selectedConvo.lastMessage?.sender,
          isGroup: selectedConvo.isGroup,
        });
    }
    !selectedConvo.isGroup &&
      socket &&
      socket.on("messagesSeen", ({ conversationId }) => {
        if (selectedConvo._id === conversationId) {
          setMessages((prev) =>
            prev.map((message) =>
              !message.seen ? { ...message, seen: true } : message
            )
          );
        }

        setConversations((conversations) =>
          conversations.map((conversation) =>
            conversation._id === conversationId
              ? {
                  ...conversation,
                  lastMessage: { ...conversation.lastMessage, seen: true },
                }
              : conversation
          )
        );
      });
  }, [selectedConvo._id, socket, messages, user._id]);

  useEffect(() => {
    !selectedConvo.isGroup &&
      socket &&
      socket.on("newMessage", (newmessage) => {
        if (newmessage.conversationId === selectedConvo._id) {
          setMessages((prev) => [...prev, newmessage]);
        }

        if (!document.hasFocus()) {
          const sound = new Audio(messagesound);
          sound.play();
        }

        let newconvo = conversations.map((conversation) =>
          conversation._id === newmessage.conversationId
            ? {
                ...conversation,
                lastMessage: {
                  text: newmessage.text,
                  sender: newmessage?.sender,
                },
              }
            : conversation
        );
        setConversations(newconvo);
      });

    return () => socket && socket.off("newMessage");
  }, [selectedConvo._id, socket]);

  const handleChange = (e) => {
    setMessage({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedConvo.isGroup) {
      !!message.text || !!message.img
        ? sendGroupMessage(
            selectedConvo._id,
            {
              sender: user._id,
              text: message.text,
              img: message.img,
            },
            setMessages,
            setConversations,
            dispatch,
            setMessage
          )
        : dispatch({ type: ERROR, payload: "Please add text or image" });
    } else {
      if (message.text.trimStart().length) {
        // setMessages((prev) => [...prev, message]);
        const data = {
          text: message.text,
          recepientId: selectedConvo.participants[0]._id,
        };

        sendMessage(
          data,
          setMessages,
          setConversations,
          dispatch,
          setSelectedConvo,
          selectedConvo.mock === true
        );
        setMessage({
          text: "",
        });
      } else {
        dispatch({
          type: ERROR,
          payload: "Please fill all the required inputs",
        });
      }
    }
  };

  useEffect(() => {
    if (!user._id) navigate("/auth/sign-in");
    const getMyMessages = async () => {
      await getMessages(setConversations, dispatch);
    };

    user._id && getMyMessages();
  }, []);

  useEffect(() => {
    if (
      selectedConvo !== "" &&
      selectedConvo?.participants[0]?._id !== undefined &&
      selectedConvo?.mock !== true
    )
      getMessage(
        selectedConvo.isGroup
          ? selectedConvo._id
          : selectedConvo.participants[0]._id,
        setMessages,
        dispatch,
        selectedConvo.isGroup
      );
  }, [selectedConvo._id]);

  return (
    <div
      // style={{ left: matches && selectedConvo !== "" ? "-100%" : 0 }}
      className={`bg-white scrollbar-none ${
        !matches && selectedConvo !== "" ? " left-l " : " left-00 "
      } rounded-sm h-nav  max-w-[1400px] ${
        !matches ? "overflow-revert h-[100vh]" : " overflow-hidden "
      } flex w-full`}
    >
      <div
        className={`max-l:hidden  easeinOut relative ${
          matches ? "flex-[0.35]" : "flex-1 min-w-full"
        } flex flex-col`}
      >
        <div className="h-[50px] w-full px-5 justify-between flex items-center">
          <h1 className="text-black font-semi-bold text-2xl">Chats</h1>
          <form
            className="flex rounded-2xl items-center mr-2 pr-2 bg-gray-100"
            action=""
          >
            <input
              placeholder="SEARCH"
              className="text-sm bg-transparent outline-none p-3"
              type="text"
            />
            <MdSearch className="text-2xl" />
          </form>
        </div>
        <div className="overflow-y-scroll scrollbar-none py-5 flex-1 flex flex-col">
          {conversations.length ? (
            conversations.map((conversation, i) => {
              conversation.participants = conversation.participants.filter(
                (participant) => participant._id !== user._id
              );
              return conversation?.mock !== true ? (
                <MessagePreviewCard
                  selected={selectedConvo._id === conversation._id}
                  onClickFunc={() => {
                    selectedConvo._id !== conversation._id && setMessages([]);
                    setSelectedConvo(conversation);
                  }}
                  convo={conversation}
                  isOnline={
                    conversation.isGroup
                      ? false
                      : onlineUsers.includes(conversation.participants[0]._id)
                  }
                  key={i}
                />
              ) : (
                <></>
              );
            })
          ) : (
            <div className="w-11/12 h-full flex items-center text-sm justify-center self-center py-5 rounded-2xl  mb-2">
              Start a new Convo
            </div>
          )}
        </div>
        <div className="w-full h-[50px]"></div>
      </div>
      <div
        className={` flex w-full  h-full  easeinOut relative  items-center ${
          matches ? " flex-[0.65] " : " flex-1 min-w-full"
        }`}
      >
        {selectedConvo !== "" ? (
          <ChatContainer
            matches={matches}
            fileRef={fileRef}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            message={message}
            messages={messages}
            onlineUsers={onlineUsers}
            scrollRef={scrollRef}
            selectedConvo={selectedConvo}
            setSelectedConvo={setSelectedConvo}
            user={user}
            setConversations={setConversations}
            setMessages={setMessages}
          />
        ) : (
          <>
            <NewConvo
              setConversations={setConversations}
              createGroupMode={createGroupMode}
              setCreateGroupMode={setCreateGroupMode}
              getusermode={getusermode}
              setUsers={setUsers}
              dispatch={dispatch}
              setGetusermode={setGetusermode}
              users={users}
              conversations={conversations}
              setSelectedConvo={setSelectedConvo}
            />
          </>
        )}
      </div>
    </div>
  );
}
export default Sectionwrapper(Messages, "");
