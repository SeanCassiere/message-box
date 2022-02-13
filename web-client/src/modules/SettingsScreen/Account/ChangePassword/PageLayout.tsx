import { useCallback, useState } from "react";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import ResetWith2FA from "./ResetWith2FA";
import ResetWithOldPassword from "./ResetWithOldPassword";
import PageBlockItem from "../../../../shared/components/Layout/PageBlockItem";

import { selectUserState } from "../../../../shared/redux/store";
import { client } from "../../../../shared/api/client";
import { MESSAGES } from "../../../../shared/util/messages";

const PageLayout = () => {
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

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
        <Box>
          <Typography variant="h5">Change Password</Typography>
        </Box>
        <Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
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
          <PageBlockItem title="Using your Two-Factor code">
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
