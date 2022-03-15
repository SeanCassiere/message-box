import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import useMediaQuery from "@mui/material/useMediaQuery";

import Grid from "@mui/material/Grid";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";

import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";

import { selectUserState } from "../../shared/redux/store";
import { getDummyCalendarEvents } from "./demoAppointments";

interface IProps {
  eventId: string;
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const EventFormDialog = (props: IProps) => {
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDisabled, setIsDisabled] = useState(true);
  const { formats } = useSelector(selectUserState);

  const { eventId, showDialog, handleClose } = props;

  const formik = useFormik({
    initialValues: {
      id: "123456789",
      ownerId: "",
      title: "",
      startDate: new Date().toISOString(),
      sharedWith: [] as string[],
      endDate: "",
      isAllDay: false,
    },
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      setSubmitting(false);
    },
  });

  useEffect(() => {
    setIsDisabled(true);
    if (!showDialog) return;

    if (eventId === "new") {
      formik.resetForm();
      const currentDate = new Date();
      formik.setFieldValue("startDate", currentDate.toISOString());

      const futureDate = currentDate;
      futureDate.setHours(currentDate.getHours() + 2);
      formik.setFieldValue("endDate", futureDate.toISOString());

      formik.initialErrors = {};
      setIsDisabled(false);
      return;
    }

    (async () => {
      const fetchItem = () =>
        new Promise((resolve: any) => {
          setTimeout(() => {
            resolve({ success: true });
            formik.setValues(eventId === "3" ? getDummyCalendarEvents()[2] : (getDummyCalendarEvents()[0] as any));
          }, 500);
        });

      await fetchItem();
      setIsDisabled(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, showDialog]);

  const passThroughClose = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Dialog open={showDialog} onClose={() => ({})} disableEscapeKeyDown fullScreen={isOnMobile} fullWidth>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title={`${eventId === "new" ? "New" : "Edit"} Calendar Event`} onClose={passThroughClose} />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Event name"
                id="title"
                name="title"
                autoComplete="off"
                variant="standard"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                disabled={isDisabled}
                autoFocus
              />
            </Grid>
            {formik.values.isAllDay ? (
              <>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <MobileDatePicker
                    label="Date"
                    value={new Date(formik.values.startDate)}
                    inputFormat={formats.shortDateFormat}
                    onChange={(newValue) => {
                      if (newValue) {
                        const startDate = new Date(newValue);
                        startDate.setHours(0);
                        formik.setFieldValue("startDate", startDate.toISOString());
                        const endDate = startDate;
                        endDate.setHours(24);
                        formik.setFieldValue("endDate", endDate.toISOString());
                      }
                    }}
                    showTodayButton
                    disabled={isDisabled}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" fullWidth disabled={isDisabled} />
                    )}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <MobileDatePicker
                    label="Start Date"
                    value={new Date(formik.values.startDate)}
                    inputFormat={formats.shortDateTimeFormat}
                    onChange={(newValue) => {
                      if (newValue) {
                        const startDate = new Date(newValue);
                        formik.setFieldValue("startDate", startDate.toISOString());
                        const endDate = startDate;
                        const hours = endDate.getHours();
                        endDate.setHours(hours + 3);
                        formik.setFieldValue("endDate", endDate.toISOString());
                      }
                    }}
                    showTodayButton
                    disabled={isDisabled}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" fullWidth disabled={isDisabled} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <MobileDatePicker
                    label="End Date"
                    value={new Date(formik.values.endDate)}
                    inputFormat={formats.shortDateTimeFormat}
                    onChange={(newValue) => {
                      if (newValue) {
                        formik.setFieldValue("endDate", new Date(newValue).toISOString());
                      }
                    }}
                    showTodayButton
                    disabled={isDisabled}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" fullWidth disabled={isDisabled} />
                    )}
                  />
                </Grid>
              </>
            )}
            <Grid item>
              <FormControl sx={{ minWidth: "100%", mt: 1 }}>
                <InputLabel sx={{ ml: -1.5 }} id="user-status" disableAnimation shrink>
                  All day event?
                </InputLabel>
                <FormControlLabel
                  sx={{ mt: 2 }}
                  control={
                    <Switch
                      checked={formik.values.isAllDay ?? false}
                      id="isAllDay"
                      name="isAllDay"
                      onChange={formik.handleChange}
                      aria-label="User status"
                    />
                  }
                  label={"All day event"}
                  value={formik.values.isAllDay}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText={eventId === "new" ? "CREATE EVENT" : "UPDATE EVENT"} />
      </Box>
    </Dialog>
  );
};

export default EventFormDialog;
