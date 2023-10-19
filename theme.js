import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00aee2",
    },
    secondary: {
      main: "#f44336",
    },
    error: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "Roboto",
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#00aee2",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {},
      },
    },
  },
  // Text
});

export default theme;
