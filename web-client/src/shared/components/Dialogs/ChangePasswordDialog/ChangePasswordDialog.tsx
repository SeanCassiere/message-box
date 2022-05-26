import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import red from "@mui/material/colors/red";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";

import DialogHeaderClose from "../../Dialog/DialogHeaderClose";
import ResetWith2FA from "../../../../modules/SettingsScreen/Account/ChangePassword/ResetWith2FA";
import ResetWithOldPassword from "../../../../modules/SettingsScreen/Account/ChangePassword/ResetWithOldPassword";
import ButtonReset2FA from "../../../../modules/SettingsScreen/Account/ChangePassword/ButtonReset2FA";
import ButtonResetPasswordEmail from "../../../../modules/SettingsScreen/Account/ChangePassword/ButtonResetPasswordEmail";

interface IProps {
  showDialog: boolean;
  handleClose: () => void;
}

const ChangePasswordDialog = (props: IProps) => {
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [expanded, setExpanded] = React.useState("panel1"); // controls which panel is expanded
  const handleChangeOpen = (key: string) => {
    setExpanded(key);
  };

  const passClose = () => {
    setExpanded("panel1");
    props.handleClose();
  };

  return (
    <Dialog open={props.showDialog} onClose={passClose} fullScreen={isOnMobile}>
      <DialogHeaderClose title="Change Password" onClose={passClose} startIconMode="password-icon" />
      <DialogContent>
        <Box sx={{ mt: 1, pt: 2 }}>
          <Accordion elevation={0} expanded={expanded === "panel1"} onChange={() => handleChangeOpen("panel1")}>
            <AccordionSummary
              expandIcon={
                expanded === "panel1" ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ py: 0.3 }}>Using my two-factor code</Typography>
              <Typography
                color="white"
                sx={{
                  bgcolor: red[700],
                  px: 1,
                  ml: 1,
                  borderRadius: 5,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                recommended
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ResetWith2FA onSubmit={passClose} />
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0} expanded={expanded === "panel2"} onChange={() => handleChangeOpen("panel2")}>
            <AccordionSummary
              expandIcon={
                expanded === "panel2" ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />
              }
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography sx={{ py: 0.3 }}>Using my old password</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ResetWithOldPassword onSubmit={passClose} />
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0} expanded={expanded === "panel3"} onChange={() => handleChangeOpen("panel3")}>
            <AccordionSummary
              expandIcon={
                expanded === "panel3" ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />
              }
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography sx={{ py: 0.3 }}>Send me a password reset link</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mt: 1 }}>
                <ButtonResetPasswordEmail onComplete={passClose} fullWidth />
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0} expanded={expanded === "panel4"} onChange={() => handleChangeOpen("panel4")}>
            <AccordionSummary
              expandIcon={
                expanded === "panel4" ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />
              }
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography sx={{ py: 0.3 }}>Reset 2FA via e-mail</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mt: 1 }}>
                <ButtonReset2FA onComplete={passClose} fullWidth color="primary" />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
