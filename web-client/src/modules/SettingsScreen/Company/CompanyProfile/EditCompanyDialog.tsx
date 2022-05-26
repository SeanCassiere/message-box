import React, { useCallback, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Autocomplete from "@mui/material/Autocomplete";

import FormTextField from "../../../../shared/components/Form/FormTextField/FormTextField";
import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

import { selectLookupListsState, selectUserState } from "../../../../shared/redux/store";
import { IUserProfile } from "../../../../shared/interfaces/User.interfaces";
import { client } from "../../../../shared/api/client";
import { MESSAGES } from "../../../../shared/util/messages";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";

const validationSchema = yup.object().shape({
  clientName: yup.string().required("Company name is required"),
  adminUserId: yup.string().required("Administrator user is required"),
});

interface Props {
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const EditCompanyDialog = (props: Props) => {
  const { showDialog, handleRefreshList, handleClose } = props;
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { clientProfile } = useSelector(selectUserState);
  const { usersList } = useSelector(selectLookupListsState);

  const formik = useFormik({
    initialValues: {
      clientName: clientProfile?.clientName ?? "",
      adminUserId: clientProfile?.adminUserId ?? "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      client
        .put("/Clients/Profile", values)
        .then((res) => {
          if (res.status === 400 || res.status === 403) {
            enqueueSnackbar(MESSAGES.INPUT_VALIDATION, { variant: "warning" });
            setErrors(formatErrorsToFormik(res.data.errors));
          }

          if (res.status === 200) {
            enqueueSnackbar(`Success: company profile.`, { variant: "success" });
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

    if (!showDialog) return;
    handleRefreshList();

    client
      .get("/Clients/Profile")
      .then((res) => {
        if (res.status === 200) {
          formik.setValues(res.data);
        } else {
          console.log(res.data);
          enqueueSnackbar(`Error: Could not load the company details.`, { variant: "error" });
        }
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar(`Error: Could not load the company details.`, { variant: "error" });
        handleClose();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleRefreshList, showDialog]);

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullWidth fullScreen={isOnMobile}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title="Edit Company" onClose={handleClose} startIconMode="edit-icon" />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} md={12}>
              <FormTextField
                margin="normal"
                fullWidth
                label="Company name"
                id="clientName"
                name="clientName"
                autoComplete="off"
                value={formik.values.clientName}
                onChange={formik.handleChange}
                error={formik.touched.clientName && Boolean(formik.errors.clientName)}
                helperText={formik.touched.clientName && formik.errors.clientName}
                autoFocus
                disabled={formik.isSubmitting}
                asteriskRequired
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Box>
                <Autocomplete
                  id="adminUserId"
                  value={formik.values.adminUserId}
                  options={usersList.map((u) => u.userId)}
                  getOptionLabel={(option) => {
                    const u = usersList.find((x) => x.userId === option);
                    return u ? `${u.firstName} ${u.lastName}` : "";
                  }}
                  onChange={(_, v) => formik.setFieldValue("adminUserId", v)}
                  disabled={formik.isSubmitting}
                  renderInput={(params) => (
                    <FormTextField
                      name="adminUserId"
                      {...params}
                      label="Company account owner"
                      error={formik.touched.adminUserId && Boolean(formik.errors.adminUserId)}
                      helperText={formik.touched.adminUserId && formik.errors.adminUserId}
                      asteriskRequired
                      disabled={formik.isSubmitting}
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText="SAVE COMPANY" isLoading={formik.isSubmitting} />
      </Box>
    </Dialog>
  );
};

export default React.memo(EditCompanyDialog);
