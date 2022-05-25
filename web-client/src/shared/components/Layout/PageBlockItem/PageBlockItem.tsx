import React from "react";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import { COMMON_ITEM_BORDER_COLOR } from "../../../util/constants";

const PageBlockItem: React.FC<{ title?: string | React.ReactNode; badgeText?: string; height?: any }> = ({
  children,
  title,
  badgeText,
  height,
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        mt: 2,
        bgcolor: theme.palette.mode === "light" ? "#fff" : undefined,
        pt: 2,
        pb: 3,
        px: 2,
        borderRadius: 2,
        borderColor: theme.palette.mode === "light" ? COMMON_ITEM_BORDER_COLOR : "#292929",
        borderWidth: 3,
        borderStyle: "solid",
        height: height ?? "auto",
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
