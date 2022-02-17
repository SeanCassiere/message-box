import React from "react";

import Typography from "@mui/material/Typography";

import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";

const TeamActivityLayout = () => {
  return (
    <PagePaperWrapper>
      <Typography variant="h4" fontWeight={500} component="h1">
        Team Activity
      </Typography>
    </PagePaperWrapper>
  );
};

export default TeamActivityLayout;
