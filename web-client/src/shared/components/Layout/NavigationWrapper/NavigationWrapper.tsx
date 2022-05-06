import React, { useEffect, useMemo } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { indigo } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import ScrollTop from "./ScrollTop/ScrollTop";
import DrawerHeaderSpacer from "./DrawerHeaderSpacer";
import CustomAppBar from "./CustomAppBar";
import CustomDrawer from "./CustomDrawer";
import SuspenseLoadingWrapper from "../../SuspenseLoadingWrapper";
import NotificationPopoverContent from "./NotificationPopoverContent";
import UserAwakeDialog from "./UserAwakeDialog";

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
import Popover from "@mui/material/Popover";

import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatIcon from "@mui/icons-material/Chat";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TodayIcon from "@mui/icons-material/Today";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import PeopleIcon from "@mui/icons-material/People";

import { selectLookupListsState, selectUserState } from "../../../redux/store";
import { stringAvatar } from "./navUtils";
import { secondaryNavigationColor } from "../../../util/constants";
import { usePermission } from "../../../hooks/usePermission";
import { socket_publishUserStatusChange } from "../../../api/socket.service";
import { setAwakeDialogState } from "../../../redux/slices/user/userSlice";
import { DEFAULT_USER_STATUSES } from "../../../util/general";

const NavigationWrapper: React.FC = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const matchLargerThanPhone = useMediaQuery(theme.breakpoints.up("sm"));

  const { children } = props;
  const { userProfile, statusList, showAwakeDialog } = useSelector(selectUserState);
  const { onlineUsersList } = useSelector(selectLookupListsState);

  const isChatAccessible = usePermission("chat:read");
  const isTasksAccessible = usePermission("task:read");
  const isCalendarAccessible = usePermission("calendar:read");
  const isTeamActivityAccessible = usePermission("team-activity:read");
  const isReportsAccessible = usePermission("report:read");
  const routesList = useMemo(() => {
    const listedRoutes = [];

    if (isChatAccessible) {
      listedRoutes.push({ route: "/chat", name: "Chat", Icon: ChatIcon, key: "/chat" });
    }
    if (isTasksAccessible) {
      listedRoutes.push({ route: "/tasks/today", name: "Tasks", Icon: AssignmentIcon, key: "/tasks" });
    }
    if (isCalendarAccessible) {
      listedRoutes.push({ route: "/calendar", name: "Calendar", Icon: TodayIcon, key: "/calendar" });
    }
    if (isTeamActivityAccessible) {
      listedRoutes.push({ route: "/team-activity", name: "Team Activity", Icon: PeopleIcon, key: "/team-activity" });
    }
    if (isReportsAccessible) {
      listedRoutes.push({ route: "/reports", name: "Reports", Icon: InsertChartIcon, key: "/reports" });
    }

    return listedRoutes;
  }, [isCalendarAccessible, isChatAccessible, isReportsAccessible, isTasksAccessible, isTeamActivityAccessible]);

  const isUserProfileAccessible = usePermission("profile:read");
  const isChangePasswordAccessible = usePermission("profile:write");
  const profileRouteList = useMemo(() => {
    const listedRoutes = [];

    if (isUserProfileAccessible) {
      listedRoutes.push({ route: "/settings/account/my-account", name: "My Account" });
    }
    if (isChangePasswordAccessible) {
      listedRoutes.push({ route: "/settings/account/change-password", name: "Change Password" });
    }
    listedRoutes.push({ route: "/logout", name: "Logout" });

    return listedRoutes;
  }, [isChangePasswordAccessible, isUserProfileAccessible]);

  const [currentLink, setCurrentLink] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const [currentStatusValue, setCurrentStatusValue] = React.useState(
    onlineUsersList.find((u) => u.userId === userProfile?.userId)?.status ?? "Online"
  );
  const statusSetter = React.useCallback((newStatus: string) => {
    setCurrentStatusValue(newStatus);
  }, []);

  // handle the user dropdown menu
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // accessing the constantly changing pathName otherwise gotten from window.location.pathname
  const location = useLocation();

  // set the current page
  useEffect(() => {
    const urlLocation = location.pathname.split("/");
    const pagesKeyList = routesList.map((r) => {
      const returnRoute = r.route.split("/")[1];
      return `/${returnRoute}`;
    });
    if (pagesKeyList.includes(`/${urlLocation[1].toLowerCase()}`)) {
      setCurrentLink(`/${urlLocation[1].toLowerCase()}`);
    }
  }, [location.pathname, routesList]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigatePress = (route: string) => {
    const split = route.split("/");

    if (split[1] === "logout") {
      socket_publishUserStatusChange(statusList[2].status, statusList[2].color);
    }

    setCurrentLink(`/${split[1]}`);
    navigate(route);
  };

  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleNotificationButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleCloseNotificationsTray = () => {
    setNotificationAnchorEl(null);
  };

  const openNotificationTray = Boolean(notificationAnchorEl);
  const notificationButtonId = openNotificationTray ? "simple-popover" : undefined;

  const currentOnlineIndicatorColor =
    statusList.find((s) => s.status === currentStatusValue)?.color ?? DEFAULT_USER_STATUSES[2].color;

  return (
    <>
      {/** user awake dialog */}
      <UserAwakeDialog
        open={showAwakeDialog}
        close={() => dispatch(setAwakeDialogState(false))}
        currentStatus={currentStatusValue}
        setCurrentStatus={statusSetter}
        // dev
      />
      {/** navbar */}
      <Box sx={{ display: "flex", maxHeight: "100%", overflowY: "hidden" }}>
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
            <Box sx={{ flexGrow: 0, ml: 1, mr: 1, minWidth: "30vw" }}>
              <TextField
                id="standard-select-currency"
                select
                value={statusList.find((s) => s.status === currentStatusValue)?.status ? currentStatusValue : "Online"}
                onChange={(evt) => {
                  const value = evt?.target?.value;
                  const findStatus = statusList.filter((s) => s.status === value);

                  if (findStatus.length > 0) {
                    socket_publishUserStatusChange(findStatus[0]?.status, findStatus[0]?.color);
                  }

                  setCurrentStatusValue(value);
                }}
                variant="standard"
                fullWidth
                size="medium"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <Box
                      component="span"
                      sx={{ width: 7, height: 7, bgcolor: currentOnlineIndicatorColor, borderRadius: 50 }}
                    ></Box>
                  ),
                }}
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
                {statusList.map((status, idx) => (
                  <MenuItem
                    key={`${idx}-${String(status.status).toLowerCase().replace(" ", "-")}-${status.color}`}
                    value={`${status.status}`}
                  >
                    <Box
                      component="span"
                      sx={{ width: 10, height: 10, bgcolor: status.color, borderRadius: 50, mr: 2 }}
                    ></Box>
                    {status.status}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                aria-describedby={notificationButtonId}
                color="secondary"
                size="medium"
                sx={{
                  borderRadius: "2px",
                  mr: 1,
                  bgcolor: secondaryNavigationColor,
                  ":hover": { bgcolor: secondaryNavigationColor },
                }}
                onClick={handleNotificationButtonClick}
              >
                <Badge badgeContent={0} color="primary" overlap="circular">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Popover
                id={notificationButtonId}
                open={openNotificationTray}
                anchorEl={notificationAnchorEl}
                onClose={handleCloseNotificationsTray}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <NotificationPopoverContent />
              </Popover>
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
                  disableElevation={false}
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
                onClick={handleCloseUserMenu}
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
              {routesList.map(({ route, name, Icon, key }) => (
                <Tooltip key={route} title={name} PopperProps={{ disablePortal: open }} placement="right">
                  <ListItem button onClick={() => handleNavigatePress(route)} sx={{ my: 1 }}>
                    <ListItemIcon>
                      <Icon color={key === currentLink ? "primary" : "inherit"} />
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
              {routesList.map(({ route, name, Icon, key }) => (
                <Tooltip key={route} title={name} PopperProps={{ disablePortal: open }} placement="right">
                  <ListItem button onClick={() => handleNavigatePress(route)}>
                    <ListItemIcon>
                      <Icon color={key === currentLink ? "primary" : "inherit"} />
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

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 2,
            bgcolor: "#F9F9F9",
            width: "100%", // needed for responsive on mobile, don't really know why sometimes
            height: "100vh", // needed for responsive on mobile, don't really know why sometimes
            overflowY: "auto", // needed for responsive on mobile, don't really know why sometimes
            // minHeight: "99vh",
            // maxHeight: "100%",
          }}
        >
          <DrawerHeaderSpacer id="back-to-top-anchor" />
          <SuspenseLoadingWrapper>{children}</SuspenseLoadingWrapper>
          <ScrollTop {...props}>
            <Fab color="secondary" size="medium" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </Box>
      </Box>
    </>
  );
};

export default NavigationWrapper;
