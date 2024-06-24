import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-datetime/css/react-datetime.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/index.cjs";
import App from "./Components/App"; 

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
