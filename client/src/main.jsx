import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Provider from "./store/StoreProvider.jsx";
import SocketProvider from "./context/context.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider>
    <SocketProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </SocketProvider>
  </Provider>
);
