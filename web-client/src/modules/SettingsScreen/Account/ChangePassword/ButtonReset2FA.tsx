import React from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

import LoadingButton from "@mui/lab/LoadingButton";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import { selectUserState } from "../../../../shared/redux/store";
import { client } from "../../../../shared/api/client";
import { MESSAGES } from "../../../../shared/util/messages";

interface IProps {
  onComplete?: () => void;
  fullWidth?: boolean;
  variant?: "text" | "outlined" | "contained" | undefined;
  color?: "success" | "error" | "warning" | "info" | "inherit" | "secondary" | "primary" | undefined;
}

const ButtonReset2FA = (props: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const applicationProfile = useSelector(selectUserState);

  const [isSending2faEmailStrategy, setIsSending2faEmailStrategy] = React.useState(false);
  const handleSend2faEmailStrategy = React.useCallback(() => {
    setIsSending2faEmailStrategy(true);
    const currentHost = window.location.protocol + "//" + window.location.host;
    const confirmationPath = "/reset-2fa/";

    const bodyPayload = { userId: applicationProfile.userProfile?.userId, host: currentHost, path: confirmationPath };

    client
      .post("/Users/Reset2FA/RequestEmail", bodyPayload)
      .then((res) => {
        if (res.status === 200) {
          enqueueSnackbar("Success: Reset link has been sent to your email", { variant: "success" });
        } else {
          enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
        }
      })
      .catch((e) => {
        enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
      })
      .finally(() => {
        setIsSending2faEmailStrategy(false);
        if (props.onComplete) {
          props.onComplete();
        }
      });
  }, [applicationProfile.userProfile?.userId, enqueueSnackbar, props]);

  return (
    <LoadingButton
      disableElevation={false}
      variant={props.variant ? props.variant : "contained"}
      color={props.color ? props.color : "secondary"}
      startIcon={<QrCodeScannerIcon />}
      onClick={handleSend2faEmailStrategy}
      loading={isSending2faEmailStrategy}
      fullWidth={props.fullWidth}
    >
      Reset 2FA via E-Mail
    </LoadingButton>
  );
};

export default ButtonReset2FA;
