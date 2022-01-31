import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";

import { client } from "../../../shared/api/client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import CircularProgress from "@mui/material/CircularProgress";

import { grey } from "@mui/material/colors";
import { ITask } from "../../interfaces/Task.interfaces";
import TaskCard from "../TaskCard/TaskCard";
import { sortTasksByDateForColumn } from "../../util/general";
import { MESSAGES } from "../../util/messages";

interface Props {
  title: string;
  showCompletedItemsCheckbox?: true;
  mode: "Today" | "Tomorrow" | "Overdue";
  ownerId: string;
  countUp?: number;
  triggerRefresh: () => void;
}

const TaskGroupColumn = (props: Props) => {
  const { title, showCompletedItemsCheckbox, mode, ownerId, triggerRefresh, countUp } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const listedTasks = useMemo(() => {
    return allTasks.filter((task) => {
      if (showCompleted) {
        return true;
      }
      return !task.isCompleted;
    });
  }, [allTasks, showCompleted]);

  const searchForTasks = useCallback(
    (abort: AbortController) => {
      const params = new URLSearchParams();
      params.set("for", mode);
      params.set("currentDate", new Date().toISOString().substring(0, 10));
      params.set("ownerId", ownerId);
      client
        .get("/Tasks", { params, signal: abort.signal })
        .then((response) => {
          if (response.status !== 200) {
            enqueueSnackbar(`Error searching for ${mode} tasks.`, { variant: "error" });
            return;
          }

          setAllTasks(sortTasksByDateForColumn(response.data));
          setIsLoading(false);
        })
        .catch((e) => {
          if (e.message !== "canceled") {
            console.log(`Error searching for ${mode} tasks`);
            enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
          }
        });
    },
    [enqueueSnackbar, mode, ownerId]
  );

  useEffect(() => {
    const abort = new AbortController();
    searchForTasks(abort);
    return () => {
      abort.abort();
    };
  }, [searchForTasks, countUp]);

  return (
    <>
      <Typography variant="h5" component="h3">
        {title}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          minHeight: "60vh",
          maxHeight: "60vh",
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
        {isLoading && (
          <Box
            sx={{
              flexGrow: 1,
              color: "#fff",
              height: "58vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="primary" size={50} thickness={4} />
          </Box>
        )}
        {!isLoading &&
          listedTasks.map((task) => (
            <TaskCard key={`${mode}-${task.taskId}`} task={task} mode={mode} triggerRefresh={triggerRefresh} />
          ))}
      </Paper>
    </>
  );
};

export default React.memo(TaskGroupColumn);
