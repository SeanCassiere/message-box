import React from "react";
import { CSSObject } from "@emotion/react";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const employeeCardStyling: CSSObject = {
  mr: 1,
  // mb: 2,
  px: 1,
  py: 1,
  borderColor: "primary.400",
  borderWidth: 2,
  borderStyle: "solid",
  minHeight: "200px",
  backgroundColor: "white",
  "&:hover": {
    boxShadow: "0 3px 3px rgba(0,0,0,0.16)",
  },
};

const EmployeeCard = () => {
  return (
    <Paper sx={employeeCardStyling} elevation={0}>
      <Stack direction="column" sx={{ height: "100%" }}>
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={3} sx={{ textAlign: "center" }}>
            TM
          </Grid>
          <Grid item xs={9}>
            <Typography>Tommy Jones</Typography>
          </Grid>
        </Grid>
        <Stack direction="row" sx={{ mx: 1, flex: 1, minHeight: "50px" }}>
          <Typography>Now:&nbsp;</Typography>
          <Typography>Status</Typography>
        </Stack>
        <Stack direction="column" gap={1}>
          <Button variant="outlined">ALERT</Button>
          <Button>MESSAGE</Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default EmployeeCard;
