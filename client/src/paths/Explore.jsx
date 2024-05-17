import React, { useEffect } from "react";
import { Sectionwrapper, Layout } from "../HOC";
import { arrayChunk } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, getRecommendedPosts } from "../actions/posts";

function Explore() {
  const posts = useSelector((state) => state.posts);
  const isLoggedin = useSelector((state) => state.user.id || state.user._id);
  const dispatch = useDispatch();
  const chunkArray = arrayChunk(posts, 3);
  useEffect(() => {
    if(isLoggedin){
      console.log('getting recommended posts');
      dispatch(getRecommendedPosts())
    } else{
      dispatch(getPosts());
    }
  }, []);

  return (
    <div className="w-full h-fit pb-5 max-w-large common-padding">
      <div className="bg-border flex flex-col gap-1">
        {chunkArray.map((chunk, i) => (
          <Layout
            key={i}
            imagesArray={chunk}
            customclass={Math.floor(i / 2) === i / 2 ? "" : "reverse"}
          />
        ))}
      </div>
    </div>
  );
}
export default Sectionwrapper(Explore, "");
