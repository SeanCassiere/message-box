import React from "react";

import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { GridColDef, DataGrid, GridColumnVisibilityModel } from "@mui/x-data-grid";

import PageBlockItem from "../../Layout/PageBlockItem";
import ReportsDataGridToolbar from "../ReportsDataGridToolbar";

type IProps = {
  columns: GridColDef[];
  rows: any[];
  loading?: boolean;
  initialVisibleColumns?: GridColumnVisibilityModel;
  height?: number | string;
};

const ReportDataGrid = (props: IProps) => {
  return (
    <PageBlockItem height={props.height ?? 700}>
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
          components={{ Toolbar: ReportsDataGridToolbar, LoadingOverlay: LinearProgress }}
          initialState={{
            columns: {
              columnVisibilityModel: props.initialVisibleColumns,
            },
          }}
        />
      </Box>
    </PageBlockItem>
  );
};

export default React.memo(ReportDataGrid);
