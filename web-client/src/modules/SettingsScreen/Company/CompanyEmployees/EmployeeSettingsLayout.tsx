import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { GridColDef } from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import AddUserDialog from "./AddUserDialog";
import NormalDataGrid from "../../../../shared/components/DataGrid/NormalDataGrid";

import { selectLookupListsState } from "../../../../shared/redux/store";
import { IRoleProfile, ITeamProfile } from "../../../../shared/interfaces/Client.interfaces";
import { IUserProfileWithSortedDetails } from "../../../../shared/interfaces/User.interfaces";
import { client } from "../../../../shared/api/client";
import { setLookupRoles, setLookupTeams, setLookupUsers } from "../../../../shared/redux/slices/lookup/lookupSlice";
import { usePermission } from "../../../../shared/hooks/usePermission";
import { MESSAGES } from "../../../../shared/util/messages";
import { formatDateFromNow } from "../../../../shared/util/dateTime";

const Layout = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const isAddButtonAccessible = usePermission("user:admin");
  const isEditAccessible = usePermission("user:admin");

  const [loading, setLoading] = useState(true);

  const { usersList, rolesList, teamsList } = useSelector(selectLookupListsState);

  const refreshListItems = useCallback(() => {
    client
      .get("/Clients/Users")
      .then((res) => {
        if (res.status === 200) {
          dispatch(setLookupUsers(res.data));
        } else {
          console.log(res.data);
          enqueueSnackbar("Error: Failed fetching company employees.", { variant: "error" });
        }
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });

    client
      .get("/Clients/Roles")
      .then((res) => {
        if (res.status === 200) {
          dispatch(setLookupRoles(res.data));
        } else {
          console.log(res.data);
          enqueueSnackbar("Error: Failed fetching company roles.", { variant: "error" });
        }
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
      });

    client
      .get("/Clients/Teams")
      .then((res) => {
        if (res.status === 200) {
          dispatch(setLookupTeams(res.data));
        } else {
          console.log(res.data);
          enqueueSnackbar("Error: Failed fetching company teams.", { variant: "error" });
        }
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
      });
  }, [dispatch, enqueueSnackbar]);

  useEffect(() => {
    refreshListItems();
  }, [dispatch, refreshListItems]);

  const fullDataUserList = useMemo(() => {
    const userListToReturn: IUserProfileWithSortedDetails[] = [];

    for (const user of usersList) {
      let rolesForUser: IRoleProfile[] = [];
      let teamsForUser: ITeamProfile[] = [];

      for (let role of user?.roles) {
        const filteredRole = rolesList.find((r) => r.roleId === role);

        if (filteredRole) {
          rolesForUser.push(filteredRole);
        }
      }

      for (let team of user?.teams) {
        const filteredTeam = teamsList.find((t) => t.teamId === team);

        if (filteredTeam) {
          teamsForUser.push(filteredTeam);
        }
      }

      const newUser: IUserProfileWithSortedDetails = { ...user, roleDetails: rolesForUser, teamDetails: teamsForUser };
      userListToReturn.push(newUser);
    }

    return userListToReturn;
  }, [usersList, rolesList, teamsList]);

  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);

  const handleOpenNewUserDialog = useCallback(() => {
    setOpenEditId(null);
    setOpenEditDrawer(true);
  }, []);

  const handleOpenEditor = useCallback((userId: string) => {
    setOpenEditId(userId);
    setOpenEditDrawer(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setOpenEditDrawer(false);
    setOpenEditId(null);
  }, []);

  const columns: GridColDef[] = React.useMemo(() => {
    const cols: GridColDef[] = [];

    cols.push({
      field: "firstName",
      headerName: "Full Name",
      description: "Employee's full name",
      sortable: true,
      width: 300,
      renderCell: (row) => (
        <span>
          {row.row?.firstName} {row.row?.lastName}
        </span>
      ),
    });
    cols.push({
      field: "roles",
      headerName: "Role(s)",
      description: "User access roles for the employee",
      sortable: false,
      filterable: false,
      width: 400,
      align: "left",
      headerAlign: "left",
      renderCell: (row) => (
        <span>
          {row.row?.roleDetails?.map((userRole: IRoleProfile) => (
            <Chip
              variant={userRole.isUserDeletable ? "outlined" : "filled"}
              label={userRole.viewName}
              sx={{ mr: 0.5 }}
              key={`${row.row?.userId}+${userRole.roleId}`}
            />
          ))}
        </span>
      ),
    });
    cols.push({
      field: "teams",
      headerName: "Team(s)",
      description: "Teams the employee participates in",
      sortable: false,
      filterable: false,
      width: 400,
      align: "left",
      headerAlign: "left",
      renderCell: (row) => (
        <span>
          {row.row?.teamDetails?.map((team: ITeamProfile) => (
            <Chip
              variant={team.isUserDeletable ? "outlined" : "filled"}
              label={team.teamName}
              sx={{ mr: 0.5 }}
              key={`${row?.row?.userId}+${team.teamId}`}
            />
          ))}
        </span>
      ),
    });
    cols.push({
      field: "isActive",
      headerName: "Status",
      description: "Is the employee profile active?",
      align: "left",
      headerAlign: "left",
      renderCell: (row) => (
        <span>{row.value ? <Chip label="Active" color="secondary" /> : <Chip label="Inactive" />}</span>
      ),
    });
    cols.push({
      field: "updatedAt",
      headerName: "Last updated",
      description: "Last updated date-time",
      sortable: true,
      type: "date",
      align: "left",
      headerAlign: "left",
      width: 200,
      valueFormatter: (row) => formatDateFromNow(row.value),
    });
    cols.push({
      field: "userId",
      headerName: "Actions",
      description: "Actions",
      sortable: false,
      headerAlign: "right",
      type: "actions",
      align: "right",
      hideable: false,
      renderCell: (row) => (
        <span>
          {isEditAccessible && (
            <IconButton color="primary" aria-label="edit" onClick={() => handleOpenEditor(row.value)}>
              <EditIcon />
            </IconButton>
          )}
        </span>
      ),
    });
    return cols;
  }, [handleOpenEditor, isEditAccessible]);

  return (
    <>
      <AddUserDialog
        handleClose={handleCloseEditor}
        handleRefreshList={refreshListItems}
        showDialog={openEditDrawer}
        userId={openEditId}
      />
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
          <Box>
            <Typography variant="h5">Employees</Typography>
          </Box>
          <Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
            <IconButton color="secondary" aria-label="refresh" onClick={refreshListItems}>
              <RefreshOutlinedIcon />
            </IconButton>
            {isAddButtonAccessible && (
              <>
                <Button startIcon={<AddOutlinedIcon />} onClick={handleOpenNewUserDialog} disableElevation={false}>
                  Add
                </Button>
              </>
            )}
          </Box>
        </Box>
        <NormalDataGrid
          columns={columns}
          rows={fullDataUserList.map((d) => ({ ...d, id: d.userId }))}
          height={700}
          loading={loading}
        />
      </Box>
    </>
  );
};

export default Layout;
