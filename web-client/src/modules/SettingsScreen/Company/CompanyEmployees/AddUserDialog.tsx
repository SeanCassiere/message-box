import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

import FormTextField from "../../../../shared/components/Form/FormTextField";
import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

import { client } from "../../../../shared/api/client";
import { selectUserState, selectLookupListsState } from "../../../../shared/redux/store";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";
import { MESSAGES } from "../../../../shared/util/messages";

const validationSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Email is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  password: yup.string().required("Password is required"),
  roles: yup.array().of(yup.string().required("Role is required")).min(1, "At least one role is required"),
  teams: yup.array().of(yup.string().required("Team is required")).min(1, "At least one team is required"),
  isActive: yup.boolean().required("Status is required"),
});

interface IProps {
  userId: string | null;
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const AddUserDialog = (props: IProps) => {
  const { handleClose, showDialog, userId, handleRefreshList } = props;
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { userProfile } = useSelector(selectUserState);
  const { rolesList, teamsList } = useSelector(selectLookupListsState);

  const [isLoadingData, setIsLoadingData] = useState(true);

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      roles: [] as string[],
      teams: [] as string[],
      isActive: true,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const currentHost = window.location.protocol + "//" + window.location.host;
      const confirmationPath = "/confirm-account/";

      client[userId ? "put" : "post"](userId ? `/Users/${userId}` : "/Clients/Users", {
        ...values,
        host: currentHost,
        path: confirmationPath,
      })
        .then((res) => {
          if (res.status === 403 || res.status === 400) {
            enqueueSnackbar(MESSAGES.INPUT_VALIDATION, { variant: "warning" });
            setErrors(formatErrorsToFormik(res.data.errors));
          }

          if (res.status === 200) {
            enqueueSnackbar(`Success: ${userId ? "Updated" : "Created"} employee successfully.`, {
              variant: "success",
            });
            handleRefreshList();
            handleClose();
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
    formik.resetForm();

    if (userId) {
      client
        .get(`/Users/${userId}`)
        .then((res) => {
          if (res.status === 200) {
            formik.setValues({
              email: res.data.email,
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              password: "noPassword",
              roles: [...res.data.roles],
              teams: [...res.data.teams],
              isActive: res.data.isActive,
            });
          } else {
            console.log(res.data);
            enqueueSnackbar(`Error: Could not find user.`, { variant: "error" });
          }
        })
        .catch((e) => {
          console.log(e);
          enqueueSnackbar(`Error: Could not find user.`, { variant: "error" });
        })
        .finally(() => {
          setIsLoadingData(false);
        });
      return;
    } else {
      const employeeRoleId = rolesList.find((role) => role.rootName === "employee");
      if (employeeRoleId) {
        formik.setFieldValue("roles", [employeeRoleId.roleId]);
      }
      setIsLoadingData(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullWidth fullScreen={isOnMobile}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose
          title={`${userId ? "Edit" : "New"} User`}
          onClose={handleClose}
          startIconMode={userId ? "edit-icon" : "add-icon"}
        />
        <DialogContent>
          <Grid container spacing={1} sx={{ pt: 2 }}>
            <Grid item xs={12} md={12}>
              <FormTextField
                margin="dense"
                fullWidth
                label="First Name"
                id="firstName"
                name="firstName"
                autoComplete="off"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                autoFocus
                disabled={isLoadingData}
                asteriskRequired
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormTextField
                margin="dense"
                fullWidth
                label="Last Name"
                id="lastName"
                name="lastName"
                autoComplete="off"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                disabled={isLoadingData}
                asteriskRequired
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormTextField
                margin="dense"
                fullWidth
                label="Email"
                id="email"
                name="email"
                autoComplete="off"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={isLoadingData}
                asteriskRequired
              />
            </Grid>
            {!userId && (
              <Grid item xs={12} md={12}>
                <FormTextField
                  margin="dense"
                  fullWidth
                  label="Password"
                  id="password"
                  name="password"
                  autoComplete="off"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  disabled={isLoadingData}
                  asteriskRequired
                />
              </Grid>
            )}
            {userId && (
              <>
                <Grid item xs={12} md={12}>
                  <Box sx={{ mt: 1 }}>
                    <Autocomplete
                      id="user-roles"
                      value={formik.values.roles}
                      options={rolesList.map((r) => r.roleId)}
                      multiple
                      onChange={(_, values) => formik.setFieldValue("roles", values)}
                      getOptionLabel={(option) => {
                        if (!option) return "";
                        const roleFind = rolesList.find((r) => r.roleId === option);
                        return roleFind ? roleFind.viewName : "";
                      }}
                      disableCloseOnSelect
                      renderInput={(params) => (
                        <FormTextField
                          {...params}
                          label="Roles"
                          name="roles"
                          disabled={isLoadingData}
                          fullWidth
                          InputProps={{ ...params.InputProps }}
                          error={formik.touched.roles && Boolean(formik.errors.roles)}
                          helperText={formik.touched.roles && formik.errors.roles}
                          asteriskRequired
                        />
                      )}
                      disableClearable
                      getOptionDisabled={(option) => {
                        const roleFind = rolesList.find((r) => r.roleId === option);
                        return roleFind?.rootName === "employee" && roleFind?.isUserDeletable === false ? true : false;
                      }}
                      renderOption={(props, option) => {
                        const roleFind = rolesList.find((r) => r.roleId === option);
                        return (
                          <li {...props}>
                            <Checkbox checked={formik.values.roles.includes(option)} />
                            {roleFind?.viewName}
                          </li>
                        );
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index: number) => {
                          const roleFind = rolesList.find((role) => role.roleId === option);
                          return (
                            <Chip
                              {...getTagProps({ index })}
                              label={`${roleFind?.viewName}`}
                              color="secondary"
                              disabled={
                                roleFind?.rootName === "employee" && roleFind.isUserDeletable === false ? true : false
                              }
                            />
                          );
                        })
                      }
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box sx={{ mt: 2 }}>
                    <Autocomplete
                      id="user-teams"
                      value={formik.values.teams}
                      options={teamsList.map((r) => r.teamId)}
                      multiple
                      onChange={(_, values) => formik.setFieldValue("teams", values)}
                      getOptionLabel={(option) => {
                        if (!option) return "";
                        const teamFind = teamsList.find((r) => r.teamId === option);
                        return teamFind ? teamFind.teamName : "";
                      }}
                      disableCloseOnSelect
                      renderInput={(params) => (
                        <FormTextField
                          {...params}
                          label="Teams"
                          name="teams"
                          disabled={isLoadingData}
                          fullWidth
                          InputProps={{ ...params.InputProps }}
                          error={formik.touched.teams && Boolean(formik.errors.teams)}
                          helperText={formik.touched.teams && formik.errors.teams}
                          asteriskRequired
                        />
                      )}
                      disableClearable
                      getOptionDisabled={(option) => {
                        const teamFind = teamsList.find((r) => r.teamId === option);
                        return teamFind?.rootName === "company" && teamFind?.isUserDeletable === false ? true : false;
                      }}
                      renderOption={(props, option) => {
                        const teamFind = teamsList.find((r) => r.teamId === option);
                        return (
                          <li {...props}>
                            <Checkbox checked={formik.values.teams.includes(option)} />
                            {teamFind?.teamName}
                          </li>
                        );
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index: number) => {
                          const teamFind = teamsList.find((role) => role.teamId === option);
                          return (
                            <Chip
                              {...getTagProps({ index })}
                              label={`${teamFind?.teamName}`}
                              color="secondary"
                              disabled={
                                teamFind?.rootName === "company" && teamFind.isUserDeletable === false ? true : false
                              }
                            />
                          );
                        })
                      }
                    />
                  </Box>
                </Grid>
                {userId !== userProfile?.userId && (
                  <>
                    <Grid item md={6}>
                      <FormControl sx={{ minWidth: "100%", mt: 3 }}>
                        <InputLabel sx={{ ml: -1.5 }} id="user-status" disableAnimation shrink>
                          Status
                        </InputLabel>
                        <FormControlLabel
                          sx={{ mt: 2 }}
                          control={
                            <Switch
                              checked={formik.values.isActive ?? false}
                              id="isActive"
                              name="isActive"
                              onChange={formik.handleChange}
                              aria-label="User status"
                            />
                          }
                          label={formik.values.isActive ? "Active" : "Inactive"}
                          value={formik.values.isActive ?? false}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter
          submitButtonText={userId ? "UPDATE USER" : "CREATE NEW USER"}
          isLoading={formik.isSubmitting}
        />
      </Box>
    </Dialog>
  );
};

export default React.memo(AddUserDialog);
