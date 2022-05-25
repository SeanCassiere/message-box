import React from "react";
import { useTheme } from "@mui/material/styles";

import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";

import { COMMON_ITEM_BORDER_STYLING } from "../../../util/constants";

const CustomTableContainer: React.FC = ({ children }) => {
  const theme = useTheme();
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: theme.palette.mode === "light" ? COMMON_ITEM_BORDER_STYLING : "#494949", borderRadius: 1 }}
    >
      {children}
    </TableContainer>
  );
};

export default CustomTableContainer;
