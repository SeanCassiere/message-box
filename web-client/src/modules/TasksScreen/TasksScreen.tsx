import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import Tab, { TabProps } from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel, { TabPanelProps } from "@mui/lab/TabPanel";

import { selectAppProfileState, selectLookupListsState } from "../../shared/redux/store";
import { usePermission } from "../../shared/hooks/usePermission";

import TaskModifyDialog from "./TaskModifyDialog/TaskModifyDialog";
import TaskTodayView from "./TodayView";
import TaskCompletedView from "./CompletedView";

export const inactiveTabBgColor = "#FCFCFC";
const primaryOptions = ["today", "completed"];

const TasksScreen = () => {
  const navigate = useNavigate();
  const { tab, id } = useParams<{ tab: string; id: string }>();

  const { userProfile } = useSelector(selectAppProfileState);
  const { usersList } = useSelector(selectLookupListsState);

  const isUserSwitcherAccessible = usePermission("task:admin");

  const [isEditTaskDialogOpen, setIsTaskUserDialogOpen] = useState(false);
  const [openEditTaskId, setOpenEditTaskId] = useState<string | null>(null);

  const [currentViewingOwnerId, setCurrentViewingOwnerId] = useState<string>(userProfile?.userId ?? "");
  const [allStateRender, setAllStateRender] = useState(0);
  const [primaryTabValue, setPrimaryTabValue] = useState("today");

  const handleChangeCurrentViewingOwnerId = useCallback((evt: SelectChangeEvent<string>) => {
    setCurrentViewingOwnerId(evt.target.value);
  }, []);

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
    navigate(primaryTabValue === "today" ? "/tasks/today" : "/tasks/completed");
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

  return (
    <>
      <TaskModifyDialog
        taskId={openEditTaskId}
        showDialog={isEditTaskDialogOpen}
        handleCloseFunction={handleCloseEditor}
      />
      <Paper
        sx={{
          px: 4,
          my: 2,
          py: 4,
          minHeight: "88vh",
          overflow: "hidden",
        }}
      >
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
              {isUserSwitcherAccessible && (
                <Grid item xs={12} md={4}>
                  <Select
                    labelId="ownerId-label"
                    id="ownerId"
                    name="ownerId"
                    variant="standard"
                    value={currentViewingOwnerId}
                    onChange={handleChangeCurrentViewingOwnerId}
                    sx={{ mr: 1, minWidth: "9.5em" }}
                    fullWidth
                  >
                    {usersList
                      .filter((user) => user.isActive)
                      .map((user) => (
                        <MenuItem key={`select-root-rol-${user.userId}`} value={user.userId}>
                          {`${user.firstName} ${user.lastName}`}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
              )}
              <Grid item>
                <IconButton sx={{ mr: 1 }} aria-label="refresh" onClick={handleRefreshAllItems}>
                  <RefreshOutlinedIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <Button startIcon={<AddOutlinedIcon />} onClick={handleNewTaskDialog} disableElevation>
                  New task
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <TabContext value={primaryTabValue}>
          <Box sx={{ mt: 3 }}>
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
              <Tab label="Today" value="today" sx={formCommonTabStyle(primaryTabValue, "today")} />
              <Tab label="Completed" value="completed" sx={formCommonTabStyle(primaryTabValue, "completed")} />
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
      </Paper>
    </>
  );
};

const formCommonTabStyle = (value: string, identifier: string): TabProps["sx"] => {
  return {
    backgroundColor: value === identifier ? "primary.50" : inactiveTabBgColor,
    px: 4,
  };
};

const commonTabPanelStyle: TabPanelProps["sx"] = {
  p: 0,
  pt: 1.5,
};

export default TasksScreen;
