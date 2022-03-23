import React, { useState, useEffect, useMemo, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";

import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

import { client } from "../../../../shared/api/client";
import { selectLookupListsState } from "../../../../shared/redux/store";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";
import { IRoleProfile } from "../../../../shared/interfaces/Client.interfaces";
import { truncateTextByLength } from "../../../../shared/util/general";
import { MESSAGES } from "../../../../shared/util/messages";

const validationSchema = yup.object().shape({
  rootName: yup.string().required("A role has be based on an existing role"),
  viewName: yup.string().required("Role name is required"),
  permissions: yup.array().of(yup.string().required("Role permissions are required")),
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
  roleId: string | null;
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const EditUserDialog = (props: IProps) => {
  const { handleClose, handleRefreshList, showDialog, roleId } = props;
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { rolesList } = useSelector(selectLookupListsState);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadedPermissions, setLoadedPermissions] = useState<string[]>([]);
  const [foundDefaultRole, setFoundDefaultRole] = useState<IRoleProfile | null>(null);

  const isFieldInactive = useMemo(
    () => isLoadingData || foundDefaultRole?.isUserDeletable === false,
    [isLoadingData, foundDefaultRole]
  );

  const formik = useFormik({
    initialValues: {
      rootName: "employee",
      viewName: "",
      permissions: [] as string[],
      isUserDeletable: true,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      client[roleId ? "put" : "post"](roleId ? `/Roles/${roleId}` : "/Clients/Roles", values)
        .then((res) => {
          if (res.status === 403 || res.status === 400) {
            enqueueSnackbar(MESSAGES.INPUT_VALIDATION, { variant: "warning" });
            setErrors(formatErrorsToFormik(res.data.errors));
          }

          if (res.status === 200) {
            enqueueSnackbar(`Success: ${roleId ? "Updated" : "Created"} role successfully.`, { variant: "success" });
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

  const renderPermissionNames = useCallback((selectedPerms: string[]) => {
    const text = selectedPerms.join(", ");
    return truncateTextByLength(text, { maxLength: 70, includesDots: true });
  }, []);

  const handleBaseRoleChange = useCallback(
    (evt: SelectChangeEvent<string>) => {
      formik.setFieldValue("rootName", evt.target.value);
      const defaultRoles = rolesList.filter((role) => role.isUserDeletable === false);
      const findRole = defaultRoles.find((role) => role.rootName === evt.target.value)!;
      formik.setFieldValue("permissions", findRole.permissions);
    },
    [formik, rolesList]
  );

  useEffect(() => {
    setFoundDefaultRole(null);
    formik.resetForm();
    if (!showDialog) return;

    // fetch the permissions list
    client
      .get("/Roles/Permissions")
      .then((res) => {
        if (res.status === 200) {
          setLoadedPermissions(res.data);
        } else {
          console.log(res.data);
          enqueueSnackbar(`Error: Could not fetch the permissions.`, { variant: "error" });
        }
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar(`Error: Could not fetch the permissions.`, { variant: "error" });
      });

    // fetch role data
    if (roleId) {
      client
        .get(`/Roles/${roleId}`)
        .then((res) => {
          if (res.status === 200) {
            setFoundDefaultRole(res.data);
            // formik.setFieldValue("viewName", res.data.viewName);
            // formik.setFieldValue("rootName", res.data.rootName);
            // formik.setFieldValue("permissions", res.data.permissions);
            formik.setValues(res.data);
          } else {
            console.log(res.data);
            enqueueSnackbar(`Error: Could not find role.`, { variant: "error" });
          }
        })
        .catch((e) => {
          console.log(e);
          enqueueSnackbar(`Error: Could not find role.`, { variant: "error" });
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    } else {
      const defaultRoles = rolesList.filter((role) => role.isUserDeletable === false);
      const findRole = defaultRoles.find((role) => role.rootName === formik.values.rootName)!;
      formik.setFieldValue("permissions", findRole.permissions);
      setIsLoadingData(false);
    }

    return () => {
      formik.resetForm();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId, rolesList, showDialog]);

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullWidth fullScreen={isOnMobile}>
      <form onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title={`${roleId ? "Edit" : "New"} Role`} onClose={handleClose} />
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Role Name"
                id="viewName"
                name="viewName"
                autoComplete="off"
                variant="standard"
                value={formik.values.viewName}
                onChange={formik.handleChange}
                error={formik.touched.viewName && Boolean(formik.errors.viewName)}
                helperText={formik.touched.viewName && formik.errors.viewName}
                autoFocus
                disabled={isFieldInactive}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" sx={{ mt: 2 }} fullWidth disabled={roleId ? true : isFieldInactive}>
                <InputLabel id="viewName-label" disableAnimation shrink>
                  Based on
                </InputLabel>
                <Select
                  labelId="viewName-label"
                  id="rootName"
                  name="rootName"
                  value={formik.values.rootName}
                  onChange={handleBaseRoleChange}
                  error={formik.touched.rootName && Boolean(formik.errors.rootName)}
                >
                  {rolesList
                    .filter((role) => role.isUserDeletable === false)
                    .map((role) => (
                      <MenuItem key={`select-root-rol-${role.roleId}`} value={role.rootName}>
                        {role.viewName}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{formik.touched.rootName && formik.errors.rootName}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ mt: 3 }} fullWidth>
                <InputLabel id="roles" sx={{ ml: -1.5 }} disableAnimation shrink>
                  Permissions
                </InputLabel>
                <Select
                  labelId="permissions"
                  id="permissions"
                  name="permissions"
                  value={formik.values.permissions}
                  onChange={formik.handleChange}
                  renderValue={renderPermissionNames}
                  MenuProps={MenuProps}
                  multiple
                  variant="standard"
                  disabled={isLoadingData}
                >
                  {loadedPermissions.map((permission) => (
                    <MenuItem key={`select-${permission}`} value={permission} disabled={!formik.values.isUserDeletable}>
                      <Checkbox checked={formik.values.permissions.indexOf(permission) > -1} />
                      <ListItemText primary={permission} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter
          submitButtonText={roleId ? "UPDATE ROLE" : "CREATE NEW ROLE"}
          hideButton={!formik.values.isUserDeletable}
        />
      </form>
    </Dialog>
  );
};

export default EditUserDialog;
