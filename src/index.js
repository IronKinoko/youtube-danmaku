import "./index.scss";
import React from "react";
import ReactDOM from "react-dom";
import Danmaku from "./view";
import { init } from "./configStore";

window.addEventListener("load", () => {
  init(() => {
    ReactDOM.render(<Danmaku />, document.getElementById("ytb-danmaku-config"));
  });
});

console.log("[ytb-danmaku] init");
