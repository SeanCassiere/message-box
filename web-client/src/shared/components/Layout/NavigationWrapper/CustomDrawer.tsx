import React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";

import { drawerWidth } from "../../../util/constants";
import { grey } from "@mui/material/colors";

const openedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.mode === "light" ? theme.palette.background.paper : grey[900],
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  zIndex: theme.zIndex.drawer + 1,
  [theme.breakpoints.up("sm")]: {
    // zIndex: theme.zIndex.drawer - 1,
    width: drawerWidth,
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.mode === "light" ? theme.palette.background.paper : grey[900],
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  // width: `calc(${theme.spacing(7)} + 1px)`,
  width: 0,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const CustomDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default React.memo(CustomDrawer);
