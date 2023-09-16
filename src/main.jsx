import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "jotai";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider>
    <CssBaseline />
    <App />
  </Provider>
);
