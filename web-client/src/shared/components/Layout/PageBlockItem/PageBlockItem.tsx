import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import { COMMON_ITEM_BORDER_COLOR } from "../../../util/constants";

const PageBlockItem: React.FC<{ title?: string | React.ReactNode; badgeText?: string }> = ({
  children,
  title,
  badgeText,
}) => {
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
        <>
          <Typography fontSize={17} fontWeight={400} sx={{ textTransform: "uppercase" }}>
            {title}
            {badgeText && <Chip label={badgeText} variant="filled" color="error" component="span" sx={{ ml: 1 }} />}
          </Typography>
        </>
      )}
      {children}
    </Box>
  );
};

export default PageBlockItem;
