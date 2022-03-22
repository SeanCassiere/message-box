import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import PageBlockItem from "../../../../shared/components/Layout/PageBlockItem";
import BasicCompanyDetailsBlock from "../../../../shared/components/Company/BasicCompanyDetailsBlock";
import BasicDetailsBlock from "../../../../shared/components/Account/BasicDetailsBlock";
import BasicTeamsDetails from "../../../../shared/components/Account/BasicTeamsDetails";
import BasicRolesDetails from "../../../../shared/components/Account/BasicRolesDetails";
import EditCompanyDialog from "./EditCompanyDialog";

import { refreshClientProfileThunk } from "../../../../shared/redux/slices/user/thunks";
import {
  getClientRolesLookupListThunk,
  getClientTeamsLookupListThunk,
} from "../../../../shared/redux/slices/lookup/thunks";
import { selectLookupListsState, selectUserState } from "../../../../shared/redux/store";
import { IUserProfile } from "../../../../shared/interfaces/User.interfaces";
import { usePermission } from "../../../../shared/hooks/usePermission";

const CompanyProfile = () => {
  const dispatch = useDispatch();
  const canEditCompany = usePermission("client:write");

  const refreshAccountLookupLists = useCallback(() => {
    dispatch(getClientRolesLookupListThunk());
    dispatch(getClientTeamsLookupListThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(refreshClientProfileThunk());
    refreshAccountLookupLists();
  }, [dispatch, refreshAccountLookupLists]);

  const { clientProfile } = useSelector(selectUserState);

  const { usersList, rolesList, teamsList } = useSelector(selectLookupListsState);

  const adminUser: IUserProfile | null = useMemo(() => {
    const list = usersList.find((user) => user.userId === clientProfile?.adminUserId);
    return list ?? null;
  }, [clientProfile?.adminUserId, usersList]);

  const [openEditDrawer, setOpenEditDrawer] = useState(false);

  const handleOpenEditor = useCallback(() => {
    setOpenEditDrawer(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setOpenEditDrawer(false);
    dispatch(refreshClientProfileThunk());
  }, [dispatch]);

  return (
    <>
      <EditCompanyDialog
        showDialog={openEditDrawer}
        handleRefreshList={refreshAccountLookupLists}
        handleClose={handleCloseEditor}
      />
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
          <Box>
            <Typography variant="h5">My Company</Typography>
          </Box>
          <Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
            {canEditCompany && (
              <>
                <Button startIcon={<EditOutlinedIcon />} onClick={handleOpenEditor} disableElevation={false}>
                  Edit
                </Button>
              </>
            )}
          </Box>
        </Box>
        <PageBlockItem>
          <BasicCompanyDetailsBlock
            bottomElement={
              <>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Typography fontWeight={400} color="primary.dark" textAlign="center">
                      Company Administrator
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box sx={{ pt: 3 }}>
                      <BasicDetailsBlock userDetails={adminUser} />
                    </Box>
                  </Grid>
                </Grid>
              </>
            }
          />
        </PageBlockItem>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <PageBlockItem>
              <BasicTeamsDetails userTeams={teamsList} title="Company Teams" />
            </PageBlockItem>
          </Grid>
          <Grid item xs={12} md={4}>
            <PageBlockItem>
              <BasicRolesDetails userRoles={rolesList} title="Company User Roles" />
            </PageBlockItem>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default CompanyProfile;
