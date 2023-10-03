import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "jotai";

import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";
import "./index.css";
import { ContextSocketProvider } from "./store/context.jsx";
import { ThemeProvider } from "@mui/material";
import theme from "../theme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextSocketProvider>
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <App />
    </ThemeProvider>
  </ContextSocketProvider>
);
