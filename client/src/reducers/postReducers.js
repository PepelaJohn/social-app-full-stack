import {
  FETCH_ALL,
  CREATE,
  DELETE,
  FETCH_ONE,
  LIKE,
  UPDATE,
  REPLY_POST,
  RETWEET_POST,
  FETCH_MORE,
} from "../constants";
export default (posts = [], action) => {
  switch (action.type) {
    case FETCH_MORE:
      return [...posts, ...action.payload];
    case RETWEET_POST:
      return [action.payload, ...posts];
    case REPLY_POST:
      // console.log(action.payload);
      return posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );

    case FETCH_ALL:
      return action.payload;
    case FETCH_ONE:
      return action.payload;
    case LIKE:
      return posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    case UPDATE:
      return posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    case CREATE:
      return [action.payload, ...posts];
    case DELETE:
      return posts.filter((post) => post._id !== action.payload);

    default:
      return posts;
  }
};
