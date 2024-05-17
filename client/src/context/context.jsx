import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { isCookiePresent, getCookie } from "../reducers/userReducers";
export const SocketContext = createContext();
import { store } from "../store/StoreProvider";
import { useSelector } from "react-redux";
export const useSocket = () => {
  return useContext(SocketContext);
};

const context = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const user = useSelector(state=>state.user)


  useEffect(()=>{},[])
 
  useEffect(() => {
    if(!user._id && !!socket) socket?.close()
    if(!!user._id){const socket = io("http://localhost:3000", {
      query: {
        userId:user._id
      },
    });

    setSocket(socket);

    socket.on("getOnlineUsers", (users) => {
      // console.log(users);
      setOnlineUsers(users);
    });}

    return () => socket && socket.close();
  }, [user._id]);
  
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default context;
