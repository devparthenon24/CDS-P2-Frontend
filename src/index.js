import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom"; 
import Routes from "./routes"; 
import "./assets/css/style.css";

ReactDOM.render(
  <BrowserRouter>
  <div className="spinner-container" id="loading">
        <div className="loading-spinner"></div>
      </div>
    <Routes />
  </BrowserRouter>,
  document.getElementById("root")
);