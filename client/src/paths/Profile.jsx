import React, { useState, useRef } from "react";
import { Sectionwrapper } from "../HOC";
import { SlPencil as PencilIcon } from "react-icons/sl";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  followUnfollowUser,
  getProfilePosts,
  getSavedPosts,
  getUser,
} from "../actions/users";
import { useSelector, useDispatch } from "react-redux";
import { arrayChunk, processImage } from "../utils/constants";
import { updateUser } from "../actions/users";
import { MdBookmarks as BookMarkIcon } from "react-icons/md";
import { MdGridView as GridIcon } from "react-icons/md";
import { MdModeEditOutline as EditIcon } from "react-icons/md";
import { Layout } from "../HOC";
function Profile() {
  const currentUser = useSelector((state) => state.user);

  const tabs = [GridIcon, BookMarkIcon, EditIcon];

  // const currentTab = useQuery()

  const dispatch = useDispatch();
  const [formData, setformData] = useState({
    username: "",
    email: "",
    file: "",
    bio: "",
    name: "",
    password: "",
  });
  const [disabled, setDisabled] = useState(true);

  const userId = useParams().userId;
  const [isCurrentUser, setisCurrentUser] = useState(
    (currentUser?.id?.toString() || currentUser._id?.toString()) ===
      userId?.toString() || false
  );
  const fileRef = useRef(null);
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  // const isCurrentUser = currentUser.id === userId;

  const [user, setUser] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.username ||
      formData.file ||
      formData.email ||
      formData.name ||
      formData.bio
    ) {
      dispatch(
        updateUser(
          { ...formData, profilePic: formData.file || "", password: "" },

          setUser
        )
      );
      setformData({
        username: "",
        email: "",
        bio: "",
        name: "",
        file: "",
      });
    } else {
      console.warn("No input");
    }
  };

  const [profilePosts, setProfilePosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const chunkArrayProfile = arrayChunk(profilePosts, 2);
  const chunkArraySaved = arrayChunk(savedPosts, 2);

  useEffect(() => {
    getUser(userId, setUser, dispatch);
  }, [userId]);

  useEffect(() => {
    if (selectedTab === 0) {
      if (!!!profilePosts.length)
        getProfilePosts(userId, dispatch, setProfilePosts);
    } else if (selectedTab === 1) {
      if (!!!savedPosts.length) getSavedPosts(dispatch, setSavedPosts);
    } else if (selectedTab === 2) {
    }
    {
    }
  }, [selectedTab]);

  useEffect(() => {
    setformData({
      username: user.username || "",
      email: user.email || "",

      bio: user.bio || "",
      name: user.name || "",
    });

    // console.log(currentUser.id, userId);

    setisCurrentUser((currentUser._id || currentUser.id) === userId);
  }, [user]);
  const handleFollowUnfollow = () => {
    dispatch(followUnfollowUser(userId, setUser));
  };
  return (
    <>
      <div className="w-full flex flex-col max-w-large  ">
        <div className="flex flex-col items-center">
          <div className="bg-white flex flex-col rounded-lg w-full py-2 items-center">
            <div className="relative showOpacity flex items-center gap-1  justify-center h-[75px] w-[75px] rounded-full overflow-hidden">
              {!!formData.file || user.profilePic ? (
                <img
                  className="w-full min-h-full object-center object-cover"
                  src={!!formData.file ? formData.file : user.profilePic}
                  alt="profile"
                />
              ) : (
                <div className="rounded-full items-center flex flex-col justify-center h-full w-full cursor-pointer overflow-hidden bg-gray-200 relative">
                  <div className="h-7 w-7 rounded-full bg-gray-300"></div>
                  <div className="h-[80px] w-[80px] -mb-20 rounded-full bg-gray-300"></div>
                </div>
              )}
              {isCurrentUser && selectedTab === 2 && (
                <span
                  onClick={() => fileRef.current.click()}
                  className="absolute flex-col top-0 left-0 opacity-0 right-0 bottom-0 easeinOut flex items-center justify-center text-white text-xs cursor-pointer bg-trans"
                >
                  <PencilIcon /> Edit
                </span>
              )}
            </div>
            <p className="text-sm capitalize text-blue-700">
              {user?.name || ""}
            </p>
            <p className="text-[10px] hover:underline ">
              @{user?.username || ""}
            </p>

            {!isCurrentUser && (
              <button
                onClick={handleFollowUnfollow}
                className="text-xs my-1 easeinOut min-w-[100px] bg-blue-400 px-6 py-2"
              >
                {user?.followers?.includes(currentUser._id)
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}

            <div className="w-full flex gap-3 justify-center items-center">
              <span className="text-xs flex items-center  gap-2 p-1 min-w-[80px] ">
                {user.followers?.length || 0} Followers
              </span>
              <span className="text-xs flex items-center  gap-2 p-1 min-w-[80px] ">
                {user.following?.length || 0} Following
              </span>
            </div>

            <div className="text-sm  flex justify-center h-[30px] max-h-[50px] items-center w-7/12 overflow-hidden">
              <p>{user.bio}</p>
            </div>

            {isCurrentUser && (
              <Link to="/auth/sign-out" className="text-xs mt-1 text-red-600">
                Logout?
              </Link>
            )}

            {isCurrentUser && (
              <div className="w-[400px] relative g mt-2 flex ">
                {tabs.map((Tab, i) => {
                  return (
                    <span
                      onClick={() => setSelectedTab(i)}
                      key={i}
                      className={`text-xl  cursor-pointer flex-1 flex justify-center  p-5 `}
                    >
                      <Tab className="z-20" />
                    </span>
                  );
                })}

                <div
                  className={`flex-1 w-[33%]  absolute top-0 rightS-${selectedTab} easeinOut pointer-events-none bg-gray-100  bottom-0`}
                />
              </div>
            )}
          </div>
          <div
            className={`w-full flex scrollbar-none  py-2  rounded-lg bg-white mt-5  overflow-y-hidden `}
          >
            <div
              className={` flex w-[100%] px-32  min-w-[100%]   left-${selectedTab}  flex-col gap-1 easeinOut   `}
            >
              {!!chunkArrayProfile.length && selectedTab === 0 ? (
                <>
                  <h2 className="font-semibold text-lg my-3">
                    {isCurrentUser ? "Your posts" : "Posts"}
                  </h2>
                  {chunkArrayProfile.map((chunk, i) => (
                    <Layout key={i} maxH={400} imagesArray={chunk} />
                  ))}
                </>
              ) : (
                <span
                  className={`w-full  flex justify-center   items-center capitalize`}
                >
                  No Posts to display
                </span>
              )}
            </div>

            {isCurrentUser && (
              <>
                <div
                  className={`  px-32  flex flex-col gap-1 w-full min-w-[100%]  easeinOut  left-${selectedTab}  `}
                >
                  {!!chunkArraySaved.length && selectedTab === 1 ? (
                    <>
                      <h2 className="font-semibold text-lg my-3">
                        Your saved posts
                      </h2>
                      {chunkArraySaved.map((chunk, i) => (
                        <>
                          <Layout key={i} maxH={300} imagesArray={chunk} />
                        </>
                      ))}
                    </>
                  ) : (
                    <span
                      className={`w-full flex font-semibold flex-col px-32 justify-center   items-center capitalize`}
                    >
                      No saved Posts
                    </span>
                  )}
                </div>
                <div
                  className={`w-full   h-full px-32 min-w-[100%]   left-${selectedTab} justify-center easeinOut   items-center flex flex-col`}
                >
                  {selectedTab === 2 && (
                    <form
                      onSubmit={handleSubmit}
                      action=""
                      className="w-full h-fit easeinOut mt-5 flex gap-7 items-center flex-col"
                    >
                      <input
                        type="file"
                        name="profilePic"
                        disabled={disabled}
                        hidden
                        onChange={(e) => {
                          processImage(e, setformData, formData, dispatch);
                        }}
                        ref={fileRef}
                        id=""
                      />
                      <input
                        onChange={handleChange}
                        disabled={disabled}
                        name="name"
                        value={formData.name}
                        type="text"
                        className={`input-max ${
                          disabled ? "border-gray-300 capitalize" : ""
                        } `}
                        placeholder=""
                      />
                      <input
                        onChange={handleChange}
                        disabled={disabled}
                        name="username"
                        value={formData.username}
                        type="text"
                        className={`input-max ${
                          disabled ? "border-gray-300 lowercase" : ""
                        } `}
                        placeholder=""
                      />

                      <input
                        onChange={handleChange}
                        name="email"
                        disabled={disabled}
                        value={formData.email}
                        type="text"
                        className={`input-max ${
                          disabled ? "border-gray-300 lowercase" : ""
                        } `}
                        placeholder="pepelajohn@gmail.com"
                      />

                      <textarea
                        onChange={handleChange}
                        disabled={disabled}
                        placeholder="Bio"
                        className={`input-max h-20 ${
                          disabled ? "border-gray-300" : ""
                        } flex text-center items-center`}
                        name="bio"
                        value={formData.bio}
                        id=""
                      ></textarea>

                      <div
                        className={`text-sm justify-between text-blue-400 flex items-center gap-2 flex-start w-full max-w-[400px]`}
                      >
                        <p
                          onClick={() => {
                            disabled &&
                              setformData({
                                username: user.username || "",
                                email: user.email || "",

                                bio: user.bio || "",
                                name: user.name || "",
                              });
                            setDisabled(!disabled);
                          }}
                          className="cursor-pointer"
                        >
                          {disabled ? "Update profile?" : "Disable"}
                        </p>

                        <button
                          type="button"
                          className="text-white bg-blue-400 py-3 px-5 rounded-3xl"
                          disabled={disabled}
                          onClick={handleSubmit}
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sectionwrapper(Profile, "");
