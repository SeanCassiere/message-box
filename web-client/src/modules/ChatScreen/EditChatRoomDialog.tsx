import React from "react";
import { useFormik } from "formik";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";

import Grid from "@mui/material/Grid";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import TextField from "../../shared/components/Form/TextField/TextField";
import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";

import { selectLookupListsState } from "../../shared/redux/store";
import { client } from "../../shared/api/client";
import { formatErrorsToFormik } from "../../shared/util/errorsToFormik";
import { MESSAGES } from "../../shared/util/messages";

const validationSchema = yup.object({
  roomName: yup.string().required("Required"),
  participants: yup
    .array()
    .of(yup.string())
    .min(2, "A minimum of 2 are required")
    .test({
      name: "3-participants-for-group-chat",
      test: (values, ctx) => {
        if (ctx.parent?.roomType === "group" && values && values.length < 3) {
          return ctx.createError({
            path: "participants",
            message: "A minimum of 3 are needed for a group chat",
          });
        }
        return true;
      },
    })
    .required("Participants are required"),
});

interface IProps {
  roomId: string | "NOT";
  currentUserId: string;
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const EditChatRoomDialog = (props: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { usersList } = useSelector(selectLookupListsState);
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formik = useFormik({
    initialValues: {
      roomId: null,
      roomName: "",
      roomType: "",
      participants: [props.currentUserId],
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors, setValues, setFieldError }) => {
      if ([...values.participants].length < 2) {
        setFieldError("participants", "At least 2 participants are required");
        return;
      }

      client[props.roomId === "NOT" ? "post" : "put"](
        props.roomId === "NOT" ? "/Chats" : `/Chats/${props.roomId}`,
        values
      )
        .then((res) => {
          if (res.status === 200) {
            setValues(res.data);
          } else if (res.status === 400) {
            enqueueSnackbar(MESSAGES.INPUT_VALIDATION, { variant: "warning" });
            setErrors(formatErrorsToFormik(res.data.errors));
          }
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
        })
        .finally(() => {
          setSubmitting(false);
          props.handleRefreshList();
          props.handleClose();
        });
    },
  });

  const passThroughClose = React.useCallback(() => {
    formik.resetForm();
    props.handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.handleClose]);

  const participantOptions = React.useMemo(() => {
    const listWithoutCurrentUser = usersList.filter((u) => !formik.values.participants?.includes(u.userId));
    return listWithoutCurrentUser.map((user) => ({
      label: `${user.firstName} ${user.lastName}`,
      id: user.userId,
    }));
  }, [formik.values.participants, usersList]);

  //
  React.useEffect(() => {
    if (!props.showDialog) {
      return;
    }

    if (props.roomId !== "NOT") {
      client
        .get(`/Chats/${props.roomId}`)
        .then((res) => {
          if (res.status === 200) {
            formik.setValues(res.data);
          } else {
            enqueueSnackbar("Error loading chat room", { variant: "error" });
          }
        })
        .catch((err) => {
          enqueueSnackbar("Error loading chat room", { variant: "error" });
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar, props.roomId, props.showDialog]);

  return (
    <Dialog
      open={props.showDialog}
      maxWidth="sm"
      fullWidth
      onClose={() => ({})}
      disableEscapeKeyDown
      fullScreen={isOnMobile}
    >
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title={`${props.roomId === "NOT" ? "New" : "Edit"} chat`} onClose={passThroughClose} />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label={formik.values.roomType === "private" ? "Conversation name" : "Chat name"}
                id="roomName"
                name="roomName"
                autoComplete="off"
                variant="outlined"
                value={formik.values.roomName}
                onChange={formik.handleChange}
                error={formik.touched.roomName && Boolean(formik.errors.roomName)}
                helperText={formik.touched.roomName && formik.errors.roomName}
                disabled={formik.isSubmitting}
              />
            </Grid>
            {formik.values?.roomType !== "private" && (
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <Autocomplete
                    id="participants"
                    options={participantOptions}
                    value={formik.values.participants}
                    fullWidth
                    freeSolo
                    multiple
                    disabled={
                      formik.isSubmitting ||
                      (formik.values?.roomId && formik.values?.roomType === "private" ? true : false)
                    }
                    onChange={(evt, value) => {
                      const ids: string[] = [];

                      value.forEach((v) => {
                        if (typeof v === "string") {
                          ids.push(v);
                        } else {
                          ids.push(v.id);
                        }
                      });

                      formik.setFieldValue("participants", ids);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Participants"
                        name="participants"
                        error={formik.touched.participants && Boolean(formik.errors.participants)}
                        helperText={formik.touched.participants && formik.errors.participants}
                        disabled={
                          formik.isSubmitting ||
                          (formik.values?.roomId && formik.values?.roomType === "private" ? true : false)
                        }
                        InputProps={{ ...params.InputProps, endAdornment: <></> }}
                        fullWidth
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index: number) => {
                        const userRenderOption = usersList.find(
                          (user) => user.userId === (option as unknown as string)
                        );
                        return (
                          <Chip
                            // key={`chip-chat-${userRenderOption?.userId ?? index}`}
                            {...getTagProps({ index })}
                            label={`${userRenderOption?.firstName} ${userRenderOption?.lastName}`}
                            color="secondary"
                            avatar={
                              <Avatar>
                                {String(`${userRenderOption?.firstName} ${userRenderOption?.lastName}`)
                                  .substring(0, 1)
                                  .toUpperCase()}
                              </Avatar>
                            }
                            disabled={
                              (option as unknown as string) === props.currentUserId ||
                              (formik.values?.roomId && formik.values?.roomType === "private" ? true : false)
                            }
                          />
                        );
                      })
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText={props.roomId === "NOT" ? "START CHAT" : "EDIT CHAT"} />
      </Box>
    </Dialog>
  );
};

export default EditChatRoomDialog;
