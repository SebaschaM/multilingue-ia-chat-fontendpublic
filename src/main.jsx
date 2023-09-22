import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "jotai";

import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";
import "./index.css";
import { ContextSocketProvider } from "./store/context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextSocketProvider>
  <CssBaseline />
  <App />
</ContextSocketProvider>

);
