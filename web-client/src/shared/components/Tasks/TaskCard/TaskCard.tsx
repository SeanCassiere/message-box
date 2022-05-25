import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { ITask } from "../../../interfaces/Task.interfaces";
import { markdownToForHtmlInsert, truncateTextByLength } from "../../../util/general";
import { client } from "../../../api/client";
import { colorsMap } from "../../../util/colorsMap";
import { formatDateTimeShort, formatTime } from "../../../util/dateTime";

interface Props {
  task: ITask;
  mode: string;
  triggerRefresh: () => void;
}

const TaskCard = (props: Props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const { task, mode, triggerRefresh } = props;

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

  const getBorderColor = useCallback((bgColor: string) => {
    const map = colorsMap.find((color) => color.bgColor === bgColor);
    if (map) {
      return map.borderColor;
    }
    return colorsMap[0].borderColor;
  }, []);

  return (
    <Box
      key={`${task.taskId}`}
      sx={{
        width: "100%",
        transition: "ease-in 0.2s box-shadow",
        "&:hover, &:focus": {
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      }}
    >
      <Card
        variant="outlined"
        sx={{
          marginBottom: 2,
          minHeight: "180px",
          maxHeight: {
            xs: "auto",
            md: "100%",
          },
        }}
      >
        <CardContent>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              bgcolor: task.bgColor,
              py: "5px",
              pl: 1,
              border: `1.3px solid ${getBorderColor(task.bgColor)}`,
              borderRadius: 1,
              color: theme.palette.getContrastText(task.bgColor),
            }}
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
          </Typography>
          <Grid container alignItems="center">
            <Grid item md={8}>
              <Typography
                sx={{ fontSize: 13, flexGrow: 1, cursor: "pointer" }}
                color={task.isOverDue ? "error" : "text.secondary"}
                onClick={() => handleTaskClick(task.taskId)}
              >
                Due&nbsp;
                {mode === "Today" ? (
                  <>
                    time:&nbsp;
                    {formatTime(task.dueDate)}
                  </>
                ) : (
                  <>
                    date:&nbsp;
                    {formatDateTimeShort(task.dueDate)}
                  </>
                )}
              </Typography>
            </Grid>
            <Grid item md={4}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      sx={{
                        zIndex: 0,
                        borderWidth: "1px",
                        py: 1,
                      }}
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
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(TaskCard);
