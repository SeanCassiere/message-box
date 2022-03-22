import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import PageBlockItem from "../../shared/components/Layout/PageBlockItem";

const ReportResultData = () => {
  return (
    <>
      <PageBlockItem title="Filters">
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <Box>Filter</Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box>Filter</Box>
          </Grid>
        </Grid>
      </PageBlockItem>
      <PageBlockItem>
        <Box>
          <Typography>Table Data</Typography>
        </Box>
      </PageBlockItem>
    </>
  );
};

export default ReportResultData;
