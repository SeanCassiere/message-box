import React from "react";

import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";

import { COMMON_ITEM_BORDER_STYLING } from "../../../util/constants";

const CustomTableContainer: React.FC = ({ children }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: COMMON_ITEM_BORDER_STYLING, borderRadius: 1 }}>
      {children}
    </TableContainer>
  );
};

export default CustomTableContainer;
