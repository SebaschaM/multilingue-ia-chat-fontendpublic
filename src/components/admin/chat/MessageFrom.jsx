import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { format } from "date-fns";

const MessageFrom = ({ message, date }) => {
  const dateToDate = new Date(date);
  // const dateFormat = format(dateToDate, "dd/MM/yyyy");
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "fit-content",
        maxWidth: "50%",
        position: "relative",
      }}
    >
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          backgroundColor: "#e5e5e5",
          padding: "10px",
          borderRadius: "10px",
          transition: "0.3s",
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
          alignItems: "center",
          transition: "0.3s",
          opacity: isHovered ? "1" : "0",
          position: "absolute",
          bottom: "-1.2rem",
          right: "0",
          left: "0",
        }}
      >
        {/* <Typography variant="body2" component="p" sx={{ color: "#707070" }}>
          {date}
        </Typography> */}
        {/* <Typography variant="body2" component="p" sx={{ color: "#707070" }}>
          {dateFormat}
        </Typography> */}
      </Box>
    </Box>
  );
};

export default MessageFrom;
