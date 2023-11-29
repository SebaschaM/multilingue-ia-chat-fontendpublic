import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { format } from "date-fns";

const MessageMe = ({ message, date }) => {
  const dateToDate = new Date(date);
  // const dateFormat = format(dateToDate, "dd/MM/yyyy");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignSelf: "flex-end",
        width: "fit-content",
        maxWidth: "50%",
        position: "relative",
      }}
    >
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
          transition: "0.3s",
          opacity: isHovered ? "1" : "0",
          position: "absolute",
          bottom: "-1.2rem",
          right: "0",
          left: "0",
        }}
      >
        {/* <Typography variant="body2" component="p" sx={{ color: "#707070" }}>
          {dateDay}
        </Typography> */}
        {/* <Typography variant="body2" component="p" sx={{ color: "#707070" }}>
          {dateFormat}
        </Typography> */}
      </Box>
    </Box>
  );
};

export default MessageMe;
