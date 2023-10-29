import { Box, Typography } from "@mui/material";
import React from "react";

const MessageMe = ({ message, date }) => {
  const dateFormat = date.split(",");
  const dateDay = dateFormat[0];
  const dateHour = dateFormat[1];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignSelf: "flex-end",
        width: "fit-content",
        maxWidth: "50%",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#cff0fa",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <Typography variant="body2" component="p">
          {message}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          flexDirection: "column",
          alignSelf: "flex-end",
        }}
      >
        {/* <Typography variant="body2" component="p" sx={{ color: "#707070" }}>
          {dateDay}
        </Typography> */}
        <Typography variant="body2" component="p" sx={{ color: "#707070" }}>
          {dateHour.slice(0, 6)}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageMe;
