import React from "react";
import { IUserProfileWithSortedDetails } from "../../../../shared/interfaces/User.interfaces";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";

import CustomTableContainer from "../../../../shared/components/Table/StyledTableContainer";
import StyledTableCell from "../../../../shared/components/Table/StyledTableCell";
import StyledTableRow from "../../../../shared/components/Table/StyledTableRow";

import { usePermission } from "../../../../shared/hooks/usePermission";

interface ITableProps {
  dataList: IUserProfileWithSortedDetails[];
  editItemHandler: (value: string) => void;
}

const ViewTable = ({ dataList, editItemHandler }: ITableProps) => {
  const isEditAccessible = usePermission("user:admin");

  const handleEditButton = (user: IUserProfileWithSortedDetails) => {
    editItemHandler(user.userId);
  };
  return (
    <CustomTableContainer>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Full Name</StyledTableCell>
            <StyledTableCell>Role(s)</StyledTableCell>
            <StyledTableCell>Team(s)</StyledTableCell>
            <StyledTableCell width={50}>Status</StyledTableCell>
            <StyledTableCell align="right">#</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataList.map((user) => (
            <StyledTableRow key={user.userId}>
              <StyledTableCell component="th" scope="row">
                {user.firstName} {user.lastName}
              </StyledTableCell>
              <StyledTableCell>
                {user.roleDetails.map((role) => (
                  <Chip
                    variant={role.isUserDeletable ? "outlined" : "filled"}
                    label={role.viewName}
                    sx={{ mr: 0.5 }}
                    key={`${user.userId}+${role.roleId}`}
                  />
                ))}
              </StyledTableCell>
              <StyledTableCell>
                {user.teamDetails.map((team) => (
                  <Chip
                    variant={team.isUserDeletable ? "outlined" : "filled"}
                    label={team.teamName}
                    sx={{ mr: 0.5 }}
                    key={`${user.userId}+${team.teamId}`}
                  />
                ))}
              </StyledTableCell>
              <StyledTableCell>
                {user.isActive ? <Chip label="Active" color="secondary" /> : <Chip label="In-Active" />}
              </StyledTableCell>
              <StyledTableCell align="right">
                {isEditAccessible && (
                  <>
                    <IconButton color="primary" aria-label="remove" onClick={() => handleEditButton(user)}>
                      <EditIcon />
                    </IconButton>
                  </>
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </CustomTableContainer>
  );
};

export default ViewTable;
