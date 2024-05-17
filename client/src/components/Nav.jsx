import React, { useEffect, useRef, useState } from "react";
import { CgMenuRightAlt as Menu } from "react-icons/cg";
import { Link } from "react-router-dom";
import { CgHome as HomeIcon } from "react-icons/cg";
import { CgSearch as SearchIcon } from "react-icons/cg";
import { IoIosSend as MessageIcon } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { MdLogin as LogInIcon } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "../actions/users";
import { CLOSE_DISPLAY, ERROR } from "../constants";
import Popup from "./Popup";

const Nav = () => {
  const links = [
    {
      label: "Home",
      to: "/",
      icon: HomeIcon,
    },
    {
      label: "Explore",
      to: "/explore",
      icon: SearchIcon,
    },
    {
      label: "Messages",
      to: "/messages",
      icon: MessageIcon,
    },
  ];

  const refreshInterval = useRef(null);
  const timoeoutRef = useRef(null);

  const dispatch = useDispatch();
  const popupRef = useRef(null);
  const location = useLocation();

  const user = useSelector((state) => state.user);
  // console.log(!!Object.entries(user).length);

  const popup = useSelector((state) => state.popup);
  // const [popopInfo, setPopupInfo] = useState({show:false, message:"", error:false})

  useEffect(() => {
    if (popup.show) {
      // use different variable as this whill happen after variable has changed

      setTimeout(() => {
        popupRef.current.classList.add("translateandFade");
      }, 1000);

      timoeoutRef.current = setTimeout(() => {
        dispatch({ type: CLOSE_DISPLAY });
      }, 2000);
    }

    return () => {
      clearTimeout(timoeoutRef.current);
    };
  }, [popup.show]);

  useEffect(() => {
    if (!!(user.id || user._id)) refreshToken(user.id || user._id);
    refreshInterval.current = setInterval(() => {
      console.log("passing throught", new Date());
      if (!!(user.id || user._id)) {
        refreshToken(user.id || user._id);
      }
    }, 60 * 1000);

    return () => {
      clearInterval(refreshInterval.current);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const text = ` Your width is ${window.innerWidth} and your height is ${window.innerHeight} and your device pixelratio is ${window.devicePixelRatio}`;
    console.info(text);
  }, []);

  return (
    <>
      <nav className="fixed shadow-lg bg-dark flex justify-center bg-white z-50 top-0 left-0 right-0 h-[100px]">
        <div className=" h-full flex-1 max-w-large common-padding  flex   items-center">
          <Link
            to="/"
            className="flex items-center justify-center text-white bg-black rounded-full h-[40px] w-[40px]"
          >
            T
          </Link>
          <div className="flex items-center flex-1 max-md:hidden text-xl justify-end gap-12">
            {links.map((link) => (
              <Link
                className="hover:text-blue-400 easeinOut"
                key={link.to}
                to={link.to}
              >
                <link.icon />
              </Link>
            ))}
            <Link
              className="hover:text-blue-400 easeinOut"
              to={`/${
                user.id || user._id
                  ? `profile/${user.id || user._id}?tab=1`
                  : "auth/sign-up"
              }`}
            >
              {!(user.id || user._id) ? (
                <span>
                  <LogInIcon />
                </span>
              ) : (
                <div className="rounded-full items-center flex flex-col justify-center h-8 w-8 cursor-pointer overflow-hidden bg-gray-200 relative">
                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                  <div className="h-8 w-8 -mb-7 rounded-full bg-gray-300"></div>
                </div>
              )}
            </Link>
          </div>

          <div className="md:hidden flex flex-1 justify-end items-center">
            <Menu className="text-[25px]" />
          </div>
        </div>
      </nav>

      {popup.show && <Popup popup={popup} popupRef={popupRef} />}
    </>
  );
};

export default Nav;
