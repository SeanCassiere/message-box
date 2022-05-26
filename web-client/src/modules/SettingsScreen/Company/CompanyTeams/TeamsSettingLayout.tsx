import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { GridColDef } from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import NormalDataGrid from "../../../../shared/components/DataGrid/NormalDataGrid";
import AddTeamDialog from "./AddTeamDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

import { selectLookupListsState } from "../../../../shared/redux/store";
import { client } from "../../../../shared/api/client";
import { setLookupTeams } from "../../../../shared/redux/slices/lookup/lookupSlice";
import { usePermission } from "../../../../shared/hooks/usePermission";
import { MESSAGES } from "../../../../shared/util/messages";
import { getClientTeamsLookupListThunk } from "../../../../shared/redux/slices/lookup/thunks";
import { formatDateFromNow } from "../../../../shared/util/dateTime";

const Layout = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const isAddButtonAccessible = usePermission("team:admin");
  const isEditButtonAccessible = usePermission("team:admin");
  const isDeleteButtonAccessible = usePermission("team:admin");

  const [loading, setLoading] = useState(true);

  const { teamsList } = useSelector(selectLookupListsState);

  const refreshListItems = useCallback(() => {
    setLoading(true);
    client
      .get("/Clients/Teams")
      .then((res) => {
        if (res.status === 200) {
          dispatch(setLookupTeams(res.data));
          return;
        }

        enqueueSnackbar("Error: Failed fetching company teams.", { variant: "error" });
      })
      .catch((e) => {
        console.log(e);
        enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, enqueueSnackbar]);

  useEffect(() => {
    refreshListItems();
  }, [refreshListItems]);

  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [openEditId, setOpenEditId] = useState<string | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

  const handleDeleteItem = useCallback(() => {
    if (openDeleteId) {
      client
        .delete(`/Teams/${openDeleteId}`)
        .then(() => {
          enqueueSnackbar("Success: Deleted team successfully.", { variant: "success" });
        })
        .catch((e) => {
          enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
        })
        .finally(() => {
          refreshListItems();
          setOpenDeleteDialog(false);
        });
    }
  }, [enqueueSnackbar, openDeleteId, refreshListItems]);

  const handleOpenNewTeamDialog = useCallback(() => {
    setOpenEditId(null);
    setOpenEditDrawer(true);
  }, []);

  const handleOpenDelete = useCallback((teamId: string) => {
    setOpenDeleteId(teamId);
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setOpenDeleteDialog(false);
    setOpenEditId(null);
    dispatch(getClientTeamsLookupListThunk());
  }, [dispatch]);

  const handleOpenEditor = useCallback((roleId: string) => {
    setOpenEditId(roleId);
    setOpenEditDrawer(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setOpenEditDrawer(false);
    setOpenEditId(null);
    dispatch(getClientTeamsLookupListThunk());
  }, [dispatch]);

  const columns: GridColDef[] = React.useMemo(() => {
    const cols: GridColDef[] = [];

    cols.push({ field: "teamName", headerName: "Team Name", description: "Team Name", sortable: true, width: 400 });
    cols.push({
      field: "isUserDeletable",
      headerName: "Created by",
      description: "Created by",
      sortable: true,
      type: "boolean",
      align: "left",
      headerAlign: "left",
      width: 200,
      renderCell: (row) =>
        row.value ? <Chip label="User created" variant="outlined" /> : <Chip label="System generated" />,
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
      field: "teamId",
      headerName: "Actions",
      description: "Actions",
      sortable: false,
      type: "actions",
      align: "right",
      headerAlign: "right",
      hideable: false,
      renderCell: (row) => (
        <span>
          {row?.row?.isUserDeletable && isDeleteButtonAccessible && (
            <IconButton color="error" aria-label="remove" onClick={() => handleOpenDelete(row.value)}>
              <DeleteIcon />
            </IconButton>
          )}
          {row?.row?.isUserDeletable && isEditButtonAccessible && (
            <IconButton color="primary" aria-label="edit" onClick={() => handleOpenEditor(row.value)}>
              <EditIcon />
            </IconButton>
          )}
        </span>
      ),
    });
    return cols;
  }, [handleOpenDelete, handleOpenEditor, isDeleteButtonAccessible, isEditButtonAccessible]);

  return (
    <>
      <DeleteConfirmationDialog
        showDialog={openDeleteDialog}
        handleClose={handleCloseDelete}
        handleAccept={handleDeleteItem}
      />
      <AddTeamDialog
        handleClose={handleCloseEditor}
        handleRefreshList={refreshListItems}
        showDialog={openEditDrawer}
        teamId={openEditId}
      />
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
          <Box>
            <Typography variant="h5">Teams</Typography>
          </Box>
          <Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
            <IconButton color="secondary" aria-label="refresh" onClick={refreshListItems}>
              <RefreshOutlinedIcon />
            </IconButton>
            {isAddButtonAccessible && (
              <>
                <Button startIcon={<AddOutlinedIcon />} onClick={handleOpenNewTeamDialog} disableElevation={false}>
                  Add
                </Button>
              </>
            )}
          </Box>
        </Box>
        <NormalDataGrid
          columns={columns}
          rows={teamsList.map((d) => ({ ...d, id: d.teamId }))}
          height={700}
          loading={loading}
        />
      </Box>
    </>
  );
};

export default Layout;
