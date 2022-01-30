import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { ITask } from "../../interfaces/Task.interfaces";
import { markdownToForHtmlInsert, truncateTextByLength } from "../../util/general";
import { client } from "../../api/client";

interface Props {
  task: ITask;
  mode: string;
  triggerRefresh: () => void;
}

const TaskCard = (props: Props) => {
  const { task, mode, triggerRefresh } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<ITask>(task);

  const handleTaskClick = useCallback(
    (navTaskId: string) => {
      navigate(`/tasks/view/${navTaskId}`);
    },
    [navigate]
  );

  const handleCheckboxToggle = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setData((contents) => {
        return { ...contents, isCompleted: checked };
      });

      client
        .put(`/Tasks/${data.taskId}`, { ...data, isCompleted: checked })
        .then((response) => {
          if (response.status !== 200) {
            enqueueSnackbar("Error: Failed to update task.", { variant: "error" });
          } else {
            enqueueSnackbar("Success: Successfully updated the task.", { variant: "success" });
          }
        })
        .catch((e) => {
          console.log(e);
          enqueueSnackbar("Error: Failed to update task.", { variant: "error" });
        })
        .finally(() => {
          triggerRefresh();
        });
    },
    [data, enqueueSnackbar, triggerRefresh]
  );

  return (
    <Box
      key={`${task.taskId}`}
      sx={{
        // cursor: "pointer",
        width: "100%",
        transition: "ease-in 0.2s box-shadow",
        "&:hover, &:focus": {
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      }}
      // onClick={() => handleTaskClick(task.taskId)}
    >
      <Card
        variant="outlined"
        sx={{
          marginBottom: 2,
          minHeight: "180px",
          maxHeight: "190px",
        }}
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 16, fontWeight: 500, cursor: "pointer" }}
            color="text.primary"
            onClick={() => handleTaskClick(task.taskId)}
            gutterBottom
          >
            {task.title}
          </Typography>
          <Typography
            sx={{ fontSize: 14, minHeight: "90px", height: "100%", cursor: "pointer" }}
            color="text.secondary"
            onClick={() => handleTaskClick(task.taskId)}
            gutterBottom
          >
            <span
              style={{ display: "block", height: "100%" }}
              dangerouslySetInnerHTML={{
                __html: truncateTextByLength(markdownToForHtmlInsert(task.content), {
                  maxLength: 50,
                  includesDots: true,
                }),
              }}
            ></span>
            {/* {truncateTextByLength(markdownToText(task.content), { maxLength: 240, includesDots: true })} */}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: 13, flexGrow: 1, cursor: "pointer" }}
              color="text.secondary"
              onClick={() => handleTaskClick(task.taskId)}
            >
              {mode === "Today" ? <>Due time: {task.dueDate}</> : <>Due date: {task.dueDate}</>}
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    // checked={task.isCompleted}
                    sx={{ zIndex: 0, borderWidth: "1px", py: 1 }}
                    checked={data.isCompleted}
                    onChange={handleCheckboxToggle}
                  />
                }
                label={
                  <Typography component="span" sx={{ fontSize: 13 }} color="text.secondary">
                    Completed
                  </Typography>
                }
              />
            </FormGroup>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(TaskCard);
