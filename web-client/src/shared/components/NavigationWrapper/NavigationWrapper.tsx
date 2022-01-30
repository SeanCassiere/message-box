import React, { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { indigo } from "@mui/material/colors";

import { selectAppProfileState } from "../../redux/store";
import { stringAvatar } from "./navUtils";

import ScrollTop from "../ScrollTop/ScrollTop";
import DrawerHeaderSpacer from "./DrawerHeaderSpacer";
import CustomAppBar from "./CustomAppBar";
import CustomDrawer from "./CustomDrawer";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import TextField from "@mui/material/TextField";

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatIcon from "@mui/icons-material/Chat";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { secondaryNavigationColor } from "../../util/constants";

const profileRouteList = [{ route: "/logout", name: "Logout" }];
const routesList = [
  { route: "/chat", name: "Chat", Icon: ChatIcon },
  { route: "/tasks/today", name: "Tasks", Icon: AssignmentIcon },
];

const NavigationWrapper: React.FC = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const matchLargerThanPhone = useMediaQuery(theme.breakpoints.up("sm"));

  const { children } = props;
  const [currentLink, setCurrentLink] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const { userProfile } = useSelector(selectAppProfileState);

  const [currentStatusValue, setCurrentStatusValue] = React.useState("30");

  // handle the user dropdown menu
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // set the current page
  useEffect(() => {
    const urlLocation = window.location.pathname.split("/");
    const pagesKeyList = routesList.map((r) => r.route);
    if (pagesKeyList.includes(`/${urlLocation[1].toLowerCase()}`)) {
      setCurrentLink(`/${urlLocation[1].toLowerCase()}`);
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigatePress = (route: string) => {
    setCurrentLink(route);
    navigate(route);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CustomAppBar position="fixed" open={open} elevation={0}>
        <Toolbar>
          {!matchLargerThanPhone && (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={open ? handleDrawerClose : handleDrawerOpen}
                edge="start"
                sx={{
                  marginLeft: "0px",
                  paddingLeft: "0px",
                }}
              >
                <MenuIcon color={open ? "primary" : "inherit"} />
              </IconButton>
            </Box>
          )}
          <Box sx={{ flexGrow: 1 }}></Box>
          {matchLargerThanPhone && (
            <Box sx={{ flexGrow: 0, ml: 1, mr: 1, minWidth: "65ch" }}>
              <TextField
                id="standard-select-currency"
                select
                // label='Select'
                value={currentStatusValue}
                onChange={(evt) => setCurrentStatusValue(evt.target.value)}
                variant="standard"
                fullWidth
                size="medium"
                InputProps={{ disableUnderline: true }}
                sx={{
                  px: 2,
                  py: 0.5,
                  backgroundColor: secondaryNavigationColor,
                  borderRadius: "5px",
                  // "& .MuiSelect-nativeInput": { border: "none" },
                  "& .MuiSelect-select": { color: "primary.600", fontWeight: 500, fontSize: 15, border: "none" },
                  "& .MuiSelect-icon": { color: "primary.600" },
                }}
              >
                <MenuItem value="10">General work</MenuItem>
                <MenuItem value="20">Busy</MenuItem>
                <MenuItem value="30">Away from desk</MenuItem>
              </TextField>
              {/* <FormControl sx={{ mr: 1 }} fullWidth>
								<InputLabel id='demo-simple-select-label'>Currently?</InputLabel>
								<Select
									variant='outlined'
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									value={30}
									label='Age'
									onChange={() => ({})}
									size='small'
								>
									<MenuItem value={10}>General work</MenuItem>
									<MenuItem value={20}>Busy</MenuItem>
									<MenuItem value={30}>Away from desk</MenuItem>
								</Select>
							</FormControl> */}
            </Box>
          )}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              color="secondary"
              size="medium"
              sx={{
                borderRadius: "2px",
                mr: 1,
                bgcolor: secondaryNavigationColor,
                ":hover": { bgcolor: secondaryNavigationColor },
              }}
            >
              <Badge badgeContent={1} color="primary" overlap="circular">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              color="secondary"
              size="medium"
              sx={{
                borderRadius: "2px",
                mr: 1,
                bgcolor: secondaryNavigationColor,
                ":hover": { bgcolor: secondaryNavigationColor },
              }}
              onClick={() => handleNavigatePress("/settings/account")}
            >
              <SettingsIcon />
            </IconButton>
            {matchLargerThanPhone && (
              <Button
                size="medium"
                disableElevation
                style={{ textTransform: "none", paddingRight: "25px", paddingTop: "8px", paddingBottom: "8px" }}
                endIcon={anchorElUser ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={handleOpenUserMenu}
                color="primary"
              >
                Hi, {userProfile?.firstName}
              </Button>
            )}
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                {...stringAvatar(`${userProfile?.firstName.toUpperCase()} ${userProfile?.lastName.toUpperCase()}`)}
                alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                sx={{
                  width: 36,
                  height: 36,
                  ml: matchLargerThanPhone ? -2 : 0,
                  color: indigo[500],
                  bgcolor: secondaryNavigationColor,
                }}
              />
            </IconButton>
            <Menu
              sx={{ mt: "38px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {profileRouteList.map((setting) => (
                <MenuItem key={setting.route} component={RouterLink} to={setting.route}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </CustomAppBar>
      {matchLargerThanPhone ? (
        <CustomDrawer variant="permanent" anchor="left" open={open} elevation={1}>
          {matchLargerThanPhone && (
            <DrawerHeaderSpacer sx={{ px: 0 }}>
              <List sx={{ width: "100%" }}>
                <ListItem button onClick={open ? handleDrawerClose : handleDrawerOpen}>
                  <ListItemIcon>
                    <MenuIcon color={open ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Menu"
                    primaryTypographyProps={{ color: open ? "primary" : "inherit" }}
                    secondaryTypographyProps={{ color: "primary" }}
                  />
                </ListItem>
              </List>
            </DrawerHeaderSpacer>
          )}
          <List>
            {routesList.map(({ route, name, Icon }) => (
              <Tooltip key={route} title={name} PopperProps={{ disablePortal: open }} placement="right">
                <ListItem button onClick={() => handleNavigatePress(route)}>
                  <ListItemIcon>
                    <Icon color={route === currentLink ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={name}
                    primaryTypographyProps={{ color: route === currentLink ? "primary" : "inherit" }}
                    secondaryTypographyProps={{ color: "primary" }}
                  />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </CustomDrawer>
      ) : (
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClick={handleDrawerClose}
          sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: "70vw" } }}
          elevation={1}
        >
          {matchLargerThanPhone && (
            <DrawerHeaderSpacer sx={{ px: 0 }}>
              <List sx={{ width: "100%" }}>
                <ListItem button onClick={open ? handleDrawerClose : handleDrawerOpen}>
                  <ListItemIcon>
                    <MenuIcon color={open ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Menu"
                    primaryTypographyProps={{ color: open ? "primary" : "inherit" }}
                    secondaryTypographyProps={{ color: "primary" }}
                  />
                </ListItem>
              </List>
            </DrawerHeaderSpacer>
          )}
          <List>
            {routesList.map(({ route, name, Icon }) => (
              <Tooltip key={route} title={name} PopperProps={{ disablePortal: open }} placement="right">
                <ListItem button onClick={() => handleNavigatePress(route)}>
                  <ListItemIcon>
                    <Icon color={route === currentLink ? "primary" : "inherit"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={name}
                    primaryTypographyProps={{ color: route === currentLink ? "primary" : "inherit" }}
                    secondaryTypographyProps={{ color: "primary" }}
                  />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, px: 2, bgcolor: "#F5F5F5", minHeight: "100vh" }}>
        <DrawerHeaderSpacer id="back-to-top-anchor" />
        {children}
        <ScrollTop {...props}>
          <Fab color="secondary" size="medium" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </Box>
    </Box>
  );
};

export default NavigationWrapper;
