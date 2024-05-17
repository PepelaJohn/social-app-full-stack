import axios from "axios";

const authheaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
};
const posturl = "http://localhost:3000/posts";

const API = axios.create({
  baseURL: posturl,
  responseType: "json",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  withCredentials: true,
});

//POSTS
export const fetchPost = (id) =>
  API(`${posturl}/${id}`, { method: "get", authheaders });

export const fetchPosts = (start) =>
  API(`${posturl}?start=${start || "1"}`, { method: "get", authheaders });

export const likePost = (id) =>
  API(`${posturl}/like/${id}`, { method: "post", authheaders });

export const deletePost = (id) =>
  API(`${posturl}/delete/${id}`, { method: "delete", authheaders });

export const updatePost = (id) =>
  API(`${posturl}/update${id}`, { method: "patch", authheaders });

export const createPost = (data) =>
  API(posturl, {
    method: "post",
    data,

    authheaders,
  });

export const replyPost = (id, data) =>
  API(`${posturl}/reply/${id}`, { method: "post", authheaders, data });

export const retweetPost = (data) =>
  API(`${posturl}/retweet`, { method: "post", authheaders, data });

//USER

const userUrl = "http://localhost:3000/user";

export const createUser = (data) =>
  API(`${userUrl}/auth/sign-up`, { method: "post", authheaders, data });

export const loginUser = (data) =>
  API(`${userUrl}/auth/sign-in`, { method: "post", authheaders, data });
export const logoutUser = (id) =>
  API(`${userUrl}/auth/sign-out`, { method: "post", authheaders, data: id });

export const refreshToken = (id) =>
  API(`http://localhost:3000/refresh/${id}`, { method: "post", authheaders });

export const savePost = (data) =>
  API(`${userUrl}/save`, { method: "post", authheaders, data });

export const fetchSavedPosts = () =>
  API(`${posturl}/saved`, { method: "get", authheaders });

export const getUser = (id) =>
  API(`${userUrl}/profile/${id}`, { method: "get", authheaders });

export const updateUser = (data) =>
  API(`${userUrl}/profile`, { method: "patch", authheaders, data });

export const fetchProfilePosts = (id) =>
  API(`${userUrl}/profile/posts/${id}`, { method: "get", authheaders });

export const followUnfollow = (id) =>
  API(`${userUrl}/follow/${id}`, { method: "patch", authheaders });

export const getFeedPosts = () =>
  API(`${posturl}/explore`, { method: "get", authheaders });

//messages
const messageUrl = "http://localhost:3000/chat";
export const getMessages = () =>
  API(`${messageUrl}`, { method: "get", authheaders });
export const getMessage = (id, isGroup) =>
  API(`${messageUrl}/${id}?isGroup=${isGroup.toString()}`, { method: "get", authheaders });
export const sendMessage = (data) =>
  API(`${messageUrl}`, { method: "post", authheaders, data });
export const getFollowers = () =>
  API(`${userUrl}/followers`, { method: "get", authheaders });

// GROUPS

export const getGroupMessages = (groupId) => API(`${messageUrl}/group/${groupId}`, {method:'get', authheaders }) 
export const createGroupMessages = (groupId,data) => API(`${messageUrl}/group/${groupId}`, {method:'post', authheaders, data }) // message = { sender, text, ?img}
export const addParticipantToGroup = (groupId, data) => API(`${messageUrl}/group/${groupId}`, {method:'patch', authheaders, data })// const { userId } = req?.body;
export const createGroup = (data) => API(`${messageUrl}/group/new`, {method:'post', authheaders,data })// { groupName, groupDescription, participants }