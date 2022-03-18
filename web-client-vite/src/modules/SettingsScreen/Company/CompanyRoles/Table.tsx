import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import CustomTableContainer from "../../../../shared/components/Table/StyledTableContainer";
import StyledTableCell from "../../../../shared/components/Table/StyledTableCell";
import StyledTableRow from "../../../../shared/components/Table/StyledTableRow";

import { IRoleProfile } from "../../../../shared/interfaces/Client.interfaces";
import { usePermission } from "../../../../shared/hooks/usePermission";
import { formatDateFromNow } from "../../../../shared/util/dateTime";

interface ITableProps {
  dataList: IRoleProfile[];
  editItemHandler: (value: string) => void;
  deleteItemHandler: (value: string) => void;
}

const ViewTable = ({ dataList, editItemHandler, deleteItemHandler }: ITableProps) => {
  const handleEditButton = (role: IRoleProfile) => {
    editItemHandler(role.roleId);
  };
  const handleDeleteButton = (role: IRoleProfile) => {
    deleteItemHandler(role.roleId);
  };

  return (
    <CustomTableContainer>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell width={300}>Created by</StyledTableCell>
            <StyledTableCell width={300}>Last updated</StyledTableCell>
            <StyledTableCell align="right">#</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataList
            .filter((role) => !role.isUserDeletable)
            .map((role) => (
              <RenderRowData
                key={role.roleId}
                role={role}
                handleDeleteButton={handleDeleteButton}
                handleEditButton={handleEditButton}
              />
            ))}
          {dataList
            .filter((role) => role.isUserDeletable)
            .map((role) => (
              <RenderRowData
                key={role.roleId}
                role={role}
                handleDeleteButton={handleDeleteButton}
                handleEditButton={handleEditButton}
              />
            ))}
        </TableBody>
      </Table>
    </CustomTableContainer>
  );
};

const RenderRowData = (props: {
  role: IRoleProfile;
  handleDeleteButton: (role: IRoleProfile) => void;
  handleEditButton: (role: IRoleProfile) => void;
}) => {
  const { role, handleDeleteButton, handleEditButton } = props;

  const isDeleteAccessible = usePermission("role:admin");
  const isEditAccessible = usePermission("role:admin");

  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        {role.viewName}
      </StyledTableCell>
      <StyledTableCell>
        {role.isUserDeletable ? <Chip label="User created" variant="outlined" /> : <Chip label="System generated" />}
      </StyledTableCell>
      <StyledTableCell>{formatDateFromNow(role.updatedAt)}</StyledTableCell>
      <StyledTableCell align="right">
        {role.isUserDeletable && isDeleteAccessible && (
          <>
            <IconButton color="error" aria-label="remove" onClick={() => handleDeleteButton(role)}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
        {isEditAccessible && (
          <>
            <IconButton color="primary" aria-label="edit" onClick={() => handleEditButton(role)}>
              {role.isUserDeletable ? <EditIcon /> : <VisibilityIcon color="disabled" />}
            </IconButton>
          </>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default ViewTable;
