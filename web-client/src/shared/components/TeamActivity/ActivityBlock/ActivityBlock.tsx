import React from "react";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";

import EmployeeCard from "../EmployeeCard";

import { COMMON_ITEM_BORDER_STYLING } from "../../../util/constants";

const MD_GRID_COL_SPAN = 2;
const LG_GRID_COL_SPAN = 2;

const MAX_SINGLE_LINE = 6;

const ActivityBlock = () => {
  const [showMore, setShowMore] = React.useState(false);

  const items = Array.from(Array(10).keys());

  return (
    <Paper
      sx={{
        py: 2,
        px: 2,
        border: COMMON_ITEM_BORDER_STYLING,
        borderRadius: 1,
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "&::-webkit-scrollbar": {
          width: "12px",
        },
        "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
          border: `3.5px solid rgba(0, 0, 0, 0)`,
          backgroundClip: `padding-box`,
          borderRadius: "9999px",
        },
        position: "relative",
      }}
    >
      <Stack direction="column" gap={2}>
        <Grid container>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" fontWeight={500} component="h4">
              {String("Management team")}
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack alignItems="end">
              {items.length > MAX_SINGLE_LINE && (
                <Button disableElevation={false} onClick={() => setShowMore((p) => !p)} color="secondary">
                  Show full team
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
        <Grid container>
          {items.slice(0, MAX_SINGLE_LINE).map((key) => (
            <Grid key={`team-name-${key}`} xs={12} md={MD_GRID_COL_SPAN} lg={LG_GRID_COL_SPAN} item>
              <EmployeeCard />
            </Grid>
          ))}
        </Grid>
        <Collapse in={showMore}>
          <Grid container>
            {items.length > MAX_SINGLE_LINE && (
              <>
                {items.slice(MAX_SINGLE_LINE).map((key) => (
                  <Grid key={`team-name-${key}`} xs={12} md={MD_GRID_COL_SPAN} lg={LG_GRID_COL_SPAN} item>
                    <EmployeeCard />
                  </Grid>
                ))}
              </>
            )}
          </Grid>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default ActivityBlock;
