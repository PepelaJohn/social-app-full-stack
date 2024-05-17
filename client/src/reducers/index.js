import { combineReducers } from "redux";
import posts from "./postReducers";
import user from "./userReducers"
import loading from "./loadingReducer";
import popup from './userInfoReducer'
export const reducers = combineReducers({ posts, user, loading, popup });
