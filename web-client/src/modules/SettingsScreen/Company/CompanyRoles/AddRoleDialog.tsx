import React, { useState, useEffect, useMemo, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";

import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";

import FormTextField from "../../../../shared/components/Form/FormTextField";
import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

import { client } from "../../../../shared/api/client";
import { selectLookupListsState } from "../../../../shared/redux/store";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";
import { IRoleProfile } from "../../../../shared/interfaces/Client.interfaces";
import { MESSAGES } from "../../../../shared/util/messages";

const validationSchema = yup.object().shape({
  rootName: yup.string().required("A role has be based on an existing role"),
  viewName: yup.string().required("Role name is required"),
  permissions: yup
    .array()
    .of(yup.string().required("Role permissions are required"))
    .min(1, "At least one permission is required"),
});

interface IProps {
  roleId: string | null;
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const AddRoleDialog = (props: IProps) => {
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

  const handleBaseRoleChange = useCallback(
    (value: string) => {
      formik.setFieldValue("rootName", value);
      const defaultRoles = rolesList.filter((role) => role.isUserDeletable === false);
      const findRole = defaultRoles.find((role) => role.rootName === value)!;
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
        <DialogHeaderClose
          title={`${roleId ? "Edit" : "New"} Role`}
          onClose={handleClose}
          startIconMode={roleId ? "edit-icon" : "add-icon"}
        />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <FormTextField
                margin="normal"
                fullWidth
                label="Role Name"
                id="viewName"
                name="viewName"
                autoComplete="off"
                value={formik.values.viewName}
                onChange={formik.handleChange}
                error={formik.touched.viewName && Boolean(formik.errors.viewName)}
                helperText={formik.touched.viewName && formik.errors.viewName}
                disabled={isFieldInactive}
                autoFocus
                asteriskRequired
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="rootName"
                value={formik.values.rootName}
                options={rolesList.filter((r) => r.isUserDeletable === false).map((r) => r.rootName)}
                disableClearable
                getOptionLabel={(option) => {
                  if (!option) return "";

                  const role = rolesList.find((r) => r.rootName === option);
                  if (role) {
                    return role.viewName;
                  } else {
                    return "";
                  }
                }}
                openOnFocus
                onChange={(_, value) => {
                  if (value) {
                    handleBaseRoleChange(value);
                  }
                }}
                disabled={roleId ? true : isFieldInactive}
                renderInput={(params) => (
                  <FormTextField
                    {...params}
                    label="Based on"
                    name="rootName"
                    disabled={roleId ? true : isFieldInactive || formik.isSubmitting}
                    InputProps={{ ...params.InputProps }}
                    fullWidth
                    error={formik.touched.rootName && Boolean(formik.errors.rootName)}
                    helperText={formik.touched.rootName && formik.errors.rootName}
                    asteriskRequired
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="permissions"
                value={formik.values.permissions}
                options={loadedPermissions}
                multiple
                openOnFocus
                onChange={(_, value) => {
                  if (value) {
                    formik.setFieldValue("permissions", value);
                  }
                }}
                disableCloseOnSelect
                renderInput={(params) => (
                  <FormTextField
                    {...params}
                    label="Permissions"
                    name="permissions"
                    disabled={roleId ? true : isFieldInactive || formik.isSubmitting}
                    InputProps={{ ...params.InputProps }}
                    fullWidth
                    error={formik.touched.permissions && Boolean(formik.errors.permissions)}
                    helperText={formik.touched.permissions && formik.errors.permissions}
                    asteriskRequired
                  />
                )}
                renderOption={(props, option) => {
                  return (
                    <li {...props}>
                      <Checkbox checked={formik.values.permissions.includes(option)} />
                      {option}
                    </li>
                  );
                }}
              />
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

export default React.memo(AddRoleDialog);
