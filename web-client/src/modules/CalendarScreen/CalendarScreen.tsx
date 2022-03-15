import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import EventIcon from "@mui/icons-material/Event";

import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";

import CalendarSchedular from "./CalendarSchedular";

const CalendarScreen = () => {
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <PagePaperWrapper>
      <Grid container sx={{ marginBottom: 2 }}>
        <Grid item xs={12} md={5} sx={{ mb: 1 }}>
          <Typography variant="h4" fontWeight={500} component="h1">
            Calendar
          </Typography>
        </Grid>
        <Grid item xs={12} md={7}>
          <Stack spacing={2} direction="row" justifyContent={{ sx: "start", md: "end" }} alignItems="center">
            <Button aria-label="New Event" startIcon={<EventIcon />}>
              New Event
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <CalendarSchedular maxHeight={isOnMobile ? 600 : 780} />
    </PagePaperWrapper>
  );
};

export default CalendarScreen;
