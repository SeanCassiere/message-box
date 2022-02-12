import React from "react";

import Paper from "@mui/material/Paper";

interface Props {}

const PagePaperWrapper: React.FC<Props> = (props) => {
  const { children } = props;
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "transparent",
        px: {
          xs: 1,
          // md: 4,
        },
        my: 2,
        py: {
          xs: 1,
          // md: 4,
        },
        minHeight: "88vh",
        overflow: "hidden",
      }}
    >
      {children}
    </Paper>
  );
};

export default PagePaperWrapper;
