import React, { useState, useMemo, useEffect, useCallback } from "react";
import { client } from "../../../shared/api/client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { grey } from "@mui/material/colors";
import { ITask } from "../../interfaces/Task.interfaces";
import TaskCard from "../TaskCard/TaskCard";

interface Props {
  title: string;
  showCompletedItemsCheckbox?: true;
  mode: "Today" | "Tomorrow" | "Overdue";
  ownerId: string;
  countUp?: number;
}

const TaskGroupColumn = (props: Props) => {
  const { title, showCompletedItemsCheckbox, mode, countUp, ownerId } = props;

  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const listedTasks = useMemo(() => {
    return allTasks.filter((task) => {
      if (showCompleted) {
        return true;
      }
      return !task.isCompleted;
    });
  }, [allTasks, showCompleted]);

  const searchForTasks = useCallback(() => {
    const params = new URLSearchParams();
    params.set("for", mode);
    params.set("ownerId", ownerId);
    client.get("/Tasks", { params }).then((response) => {
      if (response.status !== 200) {
        console.log("error searching for tasks");
        return;
      }

      setAllTasks(response.data);
    });
  }, [mode, ownerId]);

  useEffect(() => {
    searchForTasks();
  }, [searchForTasks, countUp]);

  return (
    <>
      <Typography variant="h5" component="h3" sx={{ marginTop: "1em" }}>
        {title}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          minHeight: "67vh",
          maxHeight: "67vh",
          overflowY: "scroll",
          marginTop: "1em",
          bgcolor: grey[100],
          border: `1px solid ${grey[300]}`,
          padding: `${showCompletedItemsCheckbox ? "0em" : "1.5em"} 1em 1em 1em`,
          borderRadius: "1px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          "&::-webkit-scrollbar": {
            backgroundColor: grey[100],
            width: "12px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            border: `3.5px solid rgba(0, 0, 0, 0)`,
            backgroundClip: `padding-box`,
            borderRadius: "9999px",
            backgroundColor: `${grey[400]}`,
          },
          position: "relative",
        }}
      >
        {showCompletedItemsCheckbox && (
          <Box sx={{ mb: 1, pt: 1, position: "sticky", top: 0, bgcolor: grey[100], zIndex: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox size="small" checked={showCompleted} onChange={() => setShowCompleted((i) => !i)} />}
                label="Show completed tasks"
              />
            </FormGroup>
          </Box>
        )}
        {listedTasks.map((task) => (
          <TaskCard key={task.taskId} task={task} mode={mode} />
        ))}
      </Paper>
    </>
  );
};

export default React.memo(TaskGroupColumn);
