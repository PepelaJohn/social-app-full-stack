import { SIGN_UP, SIGN_IN, SIGN_OUT, UPDATE_USER } from "../constants";
import { jwtDecode } from "jwt-decode";

export const isCookiePresent = !!document.cookie.split("=")[1];

export const getCookie = () => {
  let user = {};

  let variable = document.cookie?.split("=")[1];

  try {
    user = { ...jwtDecode(variable) };
    // console.log("using cookie to set user", new Date());
    // console.log(jwtDecode(variable));
    return user;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export default (
  user = isCookiePresent
    ? getCookie()
    : localStorage.getItem("user")
    ? {
        username: localStorage.getItem("user")?.split("/")[0],
        _id: localStorage.getItem("user")?.split("/")[1],
        id: localStorage.getItem("user")?.split("/")[1],
        name: localStorage.getItem("user")?.split("/")[2] || "",
      }
    : {},
  action
) => {
  switch (action.type) {
    case UPDATE_USER:
      const localItem =
        action.payload?.username +
          "/" +
          action.payload?._id +
          "/" +
          action?.payload.name || "";
      // console.log(localItem);
      if (!!localItem) {
        localStorage.setItem("user", localItem);
        return action.payload;
      } else {
        return user;
      }

    case SIGN_IN:
      localStorage.setItem(
        "user",
        action.payload.username +
          "/" +
          action.payload._id +
          "/" +
          action.payload.name
      );

      return action.payload;

    case SIGN_UP:
      localStorage.setItem(
        "user",
        action.payload.username +
          "/" +
          action.payload._id +
          "/" +
          action.payload.name
      );

      return action.payload;
    case SIGN_OUT:
      localStorage.clear();
      return {};

    default:
      if (
        !!Object.keys(user).length &&
        isCookiePresent &&
        !localStorage.getItem("user")
      ) {
        const localItem =
          user?.username + "/" + user?._id + "/" + user?.name || "";

        localStorage.setItem("user", localItem);
      }
      return user;
  }
};
