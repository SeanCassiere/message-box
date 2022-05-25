import React from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";

import { theme } from "./theme";
import { selectUserState } from "../../redux/store";

export const ThemeWrapper: React.FC = ({ children }) => {
  const { theme: themeMode } = useSelector(selectUserState);

  const themeFormed = React.useMemo(() => {
    return createTheme({
      ...theme,
      palette: {
        ...theme.palette,
        mode: themeMode,
      },
    });
  }, [themeMode]);

  return <ThemeProvider theme={themeFormed}>{children}</ThemeProvider>;
};
