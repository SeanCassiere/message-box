import React from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { red, grey } from "@mui/material/colors";
import useMediaQuery from "@mui/material/useMediaQuery";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import DialogHeaderClose from "../../Dialog/DialogHeaderClose";

import { selectUserState } from "../../../redux/store";
import { publishUserStatusChange } from "../../../api/socket.service";

interface IProps {
  open: boolean;
  close: () => void;
  currentStatus: string;
  setCurrentStatus: (status: string) => void;
  dev?: boolean;
}

const RADIO_BORDER_RADIUS = "4px";

const UserAwakeDialog = (props: IProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { statusList } = useSelector(selectUserState);

  const [firstTime, setFirstTime] = React.useState(true);
  const [secondsRemaining, setSecondsRemaining] = React.useState(45);

  React.useEffect(() => {
    if (firstTime && props.open) {
      setSecondsRemaining(45);
      try {
        const audio = new Audio("/media/notification_sound.wav");
        audio.play();
      } catch (error) {
        console.log("Notification sound failed");
      }
    }
  }, [firstTime, props.open]);

  React.useEffect(() => {
    if (!props.open) {
      return;
    }

    if (secondsRemaining === 0) {
      console.log(`Kicked out for inactivity`);
      try {
        const audio = new Audio("/media/notification_sound.wav");
        audio.play();
      } catch (error) {
        console.log("Notification sound failed");
      }
      publishUserStatusChange(statusList[2].status, statusList[2].color, true);
      navigate("/logout");
      return;
    }

    if (secondsRemaining <= 20 && secondsRemaining % 4 === 0) {
      try {
        const audio = new Audio("/media/notification_sound.wav");
        audio.play();
      } catch (error) {
        console.log("Notification sound failed");
      }
    }

    const timer = setInterval(() => {
      setFirstTime(false);
      setSecondsRemaining((seconds) => seconds - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [navigate, props.open, secondsRemaining, statusList]);

  return (
    <Dialog
      open={props.dev || props.open}
      onClose={() => ({})}
      fullScreen={isOnMobile}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
    >
      <DialogHeaderClose title={`Are you still there?`} />
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12} md={12}>
            <Box sx={{ fontSize: "5rem", fontWeight: 900, textAlign: "center", color: red[200] }}>
              00:{secondsRemaining < 10 && "0"}
              {secondsRemaining}
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box
              sx={{
                width: "100%",
                // background: grey[800],
              }}
            >
              <FormControl fullWidth sx={{ ml: 1.5 }}>
                <FormLabel id="demo-radio-buttons-group-for-status-label">My current status is:</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-for-status-label"
                  value={props.currentStatus}
                  name="radio-buttons-group-for-status"
                  onChange={(_, value) => {
                    props.setCurrentStatus(value);
                  }}
                  sx={{ width: "100%" }}
                >
                  {statusList.map((statusObj) => (
                    <FormControlLabel
                      key={`radio-select-${statusObj.status.replaceAll(" ", "-")}`}
                      value={statusObj.status}
                      control={<Radio />}
                      label={statusObj.status}
                      sx={{
                        px: 1,
                        py: 1,
                        backgroundColor: props.currentStatus === statusObj.status ? grey[200] : grey[50],
                        my: 0.5,
                        borderRadius: RADIO_BORDER_RADIUS,
                        position: "relative",
                        "&::after": {
                          content: `""`,
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: "15px",
                          height: "100%",
                          backgroundColor: statusObj.color,
                          borderRadius: `0 ${RADIO_BORDER_RADIUS} ${RADIO_BORDER_RADIUS} 0`,
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box sx={{ width: "100%", margin: "0 auto" }}>
              <Button
                size="large"
                fullWidth
                onClick={() => {
                  const findStatus = statusList.filter((s) => s.status === props.currentStatus);

                  if (findStatus.length > 0) {
                    publishUserStatusChange(findStatus[0]?.status, findStatus[0]?.color);
                  }

                  if (!firstTime) {
                    setFirstTime(true);
                  }
                  props.close();
                }}
              >
                Yes I'm here
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UserAwakeDialog;
