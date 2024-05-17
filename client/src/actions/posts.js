import {
  FETCH_ALL,
  CREATE,
  DELETE,
  FETCH_ONE,
  LIKE,
  UPDATE,
  REPLY_POST,
  RETWEET_POST,
  SUCCESS,
  ERROR,
  FETCH_MORE,
} from "../constants";

import * as api from "../api";

export const getPost = () => async (dispatch) => {
  try {
    const { data: payload } = await api.fetchPosts(1);
    dispatch({ type: FETCH_ONE, payload });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.log(error);
  }
};
export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    dispatch({ type: ERROR, payload: "failed to get Posts, please refresh" });
    console.log(error);
  }
};
export const getMorePosts = (start) => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts(start);
    dispatch({ type: FETCH_MORE, payload: data });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.log(error);
  }
};
export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
    dispatch({ type: SUCCESS, payload: "Post created Successfully" });
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

export const deletePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.deletePost(id);
    dispatch({ type: DELETE, payload: data });
    dispatch({ type: SUCCESS, payload: "Deleted Post" });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.log(error);
  }
};
export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.log(error);
  }
};
export const updatePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id);
    dispatch({ type: UPDATE, payload: data });
    dispatch({ type: SUCCESS, payload: "Post Updated" });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload:
        error.response?.data?.message ||
        error.message ||
        "Unknown Error occured",
    });
    console.log(error);
  }
};

export const replyPost = (id, textdata) => async (dispatch) => {
  try {
    const { data } = await api.replyPost(id, textdata);
    dispatch({ type: REPLY_POST, payload: data });
    dispatch({ type: SUCCESS, payload: "Added Comment" });
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

export const fetchPostReply =
  (id, setComments, setLoading = () => {}) =>
  async (dispatch) => {
    console.log("starting");
    try {
      setLoading(true);
      const { data } = await api.fetchPostReply(id);
      setLoading(false);

      console.log(data, "fetchpostreplies");
      setComments(data);
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

export const retweetPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.retweetPost(post);
    dispatch({ type: RETWEET_POST, payload: data });
    dispatch({ type: SUCCESS, payload: "RePosted" });
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

export const getRecommendedPosts = () => async (dispatch) => {
  try {
    const { data } = await api.getFeedPosts();
    console.log(data);
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: "Unknown Error occured Please Refresh",
    });
    console.warn(error);
  }
};
