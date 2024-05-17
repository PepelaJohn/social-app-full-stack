import React from "react";
import { Sectionwrapper } from "../HOC/";
import { PostCard } from "./";
const Posts = () => {
  return (
    <div className="max-w-large flex flex-col  w-full common-padding">
      <div className="w-full h-fit">
        {Array(5)
          .fill("")
          .map((_, i) => (
            <PostCard key={i} />
          ))}
      </div>
    </div>
  );
};

export default Sectionwrapper(Posts, "nav-height pt-10");
