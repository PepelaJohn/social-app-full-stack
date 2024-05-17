import {
  SIGN_IN,
  SIGN_UP,
  SIGN_OUT,
  UPDATE_USER,
  UPDATE,
  SUCCESS,
  ERROR,
} from "../constants";
import * as api from "../api";

export const createUser = (user, navigate) => async (dispatch) => {
  try {
    const { data } = await api.createUser(user);
    // console.log(data);
    dispatch({ type: SIGN_UP, payload: data });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.error(error);
  }
};
export const loginUser = (user, navigate) => async (dispatch) => {
  try {
    const { data } = await api.loginUser(user);
    dispatch({ type: SIGN_IN, payload: data });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.error(error);
  }
};
export const logoutUser = (user) => async (dispatch) => {
  try {
    // console.log(user);
    let userObj = { id: user };
    const { data } = await api.logoutUser(userObj);
    // console.log(data);
    dispatch({ type: SIGN_OUT });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.error(error);
  }
};

export const getUser = async (id, setProfile, dispatch) => {
  try {
    const { data } = await api.getUser(id);
    // console.log(data);
    setProfile(data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};

export const refreshToken = async (id) => {
  try {
    await api.refreshToken(id);
  } catch (error) {
    console.warn(error);
  }
};

export const updateUser = (user, setUser) => async (dispatch) => {
  try {
    const { data } = await api.updateUser(user);
    dispatch({ type: UPDATE_USER, payload: data });
    // console.log("passing");
    setUser(data);
    dispatch({ type: SUCCESS, payload: "Successfully updated Profile" });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};

export const savePost = (postId) => async (dispatch) => {
  try {
    const post = {
      postId,
    };
    const { data } = await api.savePost(post);
    dispatch({ type: UPDATE, payload: data.savedPost });
    dispatch({ type: UPDATE_USER, payload: data.user });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.log(error.message, "savepost actions");
  }
};

export const getProfilePosts = async (id, dispatch, setPosts) => {
  try {
    const { data } = await api.fetchProfilePosts(id);

    setPosts(data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
export const getSavedPosts = async (dispatch, setPosts) => {
  try {
    const { data } = await api.fetchSavedPosts();
    // console.log(data);
    setPosts(data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};

export const followUnfollowUser = (id, setUser) => async (dispatch) => {
  try {
    const { data } = await api.followUnfollow(id);
    dispatch({ type: UPDATE_USER, payload: data.followingUser });
    setUser(data.followedUser);
    // console.log(data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
export const getMessages = async (setConversations, dispatch) => {
  try {
    let { data } = await api.getMessages();
    // dispatch({ type: UPDATE_USER, payload: data.followingUser });

    data = data.sort((a, b) => a.createdAt < b.createdAt);
    setConversations(data);
    // console.log(data);
    // console.log(data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
export const getMessage = async (id, setMessages, dispatch, isGroup) => {
  try {
    const { data } = await api.getMessage(id, isGroup);
    // dispatch({type:UPDATE_USER, payload:data.followingUser})
    setMessages(data);
    // console.log(data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
export const getFollowers = async (setUsers, dispatch) => {
  try {
    const { data } = await api.getFollowers();
    // dispatch({type:UPDATE_USER, payload:data.followingUser})
    setUsers(data.following);
    // console.log(data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
export const sendMessage = async (
  body,
  setMessages,
  setConversation,
  dispatch,
  setSelectedConvo,
  mock
) => {
  try {
    const { data } = await api.sendMessage(body);
    // console.log(data);

    setMessages((message) => [...message, data.message]);
    if (mock) {
      setConversation((prev) => [data.conversation, ...prev]);
    } else {
      setConversation((prev) => {
        return prev.map((conversation) =>
          conversation._id === data.conversation._id
            ? data.conversation
            : conversation
        );
      });
    }
    setSelectedConvo(data.conversation);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
export const sendGroupMessage = async (
  groupId,
  body,
  setMessages,
  setConversation,
  dispatch,
  setMessage
) => {
  try {
    const { data } = await api.createGroupMessages(groupId, body);
    console.log(data, "cretegroupmessage");

    setMessages((message) => [...message, data.message]);

    setConversation((prev) => {
      return prev.map((conversation) =>
        conversation._id === data.conversation._id
          ? data.conversation
          : conversation
      );
    });
    setMessage({ text: "", img: "" });

    // setSelectedConvo(data.conversation);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
export const getGroupMessages = async (body, dispatch, setMessages) => {
  try {
    const { data } = await api.getGroupMessages(body);
    console.log(data, "getgroupmessages");

    setMessages(data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
export const addParticipantToGroup = async (
  groupId,
  body,
  dispatch,
  setConversation,
  setSelectedUsers,setUsers
) => {
  try {
    const { data } = await api.addParticipantToGroup(groupId, body);
    console.log(data, "addparticipant to group");
    setConversation((prev) =>
      prev.map((conversation) =>
        conversation._id === data._id ? data : conversation
      )
    );
    setSelectedUsers([]);
    setUsers([])
    dispatch({ type: SUCCESS, payload: "User added to group" });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
export const createGroup = async (
  body,
  setConversation,
  dispatch,
  setFormData,
  setSelectedConvo
) => {
  try {
    const { data } = await api.createGroup(body);
    // console.log(data, "cretegroupmessage");

    setConversation((prev) => [data, ...prev]);
    setFormData({ groupName: "", groupDescription: "" });

    setSelectedConvo(data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.warn(error);
  }
};
