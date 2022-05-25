import React from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

import { drawerWidth } from "../../../util/constants";

interface CustomAppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const CustomAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<CustomAppBarProps>(({ theme, open }) => ({
  backgroundColor: theme.palette.mode === "light" ? "white" : "#121212",
  backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",

  zIndex: theme.zIndex.drawer,
  paddingLeft: `calc(${theme.spacing(1)} - 10px)`,
  [theme.breakpoints.up("sm")]: {
    paddingLeft: `calc(${theme.spacing(7)} + 20px)`,
    ...(open && {
      paddingLeft: `calc(${theme.spacing(1)})`,
    }),
  },
  transition: theme.transitions.create(["width", "margin", "padding"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 0,
    width: `100%`,
    [theme.breakpoints.up("sm")]: {
      paddingLeft: `calc(${theme.spacing(1)})`,
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    },
    transition: theme.transitions.create(["width", "margin", "padding"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default CustomAppBar;
