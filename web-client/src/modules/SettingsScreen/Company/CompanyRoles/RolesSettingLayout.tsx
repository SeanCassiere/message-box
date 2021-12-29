import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

import ViewTable from "./Table";
import EditRoleDialog from "./EditRoleDialog";

import { selectLookupListsState } from "../../../../shared/redux/store";
import { client } from "../../../../shared/api/client";
import { setLookupRoles } from "../../../../shared/redux/slices/lookup/lookupSlice";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const Layout = () => {
	const dispatch = useDispatch();
	const { rolesList } = useSelector(selectLookupListsState);

	const refreshListItems = useCallback(() => {
		client
			.get("/Clients/Roles")
			.then((res) => {
				if (res.status === 200) {
					dispatch(setLookupRoles(res.data));
					return;
				}

				console.log(res.data);
			})
			.catch((e) => console.log(e));
	}, [dispatch]);

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
				.then(() => {})
				.catch((e) => console.log(e))
				.finally(() => {
					refreshListItems();
					setOpenDeleteDialog(false);
				});
		}
	}, [openDeleteId, refreshListItems]);

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
				roleId={openEditId}
			/>
			<Box>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
					<Box>
						<Typography variant='h5'>Roles</Typography>
					</Box>
					<Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
						<IconButton color='secondary' aria-label='refresh' onClick={refreshListItems}>
							<RefreshOutlinedIcon />
						</IconButton>
						<Button startIcon={<AddOutlinedIcon />} onClick={handleOpenNewRoleDialog}>
							Add
						</Button>
					</Box>
				</Box>
				<Box>
					<ViewTable dataList={rolesList} editItemHandler={handleOpenEditor} deleteItemHandler={handleOpenDelete} />
				</Box>
			</Box>
		</>
	);
};

export default Layout;
