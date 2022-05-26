import React, { useEffect, useState, useCallback } from "react";
import { useSnackbar } from "notistack";
import { GridColDef } from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import IconButton from "@mui/material/IconButton";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import DateTimePicker from "@mui/lab/DateTimePicker";
import DatePicker from "@mui/lab/DatePicker";

import EditIcon from "@mui/icons-material/Edit";

import NormalDataGrid from "../../shared/components/DataGrid/NormalDataGrid";
import FormTextField from "../../shared/components/Form/FormTextField/FormTextField";

import { client } from "../../shared/api/client";
import { ITask } from "../../shared/interfaces/Task.interfaces";
import { sortTasksByDateForColumn } from "../../shared/util/general";
import { useSelector } from "react-redux";
import { selectUserState } from "../../shared/redux/store";
import { colorsMap } from "../../shared/util/colorsMap";
import { taskColorOpacity } from "../../shared/util/constants";
import { MESSAGES } from "../../shared/util/messages";
import { formatDateTimeShort } from "../../shared/util/dateTime";

interface Props {
  ownerId: string;
  refreshCountState: number;
  onEditTask: (editOwnerId: string) => void;
}

const CompletedView = (props: Props) => {
  const { refreshCountState, ownerId, onEditTask } = props;

  const { enqueueSnackbar } = useSnackbar();

  const { formats } = useSelector(selectUserState);

  const [isLoading, setIsLoading] = useState(true);
  const [allTasks, setAllTasks] = useState<ITask[]>([]);

  const [searchDate, setSearchDate] = useState(new Date().toISOString().substring(0, 10));

  const searchForTasks = useCallback(
    (userId, abort: AbortController) => {
      setIsLoading(true);

      const params = new URLSearchParams();
      params.set("for", "Completed");
      params.set("currentDate", searchDate);
      params.set("ownerId", userId);
      client
        .get("/Tasks", { params, signal: abort.signal })
        .then((res) => {
          if (res.status === 200) {
            const sortedTasks = sortTasksByDateForColumn(res.data);
            setAllTasks(sortedTasks);
          } else {
            enqueueSnackbar(`Error searching for completed tasks.`, { variant: "error" });
          }
        })
        .catch((e) => {
          console.log(e);
          enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [enqueueSnackbar, searchDate]
  );

  useEffect(() => {
    const abort = new AbortController();
    searchForTasks(ownerId, abort);

    return () => {
      abort.abort();
    };
  }, [ownerId, searchForTasks, refreshCountState]);

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
          borderRadius: 1,
        }}
      ></Box>
    );
  }, []);

  const columns: GridColDef[] = React.useMemo(() => {
    const cols: GridColDef[] = [];
    cols.push({
      field: "completedDate",
      headerName: "Completed date",
      description: "Date the task was completed",
      align: "left",
      headerAlign: "left",
      type: "date",
      sortable: true,
      width: 200,
      valueFormatter: (row) => formatDateTimeShort(row.value),
    });
    cols.push({
      field: "title",
      headerName: "Task title",
      description: "Task title",
      align: "left",
      headerAlign: "left",
      type: "date",
      sortable: true,
      filterable: true,
      width: 550,
    });
    cols.push({
      field: "dueDate",
      headerName: "Due date",
      description: "Date the task was due",
      align: "left",
      headerAlign: "left",
      type: "date",
      sortable: true,
      width: 200,
      valueFormatter: (row) => formatDateTimeShort(row.value),
    });
    cols.push({
      field: "bgColor",
      headerName: "Color",
      description: "Color assigned to the task",
      align: "left",
      headerAlign: "left",
      renderCell: (row) => <span>{renderColorBox(row.value)}</span>,
    });
    cols.push({
      field: "content",
      headerName: "Content",
      description: "Task content",
      align: "left",
      headerAlign: "left",
      width: 500,
    });
    cols.push({
      field: "taskId",
      headerName: "Actions",
      description: "Actions",
      sortable: false,
      headerAlign: "right",
      type: "actions",
      align: "right",
      hideable: false,
      renderCell: (row) => (
        <span>
          <IconButton color="primary" aria-label="edit" onClick={() => onEditTask(row.value)}>
            <EditIcon />
          </IconButton>
        </span>
      ),
    });
    return cols;
  }, [onEditTask, renderColorBox]);

  const viewingCurrentDate = React.useMemo(() => {
    try {
      return searchDate !== "" && searchDate !== null ? new Date(searchDate).toISOString() : null;
    } catch (error) {
      return null;
    }
  }, [searchDate]);

  return (
    <React.Fragment>
      <Grid container sx={{ mt: 2, mb: 3 }} spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container>
              <Grid item xs={12}>
                <Typography sx={{ mb: 1 }} variant="h5" component="h3">
                  Filters
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Box sx={{ mt: 1.5 }}>
                  <DatePicker
                    label="Completed date"
                    value={viewingCurrentDate}
                    inputFormat={formats.shortDateFormat}
                    onChange={(newValue) => {
                      const momentDate = newValue as any;
                      if (momentDate && momentDate._isValid) {
                        setSearchDate(new Date(momentDate).toISOString().substring(0, 10));
                        return;
                      }
                    }}
                    showDaysOutsideCurrentMonth
                    onAccept={(newValue) => {
                      const momentDate = newValue as any;
                      if (momentDate && momentDate._isValid) {
                        setSearchDate(new Date(momentDate).toISOString().substring(0, 10));
                        return;
                      }
                    }}
                    loading={isLoading}
                    renderInput={(params) => (
                      <FormTextField
                        fullWidth
                        {...params}
                        name="completedDate"
                        size="small"
                        disabled={isLoading}
                        asteriskRequired
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper>
            <Box sx={{ p: 1 }}>
              <NormalDataGrid
                columns={columns}
                rows={allTasks.map((d) => ({ ...d, id: d.taskId }))}
                loading={isLoading}
                height={700}
                disableElevation
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CompletedView;
