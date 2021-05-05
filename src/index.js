import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Container } from "@material-ui/core";

ReactDOM.render(
  <Container
    style={{
      background:
        "linear-gradient(90deg, rgba(238,174,202,1) 4%, rgba(148,187,233,1) 100%)",
      width: "100%",
      height: "100%",
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Container>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
