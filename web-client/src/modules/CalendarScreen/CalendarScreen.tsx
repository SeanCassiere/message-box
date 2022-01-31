import React from "react";

import Typography from "@mui/material/Typography";

import PagePaperWrapper from "../../shared/components/PagePaperWrapper/PagePaperWrapper";

const CalendarScreen = () => {
  return (
    <PagePaperWrapper>
      <Typography variant="h4" fontWeight={500} component="h1">
        Calendar
      </Typography>
    </PagePaperWrapper>
  );
};

export default CalendarScreen;
