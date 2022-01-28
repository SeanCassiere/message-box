import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import TaskGroupColumn from "../../shared/components/TaskGroupColumn/TaskGroupColumn";
import TaskModifyDialog from "./TaskModifyDialog";
import { selectAppProfileState } from "../../shared/redux/store";

const TasksScreen = () => {
  const { id } = useParams<{ id: string }>();

  const [isEditTaskDialogOpen, setIsTaskUserDialogOpen] = useState(false);
  const [openEditTaskId, setOpenEditTaskId] = useState<string | null>(null);
  const [allStateRender, setAllStateRender] = useState(0);

  const { userProfile } = useSelector(selectAppProfileState);

  const handleNewTaskDialog = useCallback(() => {
    setOpenEditTaskId(null);
    setIsTaskUserDialogOpen(true);
  }, []);

  const handleRefreshAllItems = useCallback(() => {
    setAllStateRender((i) => i + 1);
  }, []);

  const handleCloseEditor = useCallback(() => {
    handleRefreshAllItems();
    setIsTaskUserDialogOpen(false);
    setOpenEditTaskId(null);
  }, [handleRefreshAllItems]);

  useEffect(() => {
    if (id && id !== "") {
      setOpenEditTaskId(id);
      setIsTaskUserDialogOpen(true);
    }
  }, [id]);

  return (
    <>
      <TaskModifyDialog
        taskId={openEditTaskId}
        showDialog={isEditTaskDialogOpen}
        handleCloseFunction={handleCloseEditor}
      />
      <Paper sx={{ px: 4, my: 2, py: 4, minHeight: "88vh", maxHeight: "89vh", overflow: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" fontWeight={500} component="h1">
            Tasks
          </Typography>
          <Box>
            <IconButton color="secondary" sx={{ marginRight: 1 }} aria-label="refresh" onClick={handleRefreshAllItems}>
              <RefreshOutlinedIcon />
            </IconButton>
            <Button disableElevation startIcon={<AddOutlinedIcon />} onClick={handleNewTaskDialog}>
              Create new task
            </Button>
          </Box>
        </Box>
        <Grid sx={{ mt: 0 }} container spacing={3}>
          <Grid item xs={12} md={4}>
            <TaskGroupColumn
              mode="Today"
              title="Today"
              ownerId={userProfile?.userId ?? ""}
              countUp={allStateRender}
              triggerRefresh={handleRefreshAllItems}
              showCompletedItemsCheckbox
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TaskGroupColumn
              mode="Overdue"
              title="Overdue"
              ownerId={userProfile?.userId ?? ""}
              triggerRefresh={handleRefreshAllItems}
              countUp={allStateRender}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TaskGroupColumn
              mode="Tomorrow"
              title="Tomorrow"
              ownerId={userProfile?.userId ?? ""}
              countUp={allStateRender}
              triggerRefresh={handleRefreshAllItems}
              showCompletedItemsCheckbox
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default TasksScreen;
