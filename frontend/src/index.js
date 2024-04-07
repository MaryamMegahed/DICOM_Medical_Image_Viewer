import React from "react";
import ReactDOM from "react-dom/client";
import Viewer from "./App.jsx";
import "./index.css";
import initCornerstone from "./initCornerstone.js";

initCornerstone();
ReactDOM.createRoot(document.getElementById("root")).render(<Viewer />);
