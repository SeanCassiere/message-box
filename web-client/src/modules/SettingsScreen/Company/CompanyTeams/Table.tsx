import React from "react";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { ITeamProfile } from "../../../../shared/interfaces/Client.interfaces";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: "#E9ECFF",
		color: theme.palette.primary.main,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

interface ITableProps {
	dataList: ITeamProfile[];
	editItemHandler: (value: string) => void;
	deleteItemHandler: (value: string) => void;
}

const ViewTable = ({ dataList, editItemHandler, deleteItemHandler }: ITableProps) => {
	const handleEditButton = (team: ITeamProfile) => {
		editItemHandler(team.teamId);
	};
	const handleDeleteButton = (team: ITeamProfile) => {
		deleteItemHandler(team.teamId);
	};
	return (
		<TableContainer component={Paper} elevation={1}>
			<Table sx={{ minWidth: 700 }} aria-label='customized table'>
				<TableHead>
					<TableRow>
						<StyledTableCell>Name</StyledTableCell>
						<StyledTableCell>Creation</StyledTableCell>
						<StyledTableCell>Updated At</StyledTableCell>
						<StyledTableCell align='right'>#</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{dataList.map((team) => (
						<StyledTableRow key={team.teamId}>
							<StyledTableCell component='th' scope='row'>
								{team.teamName}
							</StyledTableCell>
							<StyledTableCell>
								{team.isUserDeletable ? (
									<Chip label='User created' variant='outlined' />
								) : (
									<Chip label='System generated' />
								)}
							</StyledTableCell>
							<StyledTableCell>{team.updatedAt}</StyledTableCell>
							<StyledTableCell align='right'>
								{team.isUserDeletable && (
									<>
										<IconButton color='error' aria-label='remove' onClick={() => handleDeleteButton(team)}>
											<DeleteIcon />
										</IconButton>
										<IconButton color='primary' aria-label='edit' onClick={() => handleEditButton(team)}>
											<EditIcon />
										</IconButton>
									</>
								)}
							</StyledTableCell>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ViewTable;
