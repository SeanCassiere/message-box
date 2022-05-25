import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Theme, useTheme } from "@mui/material";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import Tab, { TabProps } from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel, { TabPanelProps } from "@mui/lab/TabPanel";

import { selectUserState, selectLookupListsState } from "../../shared/redux/store";
import { usePermission } from "../../shared/hooks/usePermission";

import AddTaskDialog from "../../shared/components/Dialogs/AddTaskDialog";
import TaskTodayView from "./TodayView";
import TaskCompletedView from "./CompletedView";
import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import FormTextField from "../../shared/components/Form/FormTextField";

export const inactiveTabBgColor = "#FCFCFC";
const primaryOptions = ["today", "completed"];

const TasksScreen = () => {
  const navigate = useNavigate();
  const { tab, id } = useParams<{ tab: string; id: string }>();
  const theme = useTheme();

  const { userProfile } = useSelector(selectUserState);
  const { usersList } = useSelector(selectLookupListsState);

  const isUserSwitcherAccessible = usePermission("task:admin");
  const isTaskWriteAccessible = usePermission("task:create");

  const [isEditTaskDialogOpen, setIsTaskUserDialogOpen] = useState(false);
  const [openEditTaskId, setOpenEditTaskId] = useState<string | null>(null);

  const [currentViewingOwnerId, setCurrentViewingOwnerId] = useState<string>(userProfile?.userId ?? "");
  const [allStateRender, setAllStateRender] = useState(0);
  const [primaryTabValue, setPrimaryTabValue] = useState("today");

  const handleOpenEditTaskDialog = useCallback((editOwnerId: string) => {
    setOpenEditTaskId(editOwnerId);
    setIsTaskUserDialogOpen(true); // open the dialog
  }, []);

  const handleNewTaskDialog = useCallback(() => {
    setOpenEditTaskId(null);
    setIsTaskUserDialogOpen(true);
  }, []);

  const handleRefreshAllItems = useCallback(() => {
    setAllStateRender((i) => i + 1);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsTaskUserDialogOpen(false);
    setOpenEditTaskId(null);
    handleRefreshAllItems();
    navigate(primaryTabValue.toLowerCase() === "today" ? "/tasks/today" : "/tasks/completed");
  }, [handleRefreshAllItems, navigate, primaryTabValue]);

  const handleChangePrimaryValue = (_: React.SyntheticEvent, newValue: string) => {
    setPrimaryTabValue(newValue);
    navigate(`/tasks/${newValue}`);
  };

  useEffect(() => {
    if (id && id !== "") {
      setOpenEditTaskId(id);
      setIsTaskUserDialogOpen(true);
    }
    const lowercasePrimaryOptions = primaryOptions.map((option) => option.toLowerCase());
    if (tab) {
      if (lowercasePrimaryOptions.includes(tab?.toLowerCase())) {
        setPrimaryTabValue(tab.toLowerCase());
        navigate(`/tasks/${tab.toLowerCase()}`);
      } else {
        navigate("/tasks/today");
      }
    }
  }, [id, navigate, tab]);

  const userSelectOptions = useMemo(() => {
    return usersList
      .filter((user) => user.isActive)
      .map((user) => {
        return {
          id: user.userId,
          label: `${user.firstName} ${user.lastName}`,
        };
      });
  }, [usersList]);

  const selectedUserValue = useMemo(() => {
    const user = usersList.find((u) => u.userId === currentViewingOwnerId);

    if (!user) {
      return { label: `${userProfile?.firstName} ${userProfile?.lastName}`, id: userProfile?.userId ?? "" };
    }

    return { label: `${user.firstName} ${user.lastName}`, id: user.userId };
  }, [currentViewingOwnerId, userProfile?.firstName, userProfile?.lastName, userProfile?.userId, usersList]);

  const handleSelectCurrentUserId = useCallback(
    (
      evt: any,
      value:
        | string
        | {
            id: string;
            label: string;
          }
        | null
    ) => {
      if (!value) return;

      if (typeof value === "string") {
        const split = value.split(" ");
        const user = usersList.find((u) => u.firstName === split[0] && u.lastName === split[1]);

        if (!user) {
          return;
        }

        setCurrentViewingOwnerId(user.userId);
      }

      if (typeof value === "object") {
        setCurrentViewingOwnerId(value.id);
      }
    },
    [usersList]
  );

  return (
    <>
      <AddTaskDialog
        taskId={openEditTaskId}
        showDialog={isEditTaskDialogOpen}
        handleCloseFunction={handleCloseEditor}
      />
      <PagePaperWrapper>
        <Grid container>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight={500} component="h1">
              Tasks
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid
              container
              spacing={2}
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
              sx={{
                mt: {
                  xs: 1,
                  md: 0,
                },
              }}
            >
              <Grid item>
                <IconButton sx={{ mr: 1 }} aria-label="refresh" onClick={handleRefreshAllItems}>
                  <RefreshOutlinedIcon />
                </IconButton>
              </Grid>
              {isUserSwitcherAccessible && (
                <Grid item xs={12} md={4} alignItems="center">
                  <Autocomplete
                    id="user-tasks-view-options"
                    options={userSelectOptions}
                    value={selectedUserValue}
                    freeSolo
                    autoSelect
                    openOnFocus
                    onChange={handleSelectCurrentUserId}
                    sx={{ mr: 2, width: "100%" }}
                    size="small"
                    renderInput={(params) => (
                      <FormTextField {...params} InputProps={{ ...params.InputProps, endAdornment: <></> }} fullWidth />
                    )}
                  />
                </Grid>
              )}
              {isTaskWriteAccessible && (
                <>
                  <Grid item>
                    <Button startIcon={<AddOutlinedIcon />} onClick={handleNewTaskDialog} disableElevation={false}>
                      New task
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
        <TabContext value={primaryTabValue}>
          <Box sx={{ mt: 0 }}>
            <TabList
              onChange={handleChangePrimaryValue}
              aria-label="lab API tabs example"
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTabs-scrollButtons.Mui-disabled": {
                  opacity: 0.3,
                },
              }}
            >
              <Tab label="Today" value="today" sx={formCommonTabStyle(primaryTabValue, "today", theme)} />
              <Tab label="Completed" value="completed" sx={formCommonTabStyle(primaryTabValue, "completed", theme)} />
            </TabList>
          </Box>
          <TabPanel value="today" sx={commonTabPanelStyle}>
            <TaskTodayView
              ownerId={currentViewingOwnerId}
              refreshCountState={allStateRender}
              onFullRefresh={handleRefreshAllItems}
            />
          </TabPanel>
          <TabPanel value="completed" sx={commonTabPanelStyle}>
            <TaskCompletedView
              ownerId={currentViewingOwnerId}
              refreshCountState={allStateRender}
              onEditTask={handleOpenEditTaskDialog}
            />
          </TabPanel>
        </TabContext>
      </PagePaperWrapper>
    </>
  );
};

const formCommonTabStyle = (value: string, identifier: string, theme: Theme): TabProps["sx"] => {
  return {
    backgroundColor:
      theme.palette.mode === "light"
        ? () => {
            return value === identifier ? "primary.50" : inactiveTabBgColor;
          }
        : () => {
            return value === identifier ? "secondary.900" : "#292929";
          },
    px: 4,
  };
};

const commonTabPanelStyle: TabPanelProps["sx"] = {
  p: 0,
  pt: 1.5,
};

export default TasksScreen;
