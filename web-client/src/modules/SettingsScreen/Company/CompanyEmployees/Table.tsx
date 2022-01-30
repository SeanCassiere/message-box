import { IUserProfileWithSortedDetails } from "../../../../shared/interfaces/User.interfaces";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";

import CustomTableContainer from "../../../../shared/components/CustomTableContainer";

import { usePermission } from "../../../../shared/hooks/usePermission";

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
            {/* <StyledTableCell>Email</StyledTableCell> */}
            <StyledTableCell>Role(s)</StyledTableCell>
            <StyledTableCell>Team(s)</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            {/* <StyledTableCell>Updated At</StyledTableCell> */}
            <StyledTableCell align="right">#</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataList.map((user) => (
            <StyledTableRow key={user.userId}>
              <StyledTableCell component="th" scope="row">
                {user.firstName} {user.lastName}
              </StyledTableCell>
              {/* <StyledTableCell>{user.email}</StyledTableCell> */}
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
