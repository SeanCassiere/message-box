import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";

import { IParsedWidgetOnDashboard } from "../../../interfaces/Dashboard.interfaces";
import { ITask } from "../../../interfaces/Task.interfaces";
import { client } from "../../../api/client";
import { parseDynamicParameterForTasks } from "../helpers/task.helpers";

const COMMON_ICON_STYLE = { color: "secondary.200", fontSize: "1.2rem", m: 0, p: 0, mb: -0.5 };

interface IProps {
  widget: IParsedWidgetOnDashboard;
}

const MyTasksWidgetView = (props: IProps) => {
  const navigate = useNavigate();

  const [data, setData] = React.useState<ITask[] | null>(null);
  React.useEffect(() => {
    const params = new URLSearchParams();
    for (const item of props.widget.config) {
      params.append(item.parameter, item.value);
    }

    for (const dynamicParam of props.widget.variableOptions) {
      const parsed = parseDynamicParameterForTasks(dynamicParam);
      params.append(parsed.parameter, parsed.value);
    }

    const abortController = new AbortController();

    client.get("/Tasks", { params, signal: abortController.signal }).then((res) => {
      if (res.status === 200) {
        setData(res.data);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [props.widget]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2, mt: 1 }}>
      {data?.map((task) => (
        <Box
          sx={{
            minHeight: 50,
            borderColor: "secondary.50",
            borderWidth: 1,
            borderRadius: 1,
            borderStyle: "solid",
            py: 1,
            px: 1,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: 1,
          }}
          key={`${props.widget.widgetName}-${task.taskId}`}
          onClick={() => navigate(`/tasks/view/${task.taskId}`)}
        >
          <Box sx={{ p: 0, m: 0 }}>
            {task.isCompleted ? (
              <CheckCircleIcon sx={{ ...COMMON_ICON_STYLE }} />
            ) : (
              <CircleIcon sx={{ ...COMMON_ICON_STYLE }} />
            )}
          </Box>
          <Typography sx={{ flexGrow: 1 }}>{task.title}</Typography>
        </Box>
      ))}
      {data?.length === 0 && (
        <Box
          sx={{
            minHeight: 50,
            borderColor: "secondary.50",
            borderWidth: 1,
            borderRadius: 1,
            borderStyle: "solid",
            py: 1,
            px: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ p: 0, m: 0 }}>
            <FlagCircleIcon sx={{ ...COMMON_ICON_STYLE }} />
          </Box>
          <Typography sx={{ flexGrow: 1 }}>No tasks</Typography>
        </Box>
      )}
    </Box>
  );
};

export default MyTasksWidgetView;
