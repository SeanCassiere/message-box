import React from "react";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { usePermission } from "../../hooks/usePermission";
import { IParsedWidgetOnDashboard } from "../../interfaces/Dashboard.interfaces";

import MyTasksList from "./widgets/MyTasksList";
import MyTasksCompletionChart from "./widgets/MyTasksCompletionChart";

const NOT_DRAGGABLE_CLASS = "grid-not-draggable";

interface IProps {
  widget: IParsedWidgetOnDashboard;
  deleteWidgetHandler?: (id: string) => void;
}

const WidgetCardItem = React.memo((props: IProps) => {
  const canWriteToDashboard = usePermission("dashboard:write");

  return (
    <Box
      sx={{
        cursor: "pointer",
        flexGrow: 1,
        px: {
          xs: 1,
          sm: 2,
        },
        pt: {
          xs: 1,
          md: 1,
        },
        height: "100%",
      }}
    >
      <Stack flexDirection="column" sx={{ width: "100%", height: "100%" }}>
        <Box flexGrow={0} sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              fontSize={18}
              fontWeight={400}
              sx={{
                flexGrow: 1,
                color: "grey.700",
              }}
            >
              {props.widget.widgetName}
            </Typography>
            <IconButton
              sx={{ m: 0, color: "grey.700" }}
              aria-label="delete"
              onClick={() => {
                if (props.deleteWidgetHandler) {
                  props.deleteWidgetHandler(props.widget.id);
                } else {
                  alert("A handler for deleting has not been set-up");
                }
              }}
              disabled={canWriteToDashboard === false}
              className={`${NOT_DRAGGABLE_CLASS}`}
            >
              <DeleteIcon color={canWriteToDashboard ? "inherit" : "disabled"} sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Box>
        </Box>
        <Box
          className={`${NOT_DRAGGABLE_CLASS}`}
          sx={{
            flexGrow: 1,
            overflow: "auto",
            cursor: "text",
          }}
        >
          <RenderWidget widget={props.widget} />
        </Box>
      </Stack>
    </Box>
  );
});

interface IRenderWidgetProps {
  widget: IParsedWidgetOnDashboard;
}
const RenderWidget = React.memo((props: IRenderWidgetProps) => {
  switch (props.widget.widgetType) {
    case "MyTasks":
      return <MyTasksList widget={props.widget} />;
    case "EmployeeTasks":
      return <MyTasksList widget={props.widget} />;
    case "MyTasksCompletion":
      return <MyTasksCompletionChart widget={props.widget} />;
    case "EmployeeTasksCompletion":
      return <MyTasksCompletionChart widget={props.widget} />;
    default:
      return <Box sx={{ mt: 1 }}>Widget view not built</Box>;
  }
});

export default WidgetCardItem;
