import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { COMMON_ITEM_BORDER_COLOR } from "../../util/constants";

const PageBlockItem: React.FC<{ title?: string }> = ({ children, title }) => {
  return (
    <Box
      sx={{
        mt: 2,
        bgcolor: "#fff",
        pt: 2,
        pb: 3,
        px: 2,
        borderRadius: 2,
        borderColor: COMMON_ITEM_BORDER_COLOR,
        borderWidth: 3,
        borderStyle: "solid",
      }}
    >
      {title && (
        <Typography fontSize={16} fontWeight={400} sx={{ textTransform: "uppercase" }}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default PageBlockItem;
