import React from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { secondaryNavigationColor } from "../../../util/constants";

interface IProps {}

const NotificationPopoverContent = (props: IProps) => {
  return (
    <Paper
      sx={{
        width: 360,
        maxHeight: 400,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          px: 2,
          py: 2,
          bgcolor: secondaryNavigationColor,
          color: "primary.600",
          position: "sticky",
          top: 0,
        }}
      >
        <Typography fontWeight={500}>Notifications</Typography>
      </Box>
      <Box>
        <Stack direction="column" sx={{ overflowY: "auto" }}>
          <NotificationItem text="No notifications to show" />
        </Stack>
      </Box>
    </Paper>
  );
};

export default NotificationPopoverContent;

interface INotificationItem {
  text: string;
  onClick?: () => void;
}

const NotificationItem = React.memo((props: INotificationItem) => {
  return (
    <Box
      sx={{
        cursor: props.onClick ? "pointer" : "not-allowed",
        minHeight: 30,
        px: 2,
        py: 2,
        bgcolor: "whitesmoke",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "primary.300",
      }}
      onClick={props.onClick ? props.onClick : undefined}
    >
      <Typography>{props.text}</Typography>
    </Box>
  );
});
