import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Explore, Auth, Messages, Profile, Error, Logout } from "./paths";
import {Nav, Posts} from "./components/";
const  MyRoutes = () => {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/auth/sign-in" element={<Auth />} />
        <Route path="/auth/sign-up" element={<Auth />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/auth/sign-out" element={<Logout />} />
        <Route path="/:anything" element={<Error />} />
      </Routes>
    </>
  );
};
export default MyRoutes