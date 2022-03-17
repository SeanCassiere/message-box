import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";

import Grid from "@mui/material/Grid";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from "@mui/material/Dialog";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import DateTimePicker from "@mui/lab/DateTimePicker";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import TextField from "../../shared/components/Form/TextField/TextField";

import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";

import { selectLookupListsState, selectUserState } from "../../shared/redux/store";
import { getDummyCalendarEvents } from "./demoAppointments";
import { ICalendarEventGuestUser } from "../../shared/interfaces/CalendarEvent.interfaces";
import { client } from "../../shared/api/client";
import { MESSAGES } from "../../shared/util/messages";
import { formatErrorsToFormik } from "../../shared/util/errorsToFormik";

const validationSchema = yup.object({
  title: yup.string().required("Event name is required"),
  description: yup.string(),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .test({
      name: "End date",
      message: "End date cannot be before the start date",
      test: function (value, ctx) {
        if (!value) return true;

        const startDate = new Date(ctx?.parent?.startDate as string);

        if (Number(new Date(value)) <= Number(startDate)) {
          return false;
        } else {
          return true;
        }
      },
    })
    .required("End date is required"),
});

const NO_USERS_KEY = "no-users";
const DEFAULT_EVENT_GAP_HOURS = 1;

interface IUserSelectOption {
  id: string;
  label: string;
}

interface IProps {
  eventId: string;
  ownerId: string;
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const EventFormDialog = (props: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDisabled, setIsDisabled] = useState(true);
  const { formats, userProfile } = useSelector(selectUserState);
  const { usersList } = useSelector(selectLookupListsState);

  const { eventId, showDialog, handleClose } = props;

  const formik = useFormik({
    initialValues: {
      id: "new",
      ownerId: props.ownerId,
      title: "",
      originalStartDate: new Date(),
      originalEndDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      sharedWith: [] as ICalendarEventGuestUser[],
      description: "",
      isAllDay: false,
    },
    validationSchema,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      const { id, originalStartDate, originalEndDate, ...rest } = values;
      const payload = { ...rest, startDate: rest.startDate.toISOString(), endDate: rest.endDate.toISOString() };

      client[id.toLowerCase() === "new" ? "post" : "put"](
        id.toLowerCase() === "new" ? `/CalendarEvent` : `/CalendarEvent/${id}`,
        payload
      )
        .then((response) => {
          if (response.status === 200) {
            enqueueSnackbar("Event saved successfully", { variant: "success" });
            setSubmitting(false);
            props.handleRefreshList();
            props.handleClose();
          } else {
            enqueueSnackbar(MESSAGES.INPUT_VALIDATION, { variant: "warning" });
            setErrors(formatErrorsToFormik(response.data.errors));
          }
        })
        .catch((e) => {
          console.log(e);
          enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  useEffect(() => {
    setIsDisabled(true);
    if (!showDialog) return;

    if (eventId === "new") {
      formik.resetForm();

      // getting from the navigation state
      const locationState = location as unknown as {
        state: { startDate?: string; endDate?: string; isAllDay?: boolean };
      };

      const startDate = locationState?.state?.startDate ? new Date(locationState.state.startDate) : new Date();
      formik.setFieldValue("originalStartDate", startDate);
      formik.setFieldValue("startDate", startDate);

      // const endDate = new Date();
      const endDate = locationState?.state?.endDate ? new Date(locationState.state.endDate) : new Date();
      if (!locationState?.state?.endDate) {
        endDate.setHours(endDate.getHours() + DEFAULT_EVENT_GAP_HOURS);
      }
      formik.setFieldValue("originalEndDate", endDate);
      formik.setFieldValue("endDate", endDate);

      // setting isAllDay from the hidden state
      if (locationState?.state?.isAllDay) {
        formik.setFieldValue("isAllDay", true);
      }

      formik.initialErrors = {};
      setIsDisabled(false);
      return;
    }

    (async () => {
      const fetchItem = () =>
        new Promise((resolve: any) => {
          setTimeout(() => {
            resolve({ success: true });
            const date = new Date();
            const selected =
              eventId === "3"
                ? getDummyCalendarEvents(date.getMonth() + 1)[2]
                : (getDummyCalendarEvents(date.getMonth() + 1)[0] as any);
            formik.setValues(selected);
            //
            formik.setFieldValue("startDate", new Date(selected.startDate));
            formik.setFieldValue("endDate", new Date(selected.endDate));
            //
            formik.setFieldValue("originalStartDate", new Date(selected.startDate));
            formik.setFieldValue("originalEndDate", new Date(selected.endDate));
          }, 500);
        });

      await fetchItem();
      setIsDisabled(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, showDialog, location]);

  const passThroughClose = () => {
    formik.resetForm();
    handleClose();
  };

  const handleToggleIsAllDay = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    formik.setFieldValue("isAllDay", checked);
    if (checked) {
      const startDate = new Date(formik.values.startDate).setUTCHours(0, 0, 0, 0);
      const stringStartDate = new Date(startDate);
      formik.setFieldValue("startDate", stringStartDate);

      const days = parseInt(stringStartDate.toISOString().substring(8, 10));
      const endDate = new Date(startDate);
      endDate.setUTCDate(days + 1);
      formik.setFieldValue("endDate", endDate);
    } else {
      formik.setFieldValue("startDate", formik.values.originalStartDate);
      formik.setFieldValue("endDate", formik.values.originalEndDate);
    }
  };

  const handleSetAllDayDate = (date: Date | null) => {
    if (!date) return;

    const startDate = new Date(date);
    startDate.setHours(0);
    formik.setFieldValue("startDate", startDate);

    const endDate = startDate;
    endDate.setHours(24);
    formik.setFieldValue("endDate", endDate);
  };

  const handleSetStartDate = (date: Date | null) => {
    if (!date) return;

    const startDate = new Date(date);
    formik.setFieldValue("startDate", startDate);

    const endDate = new Date(date);
    const hours = endDate.getHours();
    endDate.setHours(hours + DEFAULT_EVENT_GAP_HOURS);
    formik.setFieldValue("endDate", endDate);
  };

  const handleSetEndDate = (date: Date | null) => {
    if (!date) return;

    formik.setFieldValue("endDate", new Date(date));
    formik.setFieldTouched("endDate");
    formik.validateField("endDate");
  };

  const handleSelectGuests = (
    evt: React.SyntheticEvent<Element, Event>,
    value: (
      | string
      | {
          label: string;
          id: string;
        }
    )[]
  ) => {
    const mapToInsert = value
      .filter((v) => {
        return typeof v !== "string";
      })
      .map((v) => v as unknown as IUserSelectOption)
      .filter((v) => v.id !== NO_USERS_KEY)

      .map((v) => ({ userId: v.id, name: v.label }));

    formik.setFieldValue("sharedWith", mapToInsert);
  };

  const guestOptions = useMemo(() => {
    const mappedList = usersList
      .filter((u) => u.userId !== userProfile?.userId)
      .map((u) => ({ label: `${u.firstName} ${u.lastName}`, id: u.userId }));

    const existingIds = formik.values.sharedWith.map((item) => item.userId);
    const filterOutOptions = mappedList.filter((item) => !existingIds.includes(item.id));

    if (filterOutOptions.length === 0) {
      filterOutOptions.push({ id: NO_USERS_KEY, label: "No more users" });
    }

    return filterOutOptions;
  }, [formik.values.sharedWith, userProfile?.userId, usersList]);

  return (
    <Dialog open={showDialog} onClose={() => ({})} disableEscapeKeyDown fullScreen={isOnMobile} fullWidth>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title={`${eventId === "new" ? "New" : "Edit"} Calendar Event`} onClose={passThroughClose} />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Event name"
                id="title"
                name="title"
                autoComplete="off"
                variant="outlined"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                disabled={isDisabled || formik.isSubmitting}
              />
            </Grid>
            {formik.values.isAllDay ? (
              <>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <DesktopDatePicker
                    label="Event date"
                    value={new Date(formik.values.startDate)}
                    inputFormat={formats.shortDateFormat}
                    onChange={handleSetAllDayDate}
                    disabled={isDisabled}
                    onAccept={handleSetAllDayDate}
                    showDaysOutsideCurrentMonth
                    loading={isDisabled || formik.isSubmitting}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        {...params}
                        name="startDate"
                        onBlur={formik.handleBlur}
                        disabled={isDisabled || formik.isSubmitting}
                        error={Boolean(formik.errors.startDate)}
                        helperText={
                          formik.touched.startDate && Boolean(formik.errors.startDate) && formik.errors.startDate
                        }
                      />
                    )}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6} sx={{ mb: 1 }}>
                  <DateTimePicker
                    label="Start date"
                    value={new Date(formik.values.startDate)}
                    inputFormat={formats.shortDateTimeFormat}
                    onChange={handleSetStartDate}
                    disabled={isDisabled || formik.isSubmitting}
                    onAccept={handleSetStartDate}
                    showDaysOutsideCurrentMonth
                    loading={isDisabled || formik.isSubmitting}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        {...params}
                        name="startDate"
                        onBlur={formik.handleBlur}
                        disabled={isDisabled || formik.isSubmitting}
                        error={Boolean(formik.errors.startDate)}
                        helperText={
                          formik.touched.startDate && Boolean(formik.errors.startDate) && formik.errors.startDate
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} sx={{ mb: 1 }}>
                  <DateTimePicker
                    label="End date"
                    value={new Date(formik.values.endDate)}
                    inputFormat={formats.shortDateTimeFormat}
                    onChange={handleSetEndDate}
                    disabled={isDisabled}
                    onAccept={handleSetEndDate}
                    showDaysOutsideCurrentMonth
                    loading={isDisabled || formik.isSubmitting}
                    renderInput={(params) => (
                      <TextField
                        variant="outlined"
                        fullWidth
                        {...params}
                        name="endDate"
                        onBlur={formik.handleBlur}
                        disabled={isDisabled || formik.isSubmitting}
                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                        helperText={formik.touched.endDate && Boolean(formik.errors.endDate) && formik.errors.endDate}
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={4}>
              <FormControl sx={{ minWidth: "100%", mt: 0 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.isAllDay}
                      id="isAllDay"
                      name="isAllDay"
                      onChange={handleToggleIsAllDay}
                      aria-label="Is an all day event"
                      disabled={isDisabled || formik.isSubmitting}
                    />
                  }
                  disabled={isDisabled || formik.isSubmitting}
                  label={"All day event"}
                  value={formik.values.isAllDay}
                />
              </FormControl>
            </Grid>
            <Grid item xs={0} md={8}>
              {/* blank space */}
            </Grid>
            <Grid item xs={12} sx={{ mt: -1 }}>
              <TextField
                type="text"
                margin="normal"
                fullWidth
                label="Description"
                id="description"
                name="description"
                autoComplete="off"
                variant="outlined"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={isDisabled || formik.isSubmitting}
                inputProps={{ "data-lpignore": true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="guest-options"
                options={guestOptions}
                value={formik.values.sharedWith.map((v) => ({ label: v.name, id: v.userId }))}
                fullWidth
                freeSolo
                multiple
                disabled={isDisabled || formik.isSubmitting}
                onChange={handleSelectGuests}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Guests"
                    disabled={isDisabled || formik.isSubmitting}
                    InputProps={{ ...params.InputProps, endAdornment: <></> }}
                    fullWidth
                  />
                )}
                renderTags={(value: IUserSelectOption[], getTagProps) =>
                  value.map((option: IUserSelectOption, index: number) => (
                    <Chip
                      label={option.label}
                      color="secondary"
                      avatar={<Avatar>{option.label.substring(0, 1).toUpperCase()}</Avatar>}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter
          submitButtonText={eventId === "new" ? "CREATE EVENT" : "UPDATE EVENT"}
          isLoading={isDisabled || formik.isSubmitting}
          hideButton={formik.values.ownerId !== userProfile?.userId}
        />
      </Box>
    </Dialog>
  );
};

export default EventFormDialog;
