import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import App from "./App";
import { StoreProvider } from "./lib/store";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <StoreProvider><App /></StoreProvider>
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>
);
