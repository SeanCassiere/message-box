import React from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const ChatScreen = () => {
  return (
    <Paper sx={{ px: 4, my: 2, py: 4, minHeight: "90vh" }}>
      <Typography variant="h4" fontWeight={500} component="h1">
        Chat
      </Typography>
      {Array.from(Array(100).keys()).map((key) => (
        <p key={key + 1}>{key + 1}</p>
      ))}
    </Paper>
  );
};

export default ChatScreen;
