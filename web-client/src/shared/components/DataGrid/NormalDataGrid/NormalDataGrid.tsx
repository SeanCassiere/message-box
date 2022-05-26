import React from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import { GridColDef, DataGrid, GridColumnVisibilityModel } from "@mui/x-data-grid";

import ReportsDataGridToolbar from "../ReportsDataGridToolbar";
import { useTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

type IProps = {
  columns: GridColDef[];
  rows: any[];
  loading?: boolean;
  initialVisibleColumns?: GridColumnVisibilityModel;
  height?: number | string;
  showToolbar?: boolean;
  disableElevation?: boolean;
};

const NormalDataGrid = (props: IProps) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={props.disableElevation ? 0 : undefined}
      sx={{
        bgcolor: theme.palette.mode === "light" ? theme.palette.background.paper : grey[900],
        height: props.height || 600,
      }}
    >
      <Box sx={{ height: "100%" }}>
        <DataGrid
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "primary.300",
              borderRadius: 0,
              fontWeight: 900,
              fontSize: "1em",
              color: "white",
            },
            "& .MuiDataGrid-columnSeparator": {
              color: "primary.600",
            },
          }}
          columns={props.columns}
          rows={props.rows}
          loading={props.loading}
          disableSelectionOnClick
          components={{
            Toolbar: props.showToolbar ? ReportsDataGridToolbar : null,
            LoadingOverlay: LinearProgress,
          }}
          initialState={{
            columns: {
              columnVisibilityModel: props.initialVisibleColumns,
            },
          }}
          density="comfortable"
        />
      </Box>
    </Paper>
  );
};

export default React.memo(NormalDataGrid);
