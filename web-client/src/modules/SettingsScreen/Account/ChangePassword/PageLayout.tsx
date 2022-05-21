import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import ResetWith2FA from "./ResetWith2FA";
import ResetWithOldPassword from "./ResetWithOldPassword";
import ButtonReset2FA from "./ButtonReset2FA";
import ButtonResetPasswordEmail from "./ButtonResetPasswordEmail";
import PageBlockItem from "../../../../shared/components/Layout/PageBlockItem";

const PageLayout = () => {
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
            width: isOnMobile ? "100%" : "auto",
            display: "inline-flex",
            gap: "1rem",
            flexDirection: isOnMobile ? "column" : "row",
          }}
        >
          <ButtonReset2FA />
          <ButtonResetPasswordEmail />
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

export default React.memo(PageLayout);
