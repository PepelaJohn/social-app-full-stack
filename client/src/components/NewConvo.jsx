import React, { useEffect, useState } from "react";
import { createGroup, getFollowers } from "../actions/users";
import { ERROR } from "../constants";
const NewConvo = ({
  getusermode,
  setUsers,
  dispatch,
  setGetusermode,
  users,
  conversations,
  setSelectedConvo,
  createGroupMode,
  setCreateGroupMode,
  setConversations,
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  

  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
  });
  const createNewGroup = (e) => {
    e.preventDefault();

    if (formData.groupName && selectedUsers.length) {
      const body = { ...formData, participants: selectedUsers };

      createGroup(
        body,
        setConversations,
        dispatch,
        setFormData,
        setSelectedConvo
      );
    } else {
      dispatch({
        type: ERROR,
        payload: "Please fill all fields",
      });
    }
  };
  return (
    <div className=" overflow-hidden w-full self-start mt-[70px] text-sm text-center items-center justify-center max-l:flex-1 max-l:mx-[50px] flex flex-col">
      <div
        className={`text-center flex flex-col justify-center items-center gap-3 w-full easeinOut ${
          !getusermode ? "h-[300px] overflow-auto " : " h-0 overflow-hidden "
        }`}
      >
        Please Select a message to start communicating... <br /> <br /> or{" "}
        <br /> <br />
        <button
          onClick={() => {
            getFollowers(setUsers, dispatch);
            setGetusermode(true);
            setCreateGroupMode(false);
          }}
          className="text-white w-fit min-w-[200px] p-3 bg-black"
        >
          Start a new conversation
        </button>
        <p>or</p>
        <button
          onClick={() => {
            getFollowers(setUsers, dispatch);
            setGetusermode(true);
            setCreateGroupMode(true);
          }}
          className="text-white w-fit cursor-pointer p-3 bg-black"
        >
          Start a new group
        </button>
      </div>

      <div
        className={`w-fit mt-[10px]  rounded-lg gap-3  scrollbar-styled easeinOut ${
          getusermode
            ? " p-3   h-[400px] overflow-auto "
            : " w-0 h-0 overflow-hidden "
        } text-center`}
      >
        {!!users.length ? (
          <>
            {users.map((user, i) => {
             
              if (!createGroupMode) {
                for (let conversation of conversations) {
                  if (conversation.participants[0]._id === user._id)
                    return <React.Fragment key={i}></React.Fragment>;
                }
              }
              
              return (
                <div
                  onClick={() => {
                    if (!createGroupMode) {
                      setGetusermode(false);
                      setSelectedConvo({
                        mock: true,
                        participants: [
                          {
                            _id: user._id,
                            name: user.name,
                            profilePic: user.profilePic,
                          },
                        ],
                      });
                    } else {
                      if (!selectedUsers.includes(user._id)) {
                        setSelectedUsers((pre) => [...pre, user._id]);
                        
                      } else {
                        setSelectedUsers((pre) =>
                          pre.filter((person) => person !== user._id)
                        );
                       
                      }
                    }
                  }}
                  className={`flex my-2 cursor-pointer gap-1 p-6 min-w-[250px] ${
                    selectedUsers.indexOf(user._id) !== -1
                      ? " bg-gray-300"
                      : "transparent"
                  } shadow-md items-center`}
                  key={i}
                >
                  <span className="h-7 w-7 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      className="w-full min-h-full object-fit object-center"
                      src={user.profilePic || ""}
                      alt="dp"
                    />
                  </span>

                  <p className="text-xs">{user.name}</p>
                </div>
              );
            })}
            {createGroupMode && (
              <div className="w-full flex flex-col gap-5">
                {!selectedUsers.length && (
                  <p className="text-sm text-red-500">
                    Select users to create a group with
                  </p>
                )}
                {selectedUsers.length > 0 && (
                  <p className="text-sm text-green-600">
                    {selectedUsers.length} user{selectedUsers.length > 1 && "s"}{" "}
                    selected
                  </p>
                )}
                <form
                  onSubmit={createNewGroup}
                  className="w-full h-fit gap-5 flex flex-col"
                  action=""
                >
                  <input
                    name="groupName"
                    onChange={handleChange}
                    className="w-full h-[60px] min-w-[300px] bg-gray-100  p-3"
                    type="text"
                    placeholder="Group Name"
                  />
                  <input
                    className="w-full h-[60px] min-w-[300px] bg-gray-100  p-3"
                    type="text"
                    placeholder="Group Descrition"
                  />

                  <button
                    name="groupDescription"
                    onChange={handleChange}
                    onClick={createNewGroup}
                    className="py-5 bg-black text-white uppercase text-sm px-2"
                  >
                    Create group
                  </button>
                </form>
                <button
                  onClick={() => {
                    setCreateGroupMode(false);
                    setGetusermode(false);
                  }}
                  className="py-5 bg-black text-white uppercase text-sm px-2"
                >
                  EXIT
                </button>
              </div>
            )}
          </>
        ) : (
          <p>
            You must follow a user to
            {createGroupMode ? " create a group " : " start a chat "} with
            them!!
          </p>
        )}
      </div>
    </div>
  );
};

export default NewConvo;
