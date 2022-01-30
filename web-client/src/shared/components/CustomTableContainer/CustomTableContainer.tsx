import React from "react";

import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import { secondaryNavigationColor } from "../../util/constants";

const CustomTableContainer: React.FC = ({ children }) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${secondaryNavigationColor}` }}>
      {children}
    </TableContainer>
  );
};

export default CustomTableContainer;
