import React from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

import LoadingButton from "@mui/lab/LoadingButton";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import { selectUserState } from "../../../../shared/redux/store";
import { client } from "../../../../shared/api/client";
import { MESSAGES } from "../../../../shared/util/messages";

interface IProps {
  onComplete?: () => void;
  fullWidth?: boolean;
  variant?: "text" | "outlined" | "contained" | undefined;
  color?: "success" | "error" | "warning" | "info" | "inherit" | "secondary" | "primary" | undefined;
}

const ButtonResetPasswordEmail = (props: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const applicationProfile = useSelector(selectUserState);

  const [isSendingEmailStrategy, setIsSendingEmailStrategy] = React.useState(false);

  const handleSendEmailStrategy = React.useCallback(() => {
    setIsSendingEmailStrategy(true);
    const currentHost = window.location.protocol + "//" + window.location.host;
    const confirmationPath = "/forgot-password/";

    const bodyPayload = { email: applicationProfile.userProfile?.email, host: currentHost, path: confirmationPath };

    client
      .post("/Users/ResetPassword/RequestEmail", bodyPayload)
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
        setIsSendingEmailStrategy(false);
        if (props.onComplete) {
          props.onComplete();
        }
      });
  }, [applicationProfile.userProfile?.email, enqueueSnackbar, props]);

  return (
    <LoadingButton
      disableElevation={false}
      variant={props.variant ? props.variant : "contained"}
      color={props.color ? props.color : "primary"}
      startIcon={<MarkEmailReadIcon />}
      onClick={handleSendEmailStrategy}
      loading={isSendingEmailStrategy}
      fullWidth={props.fullWidth}
    >
      Reset password via E-Mail
    </LoadingButton>
  );
};

export default ButtonResetPasswordEmail;
