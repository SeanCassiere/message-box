import React from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { IRoleProfile } from "../../../interfaces/Client.interfaces";

interface Props {
  userRoles: IRoleProfile[];
}

const BasicRolesDetails = (props: Props) => {
  const { userRoles } = props;
  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Typography fontSize={20} fontWeight={400}>
          My Access Roles
        </Typography>
      </Grid>
      <Grid item xs={12} md={12} sx={{ marginTop: 1 }}>
        <Grid container>
          {userRoles.map((role) => (
            <Grid item xs={12} md={12} key={role.roleId}>
              <BoxStyled>{role.viewName}</BoxStyled>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

const BoxStyled = styled(Box)(({ theme }) => ({
  backgroundColor: "#f0f9ff",
  padding: "1rem 1rem",
  borderRadius: 6,
  borderColor: "#0ea5e9",
  borderWidth: 2,
  borderStyle: "solid",
  marginBottom: "0.5rem",
}));

export default BasicRolesDetails;
