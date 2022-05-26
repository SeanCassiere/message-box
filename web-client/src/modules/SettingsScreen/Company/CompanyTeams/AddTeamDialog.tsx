import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as yup from "yup";

import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Checkbox from "@mui/material/Checkbox";

import FormTextField from "../../../../shared/components/Form/FormTextField";
import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

import { client } from "../../../../shared/api/client";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";
import { IRoleProfile, ITeamMember } from "../../../../shared/interfaces/Client.interfaces";
import { MESSAGES } from "../../../../shared/util/messages";
import { selectLookupListsState } from "../../../../shared/redux/store";
import { getClientUsersLookupListThunk } from "../../../../shared/redux/slices/lookup/thunks";

const validationSchema = yup.object().shape({
  rootName: yup.string().required("A team root name is required"),
  teamName: yup.string().required("Team name is required"),
  members: yup
    .array()
    .of(
      yup.object({
        userId: yup.string().required("UserId is required"),
        isLeader: yup.boolean(),
      })
    )
    .min(1, "Team members are required"),
  teamLeaders: yup
    .array()
    .of(
      yup.object({
        userId: yup.string().required("UserId is required"),
        isLeader: yup.boolean(),
      })
    )
    .min(1, "A team leader is required"),
});

interface IProps {
  teamId: string | null;
  handleClose: () => void;
  handleRefreshList: () => void;
  showDialog: boolean;
}

const ROOT_NAME = "user-created-";

const AddTeamDialog = (props: IProps) => {
  const { handleClose, handleRefreshList, showDialog, teamId } = props;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { usersList } = useSelector(selectLookupListsState);

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
      members: [] as ITeamMember[],
      teamLeaders: [] as ITeamMember[],
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const { rootName, teamName, members } = values;
      const payload = {
        teamName: teamName.trim(),
        rootName:
          foundDefaultRole?.isUserDeletable === false
            ? rootName
            : ROOT_NAME + teamName.trim().replace(" ", "-").toLowerCase(),
        // rootName: teamId ? ROOT_NAME +  teamName.trim().replace(" ","-").toLowerCase() : rootName,
        members,
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

    dispatch(getClientUsersLookupListThunk());

    if (teamId) {
      client
        .get(`/Teams/${teamId}`)
        .then((res) => {
          if (res.status === 200) {
            setFoundDefaultRole(res.data);
            formik.setValues(res.data);
            formik.setFieldValue("teamLeaders", []);
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
  }, [teamId, dispatch, enqueueSnackbar]);

  const handleSelectTeamMember = (values: string[]) => {
    const arrayedList = Array.from(values);
    const syncedList = arrayedList.map((x) => {
      const user = formik.values.members.find((u) => u.userId === x);

      const lookupUser = usersList.find((u) => u.userId === x);

      const payload = {
        ...lookupUser,
        isLeader: user?.isLeader ?? false,
      };
      return payload;
    });
    formik.setFieldValue("members", syncedList);
    formik.setFieldValue(
      "teamLeaders",
      syncedList.filter((x) => x.isLeader)
    );
  };

  const handleSelectTeamLeader = (values: string[]) => {
    let formikMemberArray = formik.values.members.map((item) => ({ ...item, isLeader: false }));

    const arrayedList = Array.from(values);
    arrayedList.forEach((x) => {
      const userIdx = formikMemberArray.findIndex((u) => u.userId === x);
      if (userIdx > -1) {
        formikMemberArray[userIdx].userId = x;
        formikMemberArray[userIdx].isLeader = true;
      }
    });

    formik.setFieldValue("members", formikMemberArray);
    formik.setFieldValue(
      "teamLeaders",
      formikMemberArray.filter((x) => x.isLeader)
    );
  };

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullWidth fullScreen={isOnMobile}>
      <form onSubmit={formik.handleSubmit}>
        <DialogHeaderClose
          title={`${teamId ? "Edit" : "New"} Team`}
          onClose={handleClose}
          startIconMode={teamId ? "edit-icon" : "add-icon"}
        />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <FormTextField
                margin="normal"
                fullWidth
                label="Team Name"
                id="teamName"
                name="teamName"
                autoComplete="off"
                value={formik.values.teamName}
                onChange={formik.handleChange}
                error={formik.touched.teamName && Boolean(formik.errors.teamName)}
                helperText={formik.touched.teamName && formik.errors.teamName}
                autoFocus
                disabled={isFieldInactive}
                asteriskRequired
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="members"
                options={usersList.map((u) => u.userId)}
                value={formik.values.members.map((u) => u.userId)}
                getOptionLabel={(option) => {
                  if (!option) return "";

                  const user = usersList.find((u) => u.userId === option);
                  if (user) {
                    return user.firstName + " " + user.lastName;
                  } else {
                    return "";
                  }
                }}
                fullWidth
                multiple
                disabled={formik.isSubmitting}
                onChange={(_, values) => handleSelectTeamMember(values)}
                renderOption={(props, option) => {
                  const user = usersList.find((u) => u.userId === option);
                  return (
                    <li {...props}>
                      <Checkbox checked={formik.values.members.map((u) => u.userId).includes(option)} />
                      {user?.firstName} {user?.lastName}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <FormTextField
                    {...params}
                    label="Members"
                    disabled={formik.isSubmitting}
                    InputProps={{ ...params.InputProps }}
                    fullWidth
                    error={formik.touched.members && Boolean(formik.errors.members)}
                    helperText={formik.touched.members && formik.errors.members}
                    asteriskRequired
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Autocomplete
                id="team-leaders"
                options={formik.values.members.map((u) => u.userId)}
                value={formik.values.members.filter((u) => u.isLeader).map((u) => u.userId)}
                getOptionLabel={(option) => {
                  if (!option) return "";

                  const user = usersList.find((u) => u.userId === option);
                  if (user) {
                    return user.firstName + " " + user.lastName;
                  } else {
                    return "";
                  }
                }}
                fullWidth
                multiple
                disabled={formik.isSubmitting}
                onChange={(_, values) => handleSelectTeamLeader(values)}
                renderOption={(props, option) => {
                  const user = usersList.find((u) => u.userId === option);
                  return (
                    <li {...props}>
                      <Checkbox
                        checked={formik.values.members
                          .filter((u) => u.isLeader)
                          .map((u) => u.userId)
                          .includes(option)}
                      />
                      {user?.firstName} {user?.lastName}
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <FormTextField
                    {...params}
                    label="Team Leader(s)"
                    disabled={formik.isSubmitting}
                    InputProps={{ ...params.InputProps }}
                    fullWidth
                    error={formik.touched.teamLeaders && Boolean(formik.errors.teamLeaders)}
                    helperText={formik.touched.teamLeaders && formik.errors.teamLeaders}
                    asteriskRequired
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText={teamId ? "UPDATE TEAM" : "CREATE TEAM"} />
      </form>
    </Dialog>
  );
};

export default React.memo(AddTeamDialog);
