import React from "react";
import { useSelector } from "react-redux";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { selectLookupListsState } from "../../shared/redux/store";
import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";

const TeamActivityLayout = () => {
  const { usersList, onlineUsersList } = useSelector(selectLookupListsState);
  return (
    <PagePaperWrapper>
      <Typography variant="h4" fontWeight={500} component="h1">
        Team Activity
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between">
        <Box sx={{ maxWidth: "400px" }}>
          <Typography variant="h5" fontWeight={400} component="h4">
            All Users
          </Typography>
          <Typography component="pre">{JSON.stringify(usersList, null, 2)}</Typography>
        </Box>
        <Box sx={{ maxWidth: "400px" }}>
          <Typography variant="h5" fontWeight={400} component="h4">
            Online Users
          </Typography>
          <Typography component="pre">{JSON.stringify(onlineUsersList, null, 2)}</Typography>
        </Box>
      </Stack>
    </PagePaperWrapper>
  );
};

export default TeamActivityLayout;
