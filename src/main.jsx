import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "jotai";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "jotai";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider>
    <App />
  </Provider>
);
