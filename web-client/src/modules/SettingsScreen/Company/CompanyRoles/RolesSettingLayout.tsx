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
import AddRoleDialog from "./AddRoleDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

import { selectLookupListsState } from "../../../../shared/redux/store";
import { client } from "../../../../shared/api/client";
import { setLookupRoles } from "../../../../shared/redux/slices/lookup/lookupSlice";
import { usePermission } from "../../../../shared/hooks/usePermission";
import { MESSAGES } from "../../../../shared/util/messages";
import { formatDateFromNow } from "../../../../shared/util/dateTime";

const Layout = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const isAddButtonAccessible = usePermission("role:admin");
  const isDeleteAccessible = usePermission("role:admin");
  const isEditAccessible = usePermission("role:admin");

  const [loading, setLoading] = useState(true);

  const { rolesList } = useSelector(selectLookupListsState);

  const refreshListItems = useCallback(() => {
    setLoading(true);
    client
      .get("/Clients/Roles")
      .then((res) => {
        if (res.status === 200) {
          dispatch(setLookupRoles(res.data));
          return;
        }

        enqueueSnackbar("Error: Failed fetching company roles.", { variant: "error" });
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
        .delete(`/Roles/${openDeleteId}`)
        .then(() => {
          enqueueSnackbar("Success: Deleted role successfully.", { variant: "success" });
        })
        .catch((e) => {
          console.log(e);
          enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
        })
        .finally(() => {
          refreshListItems();
          setOpenDeleteDialog(false);
        });
    }
  }, [enqueueSnackbar, openDeleteId, refreshListItems]);

  const handleOpenDelete = useCallback((teamId: string) => {
    setOpenDeleteId(teamId);
    setOpenDeleteDialog(true);
  }, []);

  const handleCloseDelete = useCallback(() => {
    setOpenDeleteDialog(false);
    setOpenEditId(null);
  }, []);

  const handleOpenNewRoleDialog = useCallback(() => {
    setOpenEditId(null);
    setOpenEditDrawer(true);
  }, []);

  const handleOpenEditor = useCallback((roleId: string) => {
    setOpenEditId(roleId);
    setOpenEditDrawer(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setOpenEditDrawer(false);
    setOpenEditId(null);
  }, []);

  const columns: GridColDef[] = React.useMemo(() => {
    const cols: GridColDef[] = [];

    cols.push({
      field: "viewName",
      headerName: "User Role Name",
      description: "User Access Role Name Name",
      sortable: true,
      width: 400,
    });
    cols.push({
      field: "isUserDeletable",
      headerName: "Created by",
      description: "Created by",
      align: "left",
      headerAlign: "left",
      sortable: true,
      width: 200,
      type: "boolean",
      renderCell: (row) => (
        <span>{row.value ? <Chip label="User created" variant="outlined" /> : <Chip label="System generated" />}</span>
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
      field: "roleId",
      headerName: "Actions",
      description: "Actions",
      sortable: false,
      headerAlign: "right",
      type: "actions",
      align: "right",
      hideable: false,
      renderCell: (row) => (
        <span>
          {row?.row?.isUserDeletable && isDeleteAccessible && (
            <IconButton color="error" aria-label="remove" onClick={() => handleOpenDelete(row.value)}>
              <DeleteIcon />
            </IconButton>
          )}
          {row?.row?.isUserDeletable && isEditAccessible && (
            <IconButton color="primary" aria-label="edit" onClick={() => handleOpenEditor(row.value)}>
              <EditIcon />
            </IconButton>
          )}
        </span>
      ),
    });
    return cols;
  }, [handleOpenDelete, handleOpenEditor, isDeleteAccessible, isEditAccessible]);

  return (
    <>
      <DeleteConfirmationDialog
        showDialog={openDeleteDialog}
        handleClose={handleCloseDelete}
        handleAccept={handleDeleteItem}
      />
      <AddRoleDialog
        handleClose={handleCloseEditor}
        handleRefreshList={refreshListItems}
        showDialog={openEditDrawer}
        roleId={openEditId}
      />
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
          <Box>
            <Typography variant="h5">Roles</Typography>
          </Box>
          <Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
            <IconButton color="secondary" aria-label="refresh" onClick={refreshListItems}>
              <RefreshOutlinedIcon />
            </IconButton>
            {isAddButtonAccessible && (
              <>
                <Button startIcon={<AddOutlinedIcon />} onClick={handleOpenNewRoleDialog} disableElevation={false}>
                  Add
                </Button>
              </>
            )}
          </Box>
        </Box>
        <NormalDataGrid
          columns={columns}
          rows={[
            ...rolesList.filter((r) => r.isUserDeletable === false).map((d) => ({ ...d, id: d.roleId })),
            ...rolesList.filter((r) => r.isUserDeletable === true).map((d) => ({ ...d, id: d.roleId })),
          ]}
          height={700}
          loading={loading}
        />
      </Box>
    </>
  );
};

export default Layout;
