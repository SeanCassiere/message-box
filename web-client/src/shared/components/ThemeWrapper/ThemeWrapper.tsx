import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";

export const ThemeWrapper: React.FC = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
