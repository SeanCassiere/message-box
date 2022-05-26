import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Switch from "@mui/material/Switch";
import DateTimePicker from "@mui/lab/DateTimePicker";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import TaskContentEditor from "./TaskContentEditor";
import FormTextField from "../../Form/FormTextField/FormTextField";
import DialogHeaderClose from "../../Dialog/DialogHeaderClose";

import { client } from "../../../api/client";
import { selectUserState, selectLookupListsState } from "../../../redux/store";
import { formatErrorsToFormik } from "../../../util/errorsToFormik";
import { usePermission } from "../../../hooks/usePermission";
import { colorsMap, IColorMap } from "../../../util/colorsMap";
import { taskColorOpacity } from "../../../util/constants";
import { MESSAGES } from "../../../util/messages";
import { formatDateTimeShort } from "../../../util/dateTime";

interface Props {
  handleCloseFunction: () => void;
  taskId: string | null;
  showDialog: boolean;
}

const validationSchema = yup.object().shape({
  ownerId: yup.string().typeError("Must be a string").required("Task must have an owner"),
  title: yup.string().required("Title is required"),
  content: yup.string(),
  bgColor: yup.string(),
  dueDate: yup.date().required("Due date is required"),
  isCompleted: yup.boolean().required("IsCompleted is required"),
  sharedWith: yup.array().of(yup.string()),
});

const AddTaskDialog = (props: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { handleCloseFunction, showDialog, taskId } = props;

  const { userProfile, formats } = useSelector(selectUserState);
  const { usersList } = useSelector(selectLookupListsState);
  const showOwnerAssignee = usePermission("task:admin");

  const [initialContent, setInitialContent] = useState("");

  const formik = useFormik({
    initialValues: {
      ownerId: userProfile?.userId ?? "",
      title: "",
      content: "",
      bgColor: colorsMap[0].bgColor,
      borderColor: colorsMap[0].borderColor,
      dueDate: new Date().toISOString(),
      completedDate: null,
      isCompleted: false,
      sharedWith: [] as string[],
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      client[taskId ? "put" : "post"](taskId ? `/Tasks/${taskId}` : "/Tasks", values)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar(`Success: Task ${taskId ? "updated" : "created"}.`, { variant: "success" });
            handleCloseFunction();
          } else {
            if (res.data.errors) {
              enqueueSnackbar(MESSAGES.INPUT_VALIDATION, { variant: "warning" });
              setErrors(formatErrorsToFormik(res.data.errors));
            }
          }
        })
        .catch((e) => {
          console.log(e);
          enqueueSnackbar(`Error: Could not ${taskId ? "update" : "create"} task.`, { variant: "error" });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const pressClose = useCallback(() => {
    formik.resetForm();
    handleCloseFunction();
    return;
  }, [formik, handleCloseFunction]);

  const handleSetDateChange = (newValue: Date | null) => {
    if (!newValue) return;
    formik.setFieldValue("dueDate", new Date(newValue).toISOString());
  };

  const handleContentChange = (newContent: string) => {
    formik.setFieldValue("content", newContent);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    formik.resetForm();
    if (taskId) {
      client
        .get(`/Tasks/${taskId}`)
        .then((res) => {
          if (res.status === 200) {
            formik.setFieldValue("ownerId", res.data.ownerId);
            formik.setFieldValue("title", res.data.title);
            formik.setFieldValue("content", res.data.content);
            setInitialContent(res.data.content);
            formik.setFieldValue("dueDate", res.data.dueDate);
            formik.setFieldValue("completedDate", res.data.completedDate);
            formik.setFieldValue("dueDate", res.data.dueDate);
            formik.setFieldValue("isCompleted", res.data.isCompleted);
            formik.setFieldValue("sharedWith", res.data.sharedWith);
            formik.setFieldValue("bgColor", res.data.bgColor);
            const findColor = colorsMap.find((x) => x.bgColor === res.data.bgColor);
            formik.setFieldValue("borderColor", findColor ? findColor.borderColor : colorsMap[0].borderColor);
          }
        })
        .catch((e) => {
          console.log("could not find task" + taskId);
          enqueueSnackbar(`Error: Could not find task.`, { variant: "error" });
          handleCloseFunction();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
    return () => {
      setInitialContent("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleCloseFunction, taskId]);

  const handleSetColor = useCallback(
    (map: IColorMap) => {
      formik.setFieldValue("bgColor", map.bgColor);
      formik.setFieldValue("borderColor", map.borderColor);
    },
    [formik]
  );

  const userSelectOptions = React.useMemo(() => {
    return usersList.map((user) => {
      return {
        id: user.userId,
        label: `${user.firstName} ${user.lastName}`,
      };
    });
  }, [usersList]);

  return (
    <Dialog
      open={showDialog}
      PaperProps={{ sx: { pb: 3 } }}
      onClose={() => ({})}
      maxWidth="lg"
      disableEscapeKeyDown
      fullScreen={isOnMobile}
      fullWidth
    >
      <DialogHeaderClose
        title={taskId ? "Edit Task" : "New Task"}
        onClose={pressClose}
        startIconMode={taskId ? "edit-icon" : "add-icon"}
      />
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box
              sx={{
                minHeight: {
                  sx: "30px",
                  md: "50px",
                },
                bgcolor: formik.values.bgColor,
                border: `2px solid ${formik.values.borderColor}`,
                borderRadius: 1,
                mx: 3,
                opacity: `${taskColorOpacity}`,
              }}
            >
              &nbsp;
            </Box>
          </Grid>
          <Grid item xs={12} md={8} sx={{ mt: 3 }}>
            <Grid container>
              <Grid item xs={12} md={12} sx={{ px: 3 }}>
                <FormTextField
                  margin="normal"
                  fullWidth
                  label="Title"
                  id="title"
                  name="title"
                  autoComplete="off"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  autoFocus
                  disabled={isLoading}
                  asteriskRequired
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ px: 3 }}>
                <Box sx={{ mb: 1, mt: 2 }}>
                  <Typography>Content</Typography>
                </Box>
                <TaskContentEditor
                  initialContent={initialContent}
                  onChange={handleContentChange}
                  disabled={isLoading}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <DialogContent sx={{ mt: "5px" }}>
              <Grid container spacing={3}>
                {showOwnerAssignee && (
                  <Grid item xs={12} md={12}>
                    <Box sx={{ mt: 2 }}>
                      <Autocomplete
                        id="select-task-owner"
                        value={formik.values.ownerId}
                        options={userSelectOptions.map((u) => u.id)}
                        onChange={(_, value) => {
                          if (!value) return;
                          formik.setFieldValue("ownerId", value);
                        }}
                        onSelect={() => {
                          formik.setFieldValue("sharedWith", []);
                        }}
                        openOnFocus
                        disabled={isLoading || formik.isSubmitting}
                        getOptionLabel={(option) => {
                          if (option && option.trim() !== "") {
                            const user = userSelectOptions.find((u) => u.id === option);
                            if (user) {
                              return user.label;
                            } else {
                              return "No user";
                            }
                          }
                          return "";
                        }}
                        renderInput={(params) => (
                          <FormTextField
                            {...params}
                            label="Task Owner"
                            name="ownerId"
                            InputProps={{ ...params.InputProps, endAdornment: <></> }}
                            fullWidth
                            disabled={isLoading || formik.isSubmitting}
                            error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
                            helperText={formik.touched.ownerId && formik.errors.ownerId}
                            asteriskRequired
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} md={12}>
                  <Box sx={{ mt: showOwnerAssignee === false ? 2 : undefined }}>
                    <DateTimePicker
                      label="Due date"
                      value={Date.parse(formik.values.dueDate)}
                      inputFormat={formats.shortDateTimeFormat}
                      onChange={handleSetDateChange}
                      showDaysOutsideCurrentMonth
                      onAccept={handleSetDateChange}
                      loading={isLoading || formik.isSubmitting}
                      renderInput={(params) => (
                        <FormTextField
                          variant="outlined"
                          fullWidth
                          {...params}
                          name="endDate"
                          onBlur={formik.handleBlur}
                          disabled={isLoading || formik.isSubmitting}
                          error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                          helperText={formik.touched.dueDate && Boolean(formik.errors.dueDate) && formik.errors.dueDate}
                          asteriskRequired
                        />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Autocomplete
                    id="select-shared-with-owners"
                    value={formik.values.sharedWith}
                    multiple
                    options={userSelectOptions.map((u) => u.id).filter((uID) => uID !== formik.values.ownerId)}
                    onChange={(_, value) => {
                      formik.setFieldValue("sharedWith", value);
                    }}
                    openOnFocus
                    disabled={isLoading || formik.isSubmitting}
                    getOptionLabel={(option) => {
                      if (option && option.trim() !== "") {
                        const user = userSelectOptions.find((u) => u.id === option);
                        if (user) {
                          return user.label;
                        } else {
                          return "No user";
                        }
                      }
                      return "";
                    }}
                    renderInput={(params) => (
                      <FormTextField
                        {...params}
                        label="Shared with"
                        InputProps={{ ...params.InputProps, endAdornment: <></> }}
                        fullWidth
                        disabled={isLoading || formik.isSubmitting}
                        error={formik.touched.sharedWith && Boolean(formik.errors.sharedWith)}
                        helperText={formik.touched.sharedWith && formik.errors.sharedWith}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index: number) => {
                        const userRenderOption = usersList.find(
                          (user) => user.userId === (option as unknown as string)
                        );
                        return (
                          <Chip
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
                          />
                        );
                      })
                    }
                    renderOption={(props, option) => {
                      const user = usersList.find((u) => u.userId === option);
                      return (
                        <li {...props}>
                          <Checkbox checked={formik.values.sharedWith.includes(option)} />
                          {user?.firstName} {user?.lastName}
                        </li>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl sx={{ minWidth: "100%", mt: 1 }}>
                    <InputLabel disableAnimation shrink sx={{ ml: -1.5 }}>
                      Color
                    </InputLabel>
                    <Stack direction="row" mt={2} spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                      {colorsMap.map((map) => (
                        <Button
                          key={`${taskId ? taskId : "new-task"}-${map.bgColor}-${map.borderColor}`}
                          sx={{
                            bgcolor: map.bgColor,
                            minWidth: 3,
                            minHeight: 3,
                            border: `2px solid ${map.borderColor}`,
                            opacity: `${taskColorOpacity}`,
                            "&:hover": {
                              bgcolor: map.bgColor,
                            },
                          }}
                          onClick={() => handleSetColor(map)}
                        >
                          &nbsp;
                        </Button>
                      ))}
                    </Stack>
                  </FormControl>
                </Grid>
                {taskId && (
                  <>
                    <Grid item xs={12} md={5}>
                      <FormControl sx={{ minWidth: "50%", mt: 1 }}>
                        <InputLabel sx={{ ml: -1.5 }} id="task-owner" disableAnimation shrink>
                          Completed?
                        </InputLabel>
                        <FormControlLabel
                          sx={{ mt: 2 }}
                          disabled={isLoading}
                          control={
                            <Switch
                              checked={formik.values.isCompleted}
                              id="isCompleted"
                              name="isCompleted"
                              onChange={formik.handleChange}
                              aria-label="Task owner"
                            />
                          }
                          label={formik.values.isCompleted ? "Completed" : "Pending"}
                          value={formik.values.isCompleted ?? false}
                        />
                      </FormControl>
                    </Grid>
                    {formik.values.isCompleted && formik.values.completedDate && (
                      <Grid item xs={12} md={7}>
                        <FormControl sx={{ minWidth: "50%", mt: 1 }}>
                          <InputLabel sx={{ ml: -1.5 }} id="task-owner" disableAnimation shrink>
                            Completed date
                          </InputLabel>
                          <Typography fontSize="1rem" fontWeight={400} mt={3}>
                            {formatDateTimeShort(formik.values.completedDate ?? new Date())}
                          </Typography>
                        </FormControl>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <LoadingButton onClick={pressClose} color="error" sx={{ bgcolor: "inherit" }}>
                Cancel
              </LoadingButton>
              <LoadingButton type="submit" sx={{ bgcolor: "inherit" }} loading={formik.isSubmitting}>
                {taskId ? <>Update</> : <>Create</>}
              </LoadingButton>
            </DialogActions>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default React.memo(AddTaskDialog);
