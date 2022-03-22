import React from "react";
// import { useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import BusinessIcon from "@mui/icons-material/Business";

import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import ActivityBlock from "../../shared/components/TeamActivity/ActivityBlock";

// import { selectLookupListsState } from "../../shared/redux/store";

const TeamActivityLayout = () => {
  // const { usersList, onlineUsersList } = useSelector(selectLookupListsState);
  return (
    <PagePaperWrapper>
      <Grid container>
        <Grid item xs={12} md={7}>
          <Typography variant="h4" fontWeight={500} component="h1">
            Team Activity
          </Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack alignItems="end">
            <Button startIcon={<BusinessIcon />} disableElevation={false}>
              View company
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <Stack direction="column" gap={2} sx={{ mt: 3 }}>
        <ActivityBlock />
      </Stack>
    </PagePaperWrapper>
  );
};

export default TeamActivityLayout;
