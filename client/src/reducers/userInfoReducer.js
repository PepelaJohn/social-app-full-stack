import { CLOSE_DISPLAY, ERROR, SUCCESS } from "../constants";
export default (
  popup = {
    show: false,
    error: false,
    message: "",
  },
  action
) => {
  switch (action.type) {
    case ERROR:
      return { show: true, error: true, message: action.payload };
    case SUCCESS:
      return { show: true, error: false, message: action.payload };
    case CLOSE_DISPLAY:
      return { show: false, error: false, message: "" };
    default:
      return popup;
  }
};
