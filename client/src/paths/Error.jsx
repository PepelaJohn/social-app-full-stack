import React from "react";
import { Sectionwrapper } from "../HOC";
import { Link } from "react-router-dom";
const Error = () => {
  return <div className="max-w-large text-center py-14">
    <p className=" mb-3">We cant't find what you are looking for!...</p>
    <Link className="text-blue-400 " to="/"> Go back Home? </Link>
  </div>;
};

export default Sectionwrapper(Error, "");
