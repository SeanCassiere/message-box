import React, { useState, useMemo } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { grey } from "@mui/material/colors";
import { ITask } from "../../interfaces/Task.interfaces";
import TaskCard from "../TaskCard/TaskCard";

const dummyTasks: ITask[] = [
  {
    taskId: "8bf2b5c4-6946-4722-b49a-2059c5c903fe",
    ownerId: "19eb2ea6-34f4-4954-8cfa-21043012ba69",
    title: "some title",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo molestiae praesentium, quas reiciendis totam tempora mollit...",
    sharedWith: [],
    bgColor: "#2dd4bf",
    dueDate: "2022-01-28T04:49:53.319Z",
    isCompleted: false,
    updatedAt: "2022-01-28T04:49:53.319Z",
  },
  {
    taskId: "b16e10a7-4fe4-49be-9d8d-949fed3539c6",
    ownerId: "b3dc59e5-6628-48e2-806e-be6cb62c3fa1",
    title: "second some title",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo molestiae praesentium, quas reiciendis totam tempora mollit...",
    sharedWith: [],
    bgColor: "#2dd4bf",
    dueDate: "2022-01-28T04:49:53.319Z",
    isCompleted: false,
    updatedAt: "2022-01-28T04:49:53.319Z",
  },
  {
    taskId: "c0c23650-d765-47e5-83b0-c105e2845972",
    ownerId: "b3dc59e5-6628-48e2-806e-be6cb62c3fa1",
    title: "third some title",
    content:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo molestiae praesentium, quas reiciendis totam tempora mollit...",
    sharedWith: [],
    bgColor: "#2dd4bf",
    dueDate: "2022-01-28T04:49:53.319Z",
    isCompleted: true,
    updatedAt: "2022-01-28T04:49:53.319Z",
  },
];

interface Props {
  title: string;
  showCompletedItemsCheckbox?: true;
  mode: "Today" | "Tomorrow" | "Overdue";
}

const TaskGroupColumn = (props: Props) => {
  const { title, showCompletedItemsCheckbox, mode } = props;

  const [showCompleted, setShowCompleted] = useState(false);

  const listedTasks = useMemo(() => {
    return dummyTasks.filter((task) => {
      if (showCompleted) {
        return true;
      }
      return !task.isCompleted;
    });
  }, [showCompleted]);
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
          <Box sx={{ mb: 1, pt: 1, position: "sticky", top: 0, bgcolor: grey[100] }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox size="small" checked={showCompleted} onChange={() => setShowCompleted((i) => !i)} />}
                label="Show completed tasks"
              />
            </FormGroup>
          </Box>
        )}
        {listedTasks.map((task) => (
          <TaskCard task={task} mode={mode} />
        ))}
      </Paper>
    </>
  );
};

export default React.memo(TaskGroupColumn);
