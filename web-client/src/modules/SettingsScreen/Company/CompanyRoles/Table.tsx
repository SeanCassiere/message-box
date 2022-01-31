import React from "react";
import Moment from "react-moment";
import { useSelector } from "react-redux";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CustomTableContainer from "../../../../shared/components/CustomTableContainer";
import StyledTableCell from "../../../../shared/components/StyledTableCell/StyledTableCell";

import { IRoleProfile } from "../../../../shared/interfaces/Client.interfaces";
import { usePermission } from "../../../../shared/hooks/usePermission";
import { selectUserState } from "../../../../shared/redux/store";

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
  dataList: IRoleProfile[];
  editItemHandler: (value: string) => void;
  deleteItemHandler: (value: string) => void;
}

const ViewTable = ({ dataList, editItemHandler, deleteItemHandler }: ITableProps) => {
  const isDeleteAccessible = usePermission("role:admin");
  const isEditAccessible = usePermission("role:admin");

  const { formats } = useSelector(selectUserState);

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
          {dataList.map((role) => (
            <StyledTableRow key={role.roleId}>
              <StyledTableCell component="th" scope="row">
                {role.viewName}
              </StyledTableCell>
              <StyledTableCell>
                {role.isUserDeletable ? (
                  <Chip label="User created" variant="outlined" />
                ) : (
                  <Chip label="System generated" />
                )}
              </StyledTableCell>
              <StyledTableCell>
                <Moment interval={formats.defaultDateRefreshInterval} fromNow>
                  {role.updatedAt}
                </Moment>
              </StyledTableCell>
              <StyledTableCell align="right">
                {role.isUserDeletable && isDeleteAccessible && (
                  <>
                    <IconButton color="error" aria-label="remove" onClick={() => handleDeleteButton(role)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
                {role.isUserDeletable && isEditAccessible && (
                  <>
                    <IconButton color="primary" aria-label="edit" onClick={() => handleEditButton(role)}>
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
