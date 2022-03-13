import { useCallback, useState } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import ResetWith2FA from "./ResetWith2FA";
import ResetWithOldPassword from "./ResetWithOldPassword";
import PageBlockItem from "../../../../shared/components/Layout/PageBlockItem";

import { selectUserState } from "../../../../shared/redux/store";
import { client } from "../../../../shared/api/client";
import { MESSAGES } from "../../../../shared/util/messages";

const PageLayout = () => {
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const applicationProfile = useSelector(selectUserState);

  const [isSendingEmailStrategy, setIsSendingEmailStrategy] = useState(false);
  const handleSendEmailStrategy = useCallback(() => {
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
      });
  }, [applicationProfile.userProfile?.email, enqueueSnackbar]);

  const [isSending2faEmailStrategy, setIsSending2faEmailStrategy] = useState(false);
  const handleSend2faEmailStrategy = useCallback(() => {
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
      });
  }, [applicationProfile.userProfile?.userId, enqueueSnackbar]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          flexDirection: isOnMobile ? "column" : "row",
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            width: isOnMobile ? "100%" : "auto",
          }}
        >
          <Typography variant="h5">Change Password</Typography>
        </Box>
        <Box
          sx={{
            // flexGrow: 1,
            width: isOnMobile ? "100%" : "auto",
            display: "inline-flex",
            gap: "1rem",
            flexDirection: isOnMobile ? "column" : "row",
            // "& > *": { flexGrow: 1 },
          }}
        >
          <LoadingButton
            variant="contained"
            color="secondary"
            startIcon={<QrCodeScannerIcon />}
            size="large"
            onClick={handleSend2faEmailStrategy}
            loading={isSending2faEmailStrategy}
          >
            Reset 2FA
          </LoadingButton>
          <LoadingButton
            variant="contained"
            startIcon={<MarkEmailReadIcon />}
            size="large"
            onClick={handleSendEmailStrategy}
            loading={isSendingEmailStrategy}
          >
            Via E-Mail
          </LoadingButton>
        </Box>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <PageBlockItem title="Using your Two-Factor code" badgeText="Recommended">
            <ResetWith2FA />
          </PageBlockItem>
        </Grid>
        <Grid item xs={12} md={6}>
          <PageBlockItem title="Using your old password">
            <ResetWithOldPassword />
          </PageBlockItem>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageLayout;
