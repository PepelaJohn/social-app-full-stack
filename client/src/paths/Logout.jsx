import React from "react";
import { Sectionwrapper } from "../HOC";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../actions/users";
import { useNavigate } from "react-router-dom";
const Error = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  return (
    <div className="max-w-large text-center py-14">
      <p className=" mb-3 font-semibold font-3xl">Do you want to log out?</p>
      <p
        onClick={() => {
          const id = localStorage.getItem("user")?.split("/")[1];
          id && dispatch(logoutUser(id));
          !id && alert("Not logged in");
          navigate('/')
        }}
        className="text-red-400 mb-3 cursor-pointer"
        to="/"
      >
        Logout
      </p>
      <Link to={`/`} className="text-blue-400">
        Bak home
      </Link>
    </div>
  );
};

export default Sectionwrapper(Error, "");
