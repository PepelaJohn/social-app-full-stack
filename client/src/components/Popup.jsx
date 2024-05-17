import React from "react";

const Popup = ({ popup, popupRef }) => {
  return (
    <div
      ref={popupRef}
      className={`fixed max-w-[300px] w-fit z-50 easeinOut  py-3 px-2 shadow-2xl rounded-lg flex  overflow-hidden m-auto mb-5 self-center bottom-[1vh] left-0 right-0 justify-center bg-gray-200 min-h-[45px] ${
        popup.show ? "traslate-y-0" : ""
      } pointer-events-none   items-center`}
    >
      <p
        className={`overflow-hidden text-center capitalize text-ellipsis whitespace-nowrap text-sm ${
          popup.error ? "text-red-500" : "text-green-500"
        }`}
      >
        {popup.message || ""}
      </p>
    </div>
  );
};

export default Popup;
