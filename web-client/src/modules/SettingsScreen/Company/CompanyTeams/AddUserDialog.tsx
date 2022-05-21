import React, { useState, useEffect, useMemo, useCallback } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";

import DialogHeaderClose from "../../../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../../../shared/components/Dialog/DialogBigButtonFooter";

import { client } from "../../../../shared/api/client";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";
import { IRoleProfile, ITeamMember } from "../../../../shared/interfaces/Client.interfaces";
import { MESSAGES } from "../../../../shared/util/messages";
import { selectLookupListsState } from "../../../../shared/redux/store";
import { getClientUsersLookupListThunk } from "../../../../shared/redux/slices/lookup/thunks";
import { IUserProfile } from "../../../../shared/interfaces/User.interfaces";

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

const AddUserDialog = (props: IProps) => {
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

  const handleSelectTeamMember = (evt: SelectChangeEvent<string[]>) => {
    const arrayedList = Array.from(evt.target.value);
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

  const handleSelectTeamLeader = (evt: SelectChangeEvent<string[]>) => {
    let formikMemberArray = formik.values.members.map((item) => ({ ...item, isLeader: false }));

    const arrayedList = Array.from(evt.target.value);
    arrayedList.forEach((userId) => {
      const list = formikMemberArray.filter((u) => u.userId !== userId);
      const findUser = usersList.find((u) => u.userId === userId);

      formikMemberArray = [...list, { userId, isLeader: true, ...findUser }];
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
            <Grid item xs={12}>
              <FormControl
                sx={{ minWidth: "100%", mt: 3 }}
                fullWidth
                error={formik.touched.members && Boolean(formik.errors.members)}
              >
                <InputLabel id="members" sx={{ ml: -1.5 }} disableAnimation shrink>
                  Members
                </InputLabel>
                <Select
                  fullWidth
                  labelId="Members"
                  id="members"
                  name="members"
                  value={formik.values.members.map((m) => m.userId)}
                  onChange={handleSelectTeamMember}
                  renderValue={renderUserNames}
                  MenuProps={MenuProps}
                  multiple
                  disabled={formik.isSubmitting || isLoadingData}
                  variant="standard"
                >
                  {usersList.map((user) => (
                    <MenuItem key={`select-member-${user.userId}`} value={user.userId}>
                      <Checkbox checked={formik.values.members.map((m) => m.userId).includes(user.userId)} />
                      <ListItemText primary={`${user.firstName} ${user.lastName}`} />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ ml: 0 }}>{formik.touched.members && formik.errors.members}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{ minWidth: "100%", mt: 3 }}
                fullWidth
                error={formik.touched.teamLeaders && Boolean(formik.errors.teamLeaders)}
              >
                <InputLabel id="teamLeaders" sx={{ ml: -1.5 }} disableAnimation shrink>
                  Team Leader(s)
                </InputLabel>
                <Select
                  fullWidth
                  labelId="Members"
                  name="teamLeaders"
                  value={formik.values.members.filter((m) => m.isLeader).map((m) => m.userId)}
                  onChange={handleSelectTeamLeader}
                  renderValue={renderUserNames}
                  MenuProps={MenuProps}
                  multiple
                  disabled={formik.isSubmitting || isLoadingData}
                  variant="standard"
                >
                  {formik.values.members.map((user) => {
                    const findUser = usersList.find((x) => x.userId === user.userId);
                    return (
                      <MenuItem key={`select-leader-${user.userId}`} value={user.userId}>
                        <Checkbox
                          checked={
                            formik.values.members.find((u) => u.userId === user.userId && u.isLeader) ? true : false
                          }
                        />
                        <ListItemText primary={`${findUser?.firstName} ${findUser?.lastName}`} />
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText sx={{ ml: 0 }}>
                  {formik.touched.teamLeaders && formik.errors.teamLeaders}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogBigButtonFooter submitButtonText={teamId ? "UPDATE TEAM" : "CREATE TEAM"} />
      </form>
    </Dialog>
  );
};

export default AddUserDialog;
