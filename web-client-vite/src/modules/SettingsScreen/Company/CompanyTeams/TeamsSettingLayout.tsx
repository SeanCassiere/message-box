import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import ViewTable from "./Table";
import EditRoleDialog from "./EditTeamDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

import { selectLookupListsState } from "../../../../shared/redux/store";
import { client } from "../../../../shared/api/client";
import { setLookupTeams } from "../../../../shared/redux/slices/lookup/lookupSlice";
import { usePermission } from "../../../../shared/hooks/usePermission";
import { MESSAGES } from "../../../../shared/util/messages";

const Layout = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const isAddButtonAccessible = usePermission("team:admin");

  const { teamsList } = useSelector(selectLookupListsState);

  const refreshListItems = useCallback(() => {
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
  }, []);

  const handleOpenEditor = useCallback((roleId: string) => {
    setOpenEditId(roleId);
    setOpenEditDrawer(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setOpenEditDrawer(false);
    setOpenEditId(null);
  }, []);

  return (
    <>
      <DeleteConfirmationDialog
        showDialog={openDeleteDialog}
        handleClose={handleCloseDelete}
        handleAccept={handleDeleteItem}
      />
      <EditRoleDialog
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
                <Button startIcon={<AddOutlinedIcon />} onClick={handleOpenNewTeamDialog}>
                  Add
                </Button>
              </>
            )}
          </Box>
        </Box>
        <Box>
          <ViewTable dataList={teamsList} editItemHandler={handleOpenEditor} deleteItemHandler={handleOpenDelete} />
        </Box>
      </Box>
    </>
  );
};

export default Layout;
