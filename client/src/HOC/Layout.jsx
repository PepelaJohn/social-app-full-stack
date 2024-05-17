import React from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineModeComment as Comment } from "react-icons/md";
function Layout({ customclass, imagesArray, maxH, commentCount, likeCount }) {
  return (
    <div
      className={`flex gap-1 w-full max-h-[600px] ${
        customclass === "reverse" ? "flex-row-reverse" : "flex-row"
      } ${!!maxH ? `h-[${maxH}px]` : ""} `}
    >
      <div className="flex-1 overflow-hidden  showOpacity  relative cursor-pointer flex justify-center items-center">
        <img
          src={imagesArray[0].file || ""}
          className="w-full object-center object-cover  min-h-full"
          alt={"nan"}
        />
        <div className="absolute gap-3 bg-trans opacity-0 cursor-pointer easeinOut top-0 left-0 right-0 bottom-0 flex justify-center items-center">
          <span className="flex items-center gap-1">
            <IoIosHeartEmpty className="text-white text-[25px]" />{" "}
            <p className="text-[9px] bg-blend-difference text-white">{imagesArray[0].likes?.length || 0}</p>
          </span>
          <span className="flex items-center gap-1">
            <Comment className="text-white text-[25px]" />

            <p className="text-[9px] bg-blend-difference text-white">{imagesArray[0].replies?.length || 0}</p>
          </span>
        </div>
      </div>
      {imagesArray.length > 1 && (
        <div className="flex  flex-col gap-1 flex-1">
          <div
            className={`w-full justify-center items-center   flex-1  overflow-hidden showOpacity relative flex`}
          >
            <img
              src={imagesArray[1].file || ""}
              className="w-full min-h-[100%] object-center object-cover cursor-pointer"
              alt={"nan"}
            />
            <div className="absolute gap-3 bg-trans opacity-0 cursor-pointer easeinOut top-0 left-0 right-0 bottom-0 flex justify-center items-center">
              <span className="flex items-center gap-1">
                <IoIosHeartEmpty className="text-white text-[25px]" />{" "}
                <p className="text-[9px] bg-blend-difference text-white">
                {imagesArray[1].likes?.length || 0}
                </p>
              </span>
              <span className="flex items-center gap-1">
                <Comment className="text-white text-[25px]" />

                <p className="text-[9px] bg-blend-difference text-white">
                {imagesArray[1].replies?.length || 0}
                </p>
              </span>
            </div>
          </div>

          {imagesArray.length > 2 && (
            <div className="w-full justify-center items-center flex flex-1  overflow-hidden showOpacity  relative">
              <img
                src={imagesArray[2].file || ""}
                className=" w-full min-h-[100%] object-center object-cover cursor-pointer"
                alt={"nan"}
              />
              <div className="absolute gap-3 bg-trans opacity-0 cursor-pointer easeinOut top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                <span className="flex items-center gap-1">
                  <IoIosHeartEmpty className="text-white text-[25px]" />{" "}
                  <p className="text-[9px] bg-blend-difference text-white">
                  {imagesArray[2].likes?.length || 0}
                  </p>
                </span>
                <span className="flex items-center gap-1">
                  <Comment className="text-white text-[25px]" />

                  <p className="text-[9px] bg-blend-difference text-white">
                  {imagesArray[2].replies?.length || 0}
                  </p>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Layout;
