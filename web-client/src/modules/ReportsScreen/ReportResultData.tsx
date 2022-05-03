import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  GridColDef,
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

import PageBlockItem from "../../shared/components/Layout/PageBlockItem";
import FilterField from "./FilterField";

import { IReportSchema } from "../../shared/interfaces/Reports.interfaces";
import { removeEmptyQueryParamsToSend } from "../../shared/util/general";
import { client } from "../../shared/api/client";
import { formatDateTimeShort } from "../../shared/util/dateTime";

interface IProps {
  selectedReport: IReportSchema;
}

const ReportResultData = (props: IProps) => {
  const { selectedReport } = props;

  const [loading, setLoading] = React.useState(true);

  const initialData = selectedReport?.searchFields.reduce((prev, field) => {
    if (field.fieldType === "form-date" && (field.defaultValue === "" || field.defaultValue === null)) {
      return { ...prev, [field.fieldName]: null };
    }
    return { ...prev, [field.fieldName]: field.defaultValue };
  }, {});
  const [filterData, setFilterData] = React.useState<{ [key: string]: any }>(initialData);

  const viewableFilters = selectedReport.searchFields.filter((f) => f.hidden === false && f.visible === true);
  const setInitialFilters = React.useCallback(() => {
    setFilterData(initialData);
    setLoading(true);
  }, [initialData]);

  const [reportData, setReportData] = React.useState([]);

  const columns: GridColDef[] = React.useMemo(() => {
    const cols: GridColDef[] = [];
    selectedReport.reportFields.forEach((field) => {
      let colData = {} as GridColDef;
      colData.field = field.fieldName;
      colData.headerName = field.label;
      colData.description = field.label;

      if (field.fieldName === "timestamp") {
        colData.valueFormatter = (value: any) => {
          return formatDateTimeShort(value.value);
        };
        colData.minWidth = 250;
      }

      if (field.fieldName === "action") {
        colData.minWidth = 200;
      }

      if (field.fieldName === "description") {
        colData.minWidth = 450;
        colData.flex = 1;
      }

      cols.push(colData);
    });

    cols[0].minWidth = 200;
    return cols;
  }, [selectedReport]);

  return (
    <>
      <PageBlockItem title="Filters">
        <Grid
          container
          spacing={2}
          sx={{ mt: 2 }}
          component="form"
          onSubmit={(e: any) => {
            e.preventDefault();
            const filterValues = removeEmptyQueryParamsToSend(filterData);
            setLoading(true);
            client
              .post(`/Reports`, { procedure: selectedReport.procedureName, ...filterValues }, { timeout: 60000 })
              .then((res) => {
                if (res.status === 200) {
                  setReportData(res.data);
                } else {
                  setReportData([]);
                }
              })
              .catch((error) => {
                setReportData([]);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          {viewableFilters.map((filter) => (
            <Grid item xs={12} md={2} key={filter.fieldName}>
              <Box>
                <FilterField field={filter} filterData={filterData} setFilterData={setFilterData} />
              </Box>
            </Grid>
          ))}
          <Grid item xs={12} md={2}>
            <Box>
              <Button fullWidth type="submit">
                Search
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box>
              <Button type="reset" color="secondary" fullWidth onClick={setInitialFilters}>
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </PageBlockItem>
      {loading === false && (
        <PageBlockItem height={650}>
          <Box
            sx={{
              height: "100%",
            }}
          >
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
              columns={columns}
              rows={reportData}
              loading={loading}
              components={{ Toolbar: CustomToolBar, LoadingOverlay: LinearProgress }}
              disableSelectionOnClick
            />
          </Box>
        </PageBlockItem>
      )}
    </>
  );
};

function CustomToolBar() {
  return (
    <GridToolbarContainer
      style={{ display: "flex", gap: 3, paddingTop: "0.5rem", paddingBottom: "0.5rem", paddingLeft: "0.5rem" }}
    >
      <GridToolbarColumnsButton variant="text" />
      <GridToolbarFilterButton {...({ variant: "text" } as any)} />
      <GridToolbarExport variant="text" printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}

export default React.memo(ReportResultData);
