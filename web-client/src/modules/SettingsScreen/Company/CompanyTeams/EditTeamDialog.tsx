import { useState, useEffect, useMemo } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

import { client } from "../../../../shared/api/client";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";
import { IRoleProfile } from "../../../../shared/interfaces/Client.interfaces";
import { MESSAGES } from "../../../../shared/util/messages";

const validationSchema = yup.object().shape({
  rootName: yup.string().required("A team root name is required"),
  teamName: yup.string().required("Team name is required"),
});

interface IProps {
  teamId: string | null;
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const ROOT_NAME = "user-created-";

const EditUserDialog = (props: IProps) => {
  const { handleClose, handleRefreshList, showDialog, teamId } = props;
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [foundDefaultRole, setFoundDefaultRole] = useState<IRoleProfile | null>(null);

  const isFieldInactive = useMemo(
    () => isLoadingData || foundDefaultRole?.isUserDeletable === false,
    [isLoadingData, foundDefaultRole]
  );

  const formik = useFormik({
    initialValues: {
      rootName: ROOT_NAME,
      teamName: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const { rootName, teamName } = values;
      const payload = {
        teamName: teamName.trim(),
        rootName:
          foundDefaultRole?.isUserDeletable === false
            ? rootName
            : ROOT_NAME + teamName.trim().replace(" ", "-").toLowerCase(),
        // rootName: teamId ? ROOT_NAME +  teamName.trim().replace(" ","-").toLowerCase() : rootName,
      };
      client[teamId ? "put" : "post"](teamId ? `/Teams/${teamId}` : "/Clients/Teams", payload)
        .then((res) => {
          if (res.status === 403 || res.status === 400) {
            enqueueSnackbar(MESSAGES.INPUT_VALIDATION, { variant: "warning" });
            setErrors(formatErrorsToFormik(res.data.errors));
          }

          if (res.status === 200) {
            enqueueSnackbar(`Success: ${teamId ? "Updated" : "Created"} team successfully.`, { variant: "success" });
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
    setFoundDefaultRole(null);
    formik.resetForm();

    if (teamId) {
      client
        .get(`/Teams/${teamId}`)
        .then((res) => {
          if (res.status === 200) {
            setFoundDefaultRole(res.data);
            formik.setFieldValue("teamName", res.data.teamName);
            formik.setFieldValue("rootName", res.data.rootName);
          } else {
            console.log(res.data);
            enqueueSnackbar(`Error: Could not find team.`, { variant: "error" });
          }
        })
        .catch((e) => {
          console.log(e);
          enqueueSnackbar(`Error: Could not find team.`, { variant: "error" });
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    } else {
      setIsLoadingData(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullWidth fullScreen={isOnMobile}>
      <form onSubmit={formik.handleSubmit}>
        <DialogHeaderClose title={`${teamId ? "Edit" : "New"} Team`} onClose={handleClose} />
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Team Name"
                id="teamName"
                name="teamName"
                autoComplete="off"
                variant="standard"
                value={formik.values.teamName}
                onChange={formik.handleChange}
                error={formik.touched.teamName && Boolean(formik.errors.teamName)}
                helperText={formik.touched.teamName && formik.errors.teamName}
                autoFocus
                disabled={isFieldInactive}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText={teamId ? "UPDATE TEAM" : "CREATE TEAM"} />
      </form>
    </Dialog>
  );
};

export default EditUserDialog;
