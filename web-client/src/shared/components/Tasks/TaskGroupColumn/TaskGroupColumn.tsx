import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import { client } from "../../../api/client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import CircularProgress from "@mui/material/CircularProgress";

import TaskCard from "../TaskCard";

import { grey } from "@mui/material/colors";
import { ITask } from "../../../interfaces/Task.interfaces";
import { sortTasksByDateForColumn } from "../../../util/general";
import { MESSAGES } from "../../../util/messages";
import { COMMON_ITEM_BORDER_STYLING } from "../../../util/constants";

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
  const theme = useTheme();

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
    <React.Fragment>
      <Typography variant="h5" component="h3">
        {title}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          height: "66.5vh",
          overflowY: "scroll",
          marginTop: "1em",
          bgcolor: theme.palette.mode === "light" ? theme.palette.background.paper : grey[900],
          border: theme.palette.mode === "light" ? COMMON_ITEM_BORDER_STYLING : undefined,
          padding: `${showCompletedItemsCheckbox ? "0em" : "1.5em"} 1em 1em 1em`,
          borderRadius: 1,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          "&::-webkit-scrollbar": {
            // backgroundColor: grey[100],
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
          <Box
            sx={{
              mb: 1,
              pt: 1,
              position: "sticky",
              top: 0,
              zIndex: 2,
            }}
          >
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
    </React.Fragment>
  );
};

export default React.memo(TaskGroupColumn);
