import React from "react";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { usePermission } from "../../hooks/usePermission";
import { IParsedWidgetOnDashboard } from "../../interfaces/Dashboard.interfaces";

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
      <Grid container sx={{ width: "100%" }}>
        <Grid item xs={12} md={12} lg={12}>
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
        </Grid>
        <Grid item xs={12} md={12} className={`${NOT_DRAGGABLE_CLASS}`}>
          <code style={{ fontSize: 14 }}>{JSON.stringify(props.widget, null, 2)}</code>
        </Grid>
      </Grid>
    </Box>
  );
});

export default WidgetCardItem;
