import React, { useEffect, useState } from "react";
import { Sectionwrapper } from "../HOC";
import { IoLogoGoogle as GoogleIcon } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser, loginUser } from "../actions/users";
import { useNavigate } from "react-router-dom";

//IoMdCheckbox IoMdCheckboxOutline
const Auth = () => {
  const path = useLocation().pathname.split("/");
  const location = path[path.length - 1];
  const  navigate = useNavigate()
  const [isSignin, setisSignin] = useState(location === "sign-in");
  const dispatch = useDispatch();
  const [formData, setformData] = useState({
    name: "",
    username: "",
    email: "",
    repeatEmail: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !isSignin &&
      formData.name.trimStart() &&
      formData.username.trimStart() &&
      formData.email.trimStart() &&
      formData.password.trimStart() &&
      formData.repeatEmail.trimStart() &&
      formData.repeatPassword.trimStart()
    ) {
      dispatch(createUser(formData, navigate));
    } else if (
      isSignin &&
      (formData.username.trimStart() || formData.email.trimStart()) &&
      formData.password.trimStart()
    ) {
      dispatch(loginUser(formData, navigate));
    } else {
      alert("Could not process");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/");
    
  }, []);
  return (
    <div className="max-w-large w-full bg-borde flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold my-5 text-blue-400">
        {isSignin ? "Sign In" : "Sign-up"}
      </h1>
      <form
        onSubmit={handleSubmit}
        action=""
        className="w-full h-fit easeinOut flex gap-7 items-center flex-col"
      >
        {!isSignin && (
          <input
            onChange={handleChange}
            name="name"
            value={formData.name}
            type="text"
            className="input-max"
            placeholder={`Input your Name...`}
          />
        )}
        <input
          onChange={handleChange}
          name="username"
          value={formData.username}
          type="text"
          className="input-max"
          placeholder={`${isSignin ? "Username " : "Choose a username..."}`}
        />

        {isSignin && (
          <p className="text-sm text-blue-400 cursor-pointer max-w-[400px] w-full h-[10px] gap-2 flex items-center justify-end">
            Use email instead
          </p>
        )}
        {!isSignin && (
          <>
            <input
              onChange={handleChange}
              name="email"
              value={formData.email}
              type="email"
              className="input-max"
              placeholder="johndoe@gmail.com"
            />
            <input
              onChange={handleChange}
              name="repeatEmail"
              value={formData.repeatEmail}
              type="email"
              className="input-max"
              placeholder="johndoe@email.com"
            />
          </>
        )}
        <input
          onChange={handleChange}
          autoComplete="true"
          name="password"
          value={formData.password}
          type="password"
          className="input-max"
          placeholder="Password "
        />
        {!isSignin && (
          <input
            onChange={handleChange}
            name="repeatPassword"
            value={formData.repeatPassword}
            type="text"
            className="input-max easeinOut"
            placeholder="Repeat Password"
          />
        )}
        <button
          type="button"
          className="bg-blue-400 w-full max-w-[400px] p-3 rounded-full text-white uppercase"
          onClick={handleSubmit}
        >
          {isSignin ? "Sign In" : "Sign-up"}
        </button>
        <button
          type="button"
          className="bg-blue-400 w-full max-w-[400px] p-3 flex items-center justify-center gap-3 rounded-full text-white uppercase"
        >
          Sign {isSignin ? "In" : "Up"} with google
          <GoogleIcon className="text-red-300" />
        </button>
        <div className="text-sm justify-between text-blue-400 flex items-center gap-2 flex-start w-full max-w-[400px]">
          <p className="flex items-center">
            <input
              value={formData.username}
              className="cursor-pointer mr-2"
              type="checkbox"
              name=""
              id="checkbox"
            />
            <label className="cursor-pointer" htmlFor="checkbox">
              Keep me signed in
            </label>
          </p>
          <Link
            onClick={() => setisSignin(!isSignin)}
            to={`/auth/${isSignin ? "sign-up" : "sign-in"}`}
          >
            {isSignin ? "Create an Account?" : "Have an Account?"}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Sectionwrapper(Auth);
