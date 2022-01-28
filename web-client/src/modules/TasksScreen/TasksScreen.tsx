import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import TaskGroupColumn from "../../shared/components/TaskGroupColumn/TaskGroupColumn";

const TasksScreen = () => {
  return (
    <Paper sx={{ px: 4, my: 2, py: 4, minHeight: "88vh", maxHeight: "89vh", overflow: "hidden" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" fontWeight={500} component="h1">
          Tasks
        </Typography>
        <Box>
          <IconButton color="secondary" sx={{ marginRight: 1 }} aria-label="refresh" onClick={() => ({})}>
            <RefreshOutlinedIcon />
          </IconButton>
          <Button disableElevation startIcon={<AddOutlinedIcon />} onClick={() => ({})}>
            Create new task
          </Button>
        </Box>
      </Box>
      <Grid sx={{ mt: 0 }} container spacing={3}>
        <Grid item xs={12} md={4}>
          <TaskGroupColumn mode="Today" title="Today" showCompletedItemsCheckbox />
        </Grid>
        <Grid item xs={12} md={4}>
          <TaskGroupColumn mode="Overdue" title="Overdue" />
        </Grid>
        <Grid item xs={12} md={4}>
          <TaskGroupColumn mode="Tomorrow" title="Tomorrow" showCompletedItemsCheckbox />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TasksScreen;
