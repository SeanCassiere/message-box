import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { ITask } from "../../interfaces/Task.interfaces";
import { markdownToForHtmlInsert, truncateTextByLength } from "../../util/general";

interface Props {
  task: ITask;
  mode: string;
}

const TaskCard = (props: Props) => {
  const { task, mode } = props;
  const navigate = useNavigate();

  const handleTaskClick = useCallback(
    (navTaskId: string) => {
      navigate(`/tasks/${navTaskId}`);
    },
    [navigate]
  );
  return (
    <Box
      key={`${task.taskId}`}
      sx={{
        cursor: "pointer",
        width: "100%",
        transition: "ease-in 0.2s box-shadow",
        "&:hover, &:focus": {
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      }}
      onClick={() => handleTaskClick(task.taskId)}
    >
      <Card
        variant="outlined"
        sx={{
          marginBottom: 2,
          minHeight: "150px",
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }} color="text.primary" gutterBottom>
            {task.title}
          </Typography>
          <Typography sx={{ fontSize: 14, minHeight: "90px" }} color="text.secondary" gutterBottom>
            <span
              style={{ display: "block" }}
              dangerouslySetInnerHTML={{
                __html: truncateTextByLength(markdownToForHtmlInsert(task.content), {
                  maxLength: 100,
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
              mt: 2,
            }}
          >
            <Typography sx={{ fontSize: 13 }} color="text.secondary">
              {mode === "Today" ? <>Due time: {task.dueDate}</> : <>Due date: {task.dueDate}</>}
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={task.isCompleted}
                    sx={{ zIndex: 0, borderWidth: "1px" }}
                    onChange={() => ({})}
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
