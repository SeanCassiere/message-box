import React from "react";
import { useTheme } from "@mui/material/styles";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { IUserProfile } from "../../../interfaces/User.interfaces";
import { stringAvatar } from "../../Layout/NavigationWrapper/navUtils";

interface Props {
  userDetails: IUserProfile | null;
}

const BasicDetailsBlock = (props: Props) => {
  const theme = useTheme();
  const { userDetails } = props;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
          <Avatar
            {...stringAvatar(`${userDetails?.firstName.toUpperCase()} ${userDetails?.lastName.toUpperCase()}`)}
            alt={`${userDetails?.firstName.toUpperCase()} ${userDetails?.lastName.toUpperCase()}`}
            sx={{ width: 90, height: 90, fontSize: 30 }}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={9}>
        <Box display="flex" alignItems="center" sx={{ height: "100%", pt: { sm: 2, md: 0 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography
                fontSize={24}
                fontWeight={500}
                color={theme.palette.mode === "light" ? "primary.600" : "primary.100"}
              >
                {userDetails?.firstName}&nbsp;{userDetails?.lastName}
              </Typography>
            </Box>
            <Box>
              <Typography>{userDetails?.email}</Typography>
            </Box>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

export default React.memo(BasicDetailsBlock);
