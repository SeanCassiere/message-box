import React from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const CalendarScreen = () => {
  return (
    <Paper
      sx={{
        px: {
          xs: 1,
          md: 4,
        },
        my: 2,
        py: {
          xs: 1,
          md: 4,
        },
        minHeight: "90vh",
      }}
    >
      <Typography variant="h4" fontWeight={500} component="h1">
        Calendar
      </Typography>
    </Paper>
  );
};

export default CalendarScreen;
