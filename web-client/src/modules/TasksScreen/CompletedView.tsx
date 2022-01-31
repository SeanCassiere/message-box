import React, { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import Moment from "react-moment";

import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";

import IconButton from "@mui/material/IconButton";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import TextField from "@mui/material/TextField";

import EditIcon from "@mui/icons-material/Edit";

import TablePaginationActions from "../../shared/components/TablePaginationActions/TablePaginationActions";
import CustomTableContainer from "../../shared/components/CustomTableContainer";
import StyledTableCell from "../../shared/components/StyledTableCell/StyledTableCell";

import { client } from "../../shared/api/client";
import { ITask } from "../../shared/interfaces/Task.interfaces";
import { markdownToForHtmlInsert, sortTasksByDateForColumn, truncateTextByLength } from "../../shared/util/general";
import { useSelector } from "react-redux";
import { selectAppProfileState } from "../../shared/redux/store";
import { colorsMap } from "../../shared/util/colorsMap";
import { taskColorOpacity } from "../../shared/util/constants";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

/**
 * @description this component houses the view "Completed" tab of the TaskScreen
 */

interface Props {
  ownerId: string;
  refreshCountState: number;
  onEditTask: (editOwnerId: string) => void;
}

const CompletedView = (props: Props) => {
  const { refreshCountState, ownerId, onEditTask } = props;

  const { enqueueSnackbar } = useSnackbar();

  const { formats } = useSelector(selectAppProfileState);

  const [currentPage, setCurrentPage] = useState(0);
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [viewingTasks, setViewingTasks] = useState<ITask[]>([]);

  const [clientDateValue, setClientDateValue] = useState(new Date().toISOString().substring(0, 10));
  const [searchDate, setSearchDate] = useState(new Date().toISOString().substring(0, 10));

  const searchForTasks = useCallback(
    (userId, abort: AbortController) => {
      const params = new URLSearchParams();
      params.set("for", "Completed");
      params.set("ownerId", userId);
      params.set("currentDate", searchDate);
      client
        .get("/Tasks", { params, signal: abort.signal })
        .then((res) => {
          if (res.status === 200) {
            const sortedTasks = sortTasksByDateForColumn(res.data);
            setAllTasks(sortedTasks);
            setViewingTasks(sortedTasks.slice(0, 10));
          } else {
            enqueueSnackbar(`Error searching for completed tasks.`, { variant: "error" });
          }
        })
        .catch((e) => {
          console.log(e);
          enqueueSnackbar(`Error searching for completed tasks.`, { variant: "error" });
        })
        .finally(() => {});
    },
    [enqueueSnackbar, searchDate]
  );

  useEffect(() => {
    const abort = new AbortController();
    setCurrentPage(0);
    searchForTasks(ownerId, abort);

    return () => {
      abort.abort();
    };
  }, [ownerId, searchForTasks, refreshCountState]);

  const handlePageChange = useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      const startIndex = page * 10;
      const endIndex = startIndex + 10 + 1;
      setViewingTasks(allTasks.slice(startIndex, endIndex));
      setCurrentPage(page);
    },
    [allTasks]
  );

  const renderColorBox = useCallback((color: string) => {
    const findColor = colorsMap.find((c) => c.bgColor === color);

    const bgColor = findColor ? findColor.bgColor : color;
    const borderColor = findColor ? findColor.borderColor : colorsMap[0].borderColor;
    return (
      <Box
        sx={{
          width: "30px",
          height: "30px",
          opacity: `${taskColorOpacity}`,
          border: `2px solid ${borderColor}`,
          bgcolor: bgColor,
        }}
      ></Box>
    );
  }, []);

  return (
    <>
      <Grid container sx={{ mt: 2, mb: 3 }} spacing={2}>
        <Grid item xs={12}>
          <Typography sx={{ mb: 1 }} variant="h5" component="h3">
            Filters
          </Typography>
        </Grid>
        <Grid item xs={2} md={2}>
          <Box>
            <MobileDatePicker
              label="Completed Date"
              value={new Date(clientDateValue)}
              inputFormat={formats.shortDateFormat}
              onChange={(newValue) => {
                if (newValue) {
                  setClientDateValue(new Date(newValue).toISOString().substring(0, 10));
                }
              }}
              onAccept={(newValue) => {
                if (newValue) {
                  setSearchDate(new Date(newValue).toISOString().substring(0, 10));
                }
              }}
              showTodayButton
              renderInput={(params) => <TextField {...params} variant="standard" fullWidth />}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          <Box sx={{ mt: 1 }}>
            <CustomTableContainer>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell width={200}>Completed date</StyledTableCell>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell width={50}>Color</StyledTableCell>
                    <StyledTableCell>Content</StyledTableCell>
                    <StyledTableCell align="right">#</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewingTasks.map((task) => (
                    <StyledTableRow key={`completed-view-${task.taskId}`}>
                      <StyledTableCell component="th" scope="row">
                        <Moment format={formats.shortDateTimeFormat}>
                          {task.completedDate ? task.completedDate : new Date().toISOString()}
                        </Moment>
                      </StyledTableCell>
                      <StyledTableCell>{task.title}</StyledTableCell>
                      <StyledTableCell>{renderColorBox(task.bgColor)}</StyledTableCell>
                      <StyledTableCell>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: truncateTextByLength(markdownToForHtmlInsert(task.content), {
                              maxLength: 50,
                              includesDots: true,
                            }),
                          }}
                        ></span>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <IconButton color="primary" aria-label="edit" onClick={() => onEditTask(task.taskId)}>
                          <EditIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10]}
                      colSpan={5}
                      count={allTasks.length}
                      rowsPerPage={10}
                      page={currentPage}
                      SelectProps={{
                        inputProps: {
                          "aria-label": "rows per page",
                        },
                        native: true,
                      }}
                      onPageChange={handlePageChange}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </CustomTableContainer>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default CompletedView;
