import React, { ReactNode } from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { selectUserState } from "../../../redux/store";
import { formatDateTimeLong } from "../../../util/dateTime";

interface Props {
  bottomElement?: ReactNode;
}

const BasicCompanyDetailsBlock = (props: Props) => {
  const { clientProfile } = useSelector(selectUserState);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        <Box display="flex" alignItems="center" sx={{ height: "100%", pt: { sm: 2, md: 0 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography fontSize={24} fontWeight={500}>
                {clientProfile?.clientName}
              </Typography>
            </Box>
            <Box>
              <Typography fontSize={14}>
                Last updated on {formatDateTimeLong(clientProfile?.updatedAt ?? "")}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Grid>
      {props.bottomElement && (
        <>
          <Grid item xs={12} md={8}>
            <Box sx={{ pt: 2 }}>{props.bottomElement && <>{props.bottomElement}</>}</Box>
          </Grid>
          <Grid item xs={0} md={4}></Grid>
        </>
      )}
    </Grid>
  );
};

export default BasicCompanyDetailsBlock;
