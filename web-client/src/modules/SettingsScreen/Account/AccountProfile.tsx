import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { selectAppProfileState, selectLookupListsState } from "../../../shared/redux/store";
import { IRoleProfile } from "../../../shared/interfaces/Client.interfaces";

const AccountProfile = () => {
	const { userProfile } = useSelector(selectAppProfileState);
	const { rolesList } = useSelector(selectLookupListsState);

	const user = useMemo(() => {
		const roleDetails: IRoleProfile[] = [];

		if (userProfile) {
			for (let role of userProfile?.roles) {
				const filteredRole = rolesList.find((r) => r.roleId === role);

				if (filteredRole) {
					roleDetails.push(filteredRole);
				}
			}
		}

		return { ...userProfile, roleDetails: roleDetails };
	}, [rolesList, userProfile]);

	return (
		<Box>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
				<Box>
					<Typography variant='h5'>Profile</Typography>
				</Box>
				<Box sx={{ display: "inline-flex", columnGap: "1rem" }}>
					<IconButton color='secondary' aria-label='refresh'>
						<RefreshOutlinedIcon />
					</IconButton>
					<Button startIcon={<EditOutlinedIcon />}>Edit</Button>
				</Box>
			</Box>
			<pre>{JSON.stringify(user, null, 2)}</pre>
		</Box>
	);
};

export default AccountProfile;
