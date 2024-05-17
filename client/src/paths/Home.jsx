import React, { useEffect, useRef, useState } from "react";
import { Sectionwrapper } from "../HOC/";

import { MdOutlineLocationOn } from "react-icons/md";
import { MdPoll } from "react-icons/md";
import { MdImage } from "react-icons/md";
import { PostCard } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getMorePosts, getPosts } from "../actions/posts";
import { useNavigate } from "react-router-dom";
import { processImage } from "../utils/constants";

function Home() {
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const imageRef = useRef(null);
  const postsRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(user.id || user._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    poll: "",
    file: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      if (formData.title && formData.file) {
        const creator = user?.name;
        if (creator) {
          dispatch(createPost({ ...formData, creator }));
          setFormData({
            title: "",
            poll: "",
            file: "",
          });
        }
      } else {
        alert("No input");
      }
    } else {
      navigate("/auth/sign-up");
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const [getmoreMode, setgetMoreMode] = useState(false);

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!Object.entries(user).length);
  }, [user]);

  function scrollTrigger(el) {
    //  window.innerHeight  + 100 >= el.getBoundingClientRect().top
    const bool = el.getBoundingClientRect().top <= window.innerHeight + 100;
    if (bool) {
      // dispatch(getMorePosts())
    }
  }

  useEffect(() => {
    const el = document.getElementById("postref");
    window.addEventListener("scroll", () => scrollTrigger(el));

    return () => {
      window.addEventListener("scroll", () => scrollTrigger(el));
    };
  }, []);

  return (
    <div className="max-w-large  flex flex-col  w-full common-padding">
      {isLoggedIn && (
        <div className="h-[120px] mb-5 flex bg-dark w-full bg-border">
          <div className="flex-1">
            <form action="" className="h-[70%] flex w-full ">
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                placeholder="What's on your mind today?..."
                className="outline-none  w-[85%] border-none bg-transparent  pl-5 text-md  text-gray-600 placeholder:text-md"
              />

              <input
                hidden
                type="file"
                ref={imageRef}
                className="hidden"
                onChange={(e) =>
                  processImage(e, setFormData, formData, dispatch)
                }
              />
            </form>
            <div className="flex relative items-center h-[30%]  gap-2 text-blue-500 justify-start pl-5">
              <MdImage
                onClick={() => imageRef.current.click()}
                className="w-[20px] cursor-pointer"
              />
              <MdOutlineLocationOn className="w-[20px] cursor-pointer"></MdOutlineLocationOn>
              <MdPoll className="w-[20px] cursor-pointer"></MdPoll>
            </div>
          </div>

          <div className="w-[15%] flex items-center justify-center">
            <button
              onClick={handleSubmit}
              className="text-blue-500 font-semibold "
            >
              Post
            </button>
          </div>
        </div>
      )}
      {posts.length ? (
        <>
          <div className="h-fit w-full  ">
            {posts.map((post, i) => (
              <PostCard post={post} key={i} />
            ))}
          </div>
        </>
      ) : (
        <p className="w-full h-full flex items-center justify-center text-black text-sm">
          No posts to show.!!
        </p>
      )}

      <div ref={postsRef} id="postref" className="h-5 w-5 bg-blue-400" />
    </div>
  );
}
export default Sectionwrapper(Home, "");
