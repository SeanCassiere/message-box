import React, { useCallback, useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

import { client } from "../../../../shared/api/client";
import { useSelector } from "react-redux";
import { selectUserState, selectLookupListsState } from "../../../../shared/redux/store";
import { IRoleProfile, ITeamProfile } from "../../../../shared/interfaces/Client.interfaces";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";
import { MESSAGES } from "../../../../shared/util/messages";

const validationSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Email is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  password: yup.string().required("Password is required"),
  roles: yup.array().of(yup.string().required("Role is required")),
  teams: yup.array().of(yup.string().required("Team is required")),
  isActive: yup.boolean().required("Status is required"),
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

interface IProps {
  userId: string | null;
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const EditUserDialog = (props: IProps) => {
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

  const renderRoleNames = useCallback(
    (selectedRoles: string[]) => {
      const selectedRoleObjects: IRoleProfile[] = [];

      for (const r of selectedRoles) {
        const role = rolesList.find((x) => x.roleId === r);
        if (role) {
          selectedRoleObjects.push(role);
        }
      }

      const selectedRoleNames = selectedRoleObjects.map((x) => x.viewName);
      const items = selectedRoleNames.join(", ");

      return items;
    },
    [rolesList]
  );

  const renderTeamNames = useCallback(
    (selectedRoles: string[]) => {
      const selectedTeamObjects: ITeamProfile[] = [];

      for (const r of selectedRoles) {
        const team = teamsList.find((x) => x.teamId === r);
        if (team) {
          selectedTeamObjects.push(team);
        }
      }

      const selectedTeamNames = selectedTeamObjects.map((x) => x.teamName);
      const items = selectedTeamNames.join(", ");

      return items;
    },
    [teamsList]
  );

  const isRoleSelectDisabled = useCallback(
    (role: IRoleProfile) => {
      if (role.rootName === "employee" && role.isUserDeletable === false) {
        return true;
      }

      if (role.rootName === "admin" && userId === userProfile?.userId) {
        return true;
      }

      return false;
    },
    [userId, userProfile?.userId]
  );

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullWidth fullScreen={isOnMobile}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title={`${userId ? "Edit" : "New"} User`} onClose={handleClose} />
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} md={12}>
              <TextField
                margin="normal"
                fullWidth
                label="First Name"
                id="firstName"
                name="firstName"
                autoComplete="off"
                variant="standard"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                autoFocus
                disabled={isLoadingData}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Last Name"
                id="lastName"
                name="lastName"
                autoComplete="off"
                variant="standard"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                disabled={isLoadingData}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                id="email"
                name="email"
                autoComplete="off"
                variant="standard"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={isLoadingData}
              />
            </Grid>
            {!userId && (
              <Grid item xs={12} md={12}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Password"
                  id="password"
                  name="password"
                  autoComplete="off"
                  variant="standard"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  disabled={isLoadingData}
                />
              </Grid>
            )}
            {userId && (
              <>
                <Grid item xs={12} md={12}>
                  <FormControl sx={{ minWidth: "100%", mt: 3 }}>
                    <InputLabel id="roles" sx={{ ml: -1.5 }} disableAnimation shrink>
                      Roles
                    </InputLabel>
                    <Select
                      labelId="roles"
                      id="roles"
                      name="roles"
                      value={formik.values.roles}
                      onChange={formik.handleChange}
                      renderValue={renderRoleNames}
                      MenuProps={MenuProps}
                      multiple
                      variant="standard"
                      disabled={isLoadingData}
                    >
                      {rolesList.map((role) => (
                        <MenuItem
                          key={`select-${role.roleId}`}
                          value={role.roleId}
                          disabled={isRoleSelectDisabled(role)}
                          // disabled={role.rootName === "employee" && role.isUserDeletable === false}
                          defaultChecked={role.rootName === "employee" && role.isUserDeletable === false}
                        >
                          <Checkbox checked={formik.values.roles.indexOf(role.roleId) > -1} />
                          <ListItemText primary={role.viewName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <FormControl sx={{ minWidth: "100%", mt: 3 }}>
                    <InputLabel id="teams" sx={{ ml: -1.5 }} disableAnimation shrink>
                      Teams
                    </InputLabel>
                    <Select
                      labelId="teams"
                      id="teams"
                      name="teams"
                      value={formik.values.teams}
                      onChange={formik.handleChange}
                      renderValue={renderTeamNames}
                      MenuProps={MenuProps}
                      multiple
                      variant="standard"
                      disabled={isLoadingData}
                    >
                      {teamsList.map((team) => (
                        <MenuItem
                          key={`select-${team.teamId}`}
                          value={team.teamId}
                          disabled={team.rootName === "company" && team.isUserDeletable === false}
                          defaultChecked={team.rootName === "company" && team.isUserDeletable === false}
                        >
                          <Checkbox checked={formik.values.teams.indexOf(team.teamId) > -1} />
                          <ListItemText primary={team.teamName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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

export default EditUserDialog;
