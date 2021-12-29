import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import ViewTable from "./Table";
import EditUserDialog from "./EditUserDialog";

import { selectLookupListsState } from "../../../../shared/redux/store";
import { IRoleProfile, ITeamProfile } from "../../../../shared/interfaces/Client.interfaces";
import { IUserProfileWithSortedDetails } from "../../../../shared/interfaces/User.interfaces";
import { client } from "../../../../shared/api/client";
import { setLookupRoles, setLookupTeams, setLookupUsers } from "../../../../shared/redux/slices/lookup/lookupSlice";

const Layout = () => {
	const dispatch = useDispatch();
	const { usersList, rolesList, teamsList } = useSelector(selectLookupListsState);

	const refreshListItems = useCallback(() => {
		client
			.get("/Clients/Users")
			.then((res) => {
				if (res.status === 200) {
					dispatch(setLookupUsers(res.data));
				} else {
					console.log(res.data);
				}
			})
			.catch((e) => console.log(e));

		client
			.get("/Clients/Roles")
			.then((res) => {
				if (res.status === 200) {
					dispatch(setLookupRoles(res.data));
				} else {
					console.log(res.data);
				}
			})
			.catch((e) => console.log(e));

		client
			.get("/Clients/Teams")
			.then((res) => {
				if (res.status === 200) {
					dispatch(setLookupTeams(res.data));
				} else {
					console.log(res.data);
				}
			})
			.catch((e) => console.log(e));
	}, [dispatch]);

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

	return (
		<>
			<EditUserDialog
				handleClose={handleCloseEditor}
				handleRefreshList={refreshListItems}
				showDialog={openEditDrawer}
				userId={openEditId}
			/>
			<Box>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
					<Box>
						<Typography variant='h5'>Employees</Typography>
					</Box>
					<Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
						<IconButton color='secondary' aria-label='refresh' onClick={refreshListItems}>
							<RefreshOutlinedIcon />
						</IconButton>
						<Button startIcon={<AddOutlinedIcon />} onClick={handleOpenNewUserDialog}>
							Add
						</Button>
					</Box>
				</Box>
				<Box>
					<ViewTable dataList={fullDataUserList} editItemHandler={handleOpenEditor} />
				</Box>
			</Box>
		</>
	);
};

export default Layout;
