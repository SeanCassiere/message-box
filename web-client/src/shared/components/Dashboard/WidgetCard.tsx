import React from "react";
import { Draggable } from "react-beautiful-dnd";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { usePermission } from "../../hooks/usePermission";
import { IWidgetOnDashboard } from "../../interfaces/Dashboard.interfaces";

const DELETE_HOVER_TRANSITION = "opacity 150ms ease-in-out, color 150ms ease-in-out";

interface IProps {
  index: number;
  widget: IWidgetOnDashboard;
  minHeight?: number;
  height?: number;
  deleteWidgetHandler?: (id: string) => void;
  draggableProps?: any;
}

const WidgetCardGridItem = React.memo((props: IProps) => {
  const [isHovering, setIsHovering] = React.useState(false);

  React.useEffect(() => {
    return () => {
      setIsHovering(false);
    };
  }, []);

  const canWriteToDashboard = usePermission("dashboard:write");
  return (
    <Draggable draggableId={props.widget.id} index={props.index} isDragDisabled={!canWriteToDashboard}>
      {(provided) => (
        <Paper
          sx={{
            flexGrow: 1,
            px: {
              xs: 1,
              sm: 2,
            },
            pt: {
              xs: 1,
              md: 1,
            },
            minHeight: props?.minHeight ? props.minHeight : "100%",
            height: props?.height ? props.height : "100%",
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Grid container sx={{ width: "100%" }}>
            <Grid item xs={12} md={12} lg={12} {...provided.dragHandleProps}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  fontSize={18}
                  fontWeight={400}
                  sx={{
                    flexGrow: 1,
                    transition: DELETE_HOVER_TRANSITION,
                    color: "grey.700",
                  }}
                >
                  {props.widget.widgetName}
                </Typography>
                <IconButton
                  sx={{ m: 0, opacity: isHovering ? 1 : 0, transition: DELETE_HOVER_TRANSITION }}
                  aria-label="delete"
                  onClick={() => {
                    if (props.deleteWidgetHandler) {
                      props.deleteWidgetHandler(props.widget.id);
                    } else {
                      alert("A handler for deleting has not been set-up");
                    }
                  }}
                  disabled={canWriteToDashboard === false}
                >
                  <DeleteIcon color={canWriteToDashboard === false ? "disabled" : "error"} />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={12}>
              <code style={{ fontSize: 14 }}>{JSON.stringify(props.widget, null, 2)}</code>
              {/* <pre style={{ fontSize: 14 }}>
              </pre> */}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Draggable>
  );
});

export default WidgetCardGridItem;
