import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";

import { client } from "../../shared/api/client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";

import { selectAppProfileState, selectLookupListsState } from "../../shared/redux/store";
import { IUserProfile } from "../../shared/interfaces/User.interfaces";
import { formatErrorsToFormik } from "../../shared/util/errorsToFormik";

import TaskContentEditor from "./TaskContentEditor";
import { usePermission } from "../../shared/hooks/usePermission";

interface Props {
  handleCloseFunction: () => void;
  taskId: string | null;
  showDialog: boolean;
}

const validationSchema = yup.object().shape({
  ownerId: yup.string().required("Task must have an owner"),
  title: yup.string().required("Title is required"),
  content: yup.string(),
  bgColor: yup.string(),
  dueDate: yup.date().required("Due date is required"),
  isCompleted: yup.boolean().required("IsCompleted is required"),
  sharedWith: yup.array().of(yup.string()),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const TaskModifyDialog = (props: Props) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { handleCloseFunction, showDialog, taskId } = props;

  const { userProfile } = useSelector(selectAppProfileState);
  const { usersList } = useSelector(selectLookupListsState);
  const showOwnerAssignee = usePermission("task:admin");

  const [initialContent, setInitialContent] = useState("");

  const formik = useFormik({
    initialValues: {
      ownerId: userProfile?.userId,
      title: "",
      content: "",
      bgColor: "#2DD4Bf",
      dueDate: new Date().toISOString(),
      isCompleted: false,
      sharedWith: [] as string[],
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      client[taskId ? "put" : "post"](taskId ? `/Tasks/${taskId}` : "/Tasks", values)
        .then((res) => {
          if (res.status === 200) {
            enqueueSnackbar(`Success: Task ${taskId ? "updated" : "created"}.`, { variant: "success" });
            navigate("/tasks");
            handleCloseFunction();
          } else {
            if (res.data.errors) {
              enqueueSnackbar(`Warning: Input validation failed.`, { variant: "warning" });
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
    navigate("/tasks");
    handleCloseFunction();
    return;
  }, [formik, handleCloseFunction, navigate]);

  const renderUserNames = useCallback(
    (selectedUsers: string[]) => {
      const selectedUserObjects: IUserProfile[] = [];

      for (const r of selectedUsers) {
        const team = usersList.find((x) => x.userId === r);
        if (team) {
          selectedUserObjects.push(team);
        }
      }

      const selectedUserNames = selectedUserObjects.map((x) => x.firstName + " " + x.lastName);
      const items = selectedUserNames.join(", ");

      return items;
    },
    [usersList]
  );

  const handleSetDateChange = (newValue: Date | null) => {
    if (!newValue) return;
    formik.setFieldValue("dueDate", new Date(newValue).toISOString());
  };

  const handleSetTaskOwner = (evt: SelectChangeEvent<string>) => {
    formik.setFieldValue("ownerId", evt.target.value);
    formik.setFieldValue("sharedWith", []);
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
            formik.setFieldValue("bgColor", res.data.bgColor);
            formik.setFieldValue("content", res.data.content);
            setInitialContent(res.data.content);
            formik.setFieldValue("dueDate", res.data.dueDate);
            formik.setFieldValue("isCompleted", res.data.isCompleted);
            formik.setFieldValue("sharedWith", res.data.sharedWith);
          }
        })
        .catch((e) => {
          console.log("could not find task" + taskId);
          enqueueSnackbar(`Error: Could not find task.`, { variant: "error" });
          navigate("/tasks");
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
  }, [handleCloseFunction, navigate, taskId]);

  return (
    <Dialog
      open={showDialog}
      PaperProps={{ sx: { position: "absolute", top: 1, pb: 3 } }}
      onClose={() => ({})}
      maxWidth="lg"
      disableEscapeKeyDown
      fullWidth
    >
      <DialogTitle>{taskId ? <>Edit</> : <>New</>}&nbsp;Task</DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={8} sx={{ mt: 3 }}>
            <Grid container>
              <Grid item xs={12} md={12} sx={{ px: 3 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Title"
                  id="title"
                  name="title"
                  autoComplete="off"
                  variant="standard"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  autoFocus
                  disabled={isLoading}
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ px: 3 }}>
                <Box sx={{ mb: 1, mt: 4 }}>
                  <InputLabel id="content-label" disableAnimation shrink>
                    Content
                  </InputLabel>
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
              <Grid container spacing={5}>
                {showOwnerAssignee && (
                  <Grid item xs={12} md={12}>
                    <FormControl variant="standard" sx={{ mt: 2, minWidth: 120 }} fullWidth>
                      <InputLabel id="taskOwner-label" disabled={isLoading} disableAnimation shrink>
                        Task owner
                      </InputLabel>
                      <Select
                        labelId="taskOwner-label"
                        id="ownerId"
                        name="ownerId"
                        value={formik.values.ownerId}
                        onChange={handleSetTaskOwner}
                        error={formik.touched.ownerId && Boolean(formik.errors.ownerId)}
                      >
                        {usersList
                          .filter((user) => user.isActive)
                          .map((user) => (
                            <MenuItem key={`select-root-user-${user.userId}`} value={user.userId}>
                              {user.firstName + " " + user.lastName}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>{formik.touched.ownerId && formik.errors.ownerId}</FormHelperText>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12} md={12}>
                  <FormControl variant="standard" sx={{ mt: showOwnerAssignee ? 0 : 2 }} fullWidth>
                    <MobileDateTimePicker
                      label="Due date"
                      value={Date.parse(formik.values.dueDate)}
                      onChange={handleSetDateChange}
                      renderInput={(params) => <TextField {...params} variant="standard" name="dueDate" />}
                      disabled={isLoading}
                    />
                    <FormHelperText>{formik.touched.dueDate && formik.errors.dueDate}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl sx={{ minWidth: "100%" }}>
                    <InputLabel id="teams" sx={{ ml: -1.5 }} disableAnimation shrink>
                      Share with
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="Task Owner"
                      id="ownerId"
                      name="sharedWith"
                      value={formik.values.sharedWith}
                      onChange={formik.handleChange}
                      renderValue={renderUserNames}
                      MenuProps={MenuProps}
                      multiple
                      disabled={isLoading}
                      variant="standard"
                    >
                      {usersList
                        .filter((list) => list.userId !== formik.values.ownerId)
                        .map((user) => (
                          <MenuItem key={`select-${user.userId}`} value={user.userId}>
                            <Checkbox checked={formik.values.sharedWith.includes(user.userId)} />
                            <ListItemText primary={`${user.firstName} ${user.lastName}`} />
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                {taskId && (
                  <Grid item xs={12} md={12}>
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
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <LoadingButton onClick={pressClose} color="error">
                Cancel
              </LoadingButton>
              <LoadingButton type="submit" loading={formik.isSubmitting}>
                {taskId ? <>Update</> : <>Create</>}
              </LoadingButton>
            </DialogActions>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

export default React.memo(TaskModifyDialog);
