import { useCallback, useEffect } from "react";
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

import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";

import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

import { selectLookupListsState, selectUserState } from "../../../../shared/redux/store";
import { IUserProfile } from "../../../../shared/interfaces/User.interfaces";
import { client } from "../../../../shared/api/client";
import { MESSAGES } from "../../../../shared/util/messages";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

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

  const renderUserNames = useCallback(
    (selectedUsers: string[]) => {
      const selectedUserObjects: IUserProfile[] = [];
      for (const r of selectedUsers) {
        const team = usersList.find((x) => x.userId === r);
        if (team) {
          selectedUserObjects.push(team);
        }
      }
      const selectedUserNames = selectedUserObjects.map((x) => `${x.firstName} ${x.lastName}`);
      const items = selectedUserNames.join(", ");
      return items;
    },
    [usersList]
  );

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullWidth fullScreen={isOnMobile}>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title="Edit Company" onClose={handleClose} />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Company name"
                id="clientName"
                name="clientName"
                autoComplete="off"
                variant="standard"
                value={formik.values.clientName}
                onChange={formik.handleChange}
                error={formik.touched.clientName && Boolean(formik.errors.clientName)}
                helperText={formik.touched.clientName && formik.errors.clientName}
                autoFocus
                disabled={formik.isSubmitting}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl sx={{ minWidth: "100%", mt: 2 }}>
                <InputLabel id="teams" sx={{ ml: -2 }} disableAnimation shrink>
                  Company account owner
                </InputLabel>
                <Select
                  labelId="teams"
                  id="adminUserId"
                  name="adminUserId"
                  value={[formik.values.adminUserId]}
                  onChange={formik.handleChange}
                  renderValue={renderUserNames}
                  MenuProps={MenuProps}
                  variant="standard"
                  error={formik.touched.adminUserId && Boolean(formik.errors.adminUserId)}
                  disabled={formik.isSubmitting}
                >
                  {usersList.map((user) => (
                    <MenuItem
                      key={`select-${user.userId}`}
                      value={user.userId}
                      defaultChecked={user.userId === formik.values.adminUserId}
                    >
                      <ListItemText primary={`${user.firstName} ${user.lastName}`} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{formik.touched.adminUserId && formik.errors.adminUserId}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText="SAVE COMPANY" isLoading={formik.isSubmitting} />
      </Box>
    </Dialog>
  );
};

export default EditCompanyDialog;
