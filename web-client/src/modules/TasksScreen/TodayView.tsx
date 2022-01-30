import React from "react";

import Grid from "@mui/material/Grid";

import TaskGroupColumn from "../../shared/components/TaskGroupColumn/TaskGroupColumn";

/**
 * @description this component houses the view "Today" tab of the TaskScreen
 */

interface Props {
  ownerId: string;
  refreshCountState: number;
  onFullRefresh: () => void;
}
const TaskTodayView = (props: Props) => {
  const { ownerId, refreshCountState, onFullRefresh } = props;
  return (
    <>
      <Grid sx={{ mt: 0 }} container spacing={3}>
        <Grid item xs={12} md={4}>
          <TaskGroupColumn
            mode="Today"
            title="Today"
            ownerId={ownerId}
            countUp={refreshCountState}
            triggerRefresh={onFullRefresh}
            showCompletedItemsCheckbox
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TaskGroupColumn
            mode="Overdue"
            title="Overdue"
            ownerId={ownerId}
            countUp={refreshCountState}
            triggerRefresh={onFullRefresh}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TaskGroupColumn
            mode="Tomorrow"
            title="Tomorrow"
            ownerId={ownerId}
            countUp={refreshCountState}
            triggerRefresh={onFullRefresh}
            showCompletedItemsCheckbox
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TaskTodayView;
