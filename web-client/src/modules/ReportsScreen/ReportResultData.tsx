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

  const [loading, setLoading] = React.useState(false);

  const initialData = selectedReport.searchFields.reduce((prev, field) => {
    if (field.fieldType === "form-date" && (field.defaultValue === "" || field.defaultValue === null)) {
      return { ...prev, [field.fieldName]: null };
    }
    return { ...prev, [field.fieldName]: field.defaultValue };
  }, {});
  const [filterData, setFilterData] = React.useState<{ [key: string]: any }>(initialData);

  const viewableFilters = selectedReport.searchFields.filter((f) => f.hidden === false);
  const setInitialFilters = React.useCallback(() => {
    setFilterData(initialData);
  }, [initialData]);

  const [reportData, setReportData] = React.useState([]);

  const columns: GridColDef[] = React.useMemo(() => {
    const cols: GridColDef[] = [];
    selectedReport.reportFields.forEach((field) => {
      let colData = {} as GridColDef;
      colData.field = field.fieldName;
      colData.headerName = field.label;
      if (field.fieldName === "timestamp") {
        colData.valueFormatter = (value: any) => {
          return formatDateTimeShort(value);
        };
        colData.minWidth = 250;
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
              .post(`/Reports`, { procedure: selectedReport.procedureName, ...filterValues })
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
          <Grid item xs={12} md={1}>
            <Box>
              <Button fullWidth type="submit">
                Search
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={1}>
            <Box>
              <Button type="reset" color="secondary" fullWidth onClick={setInitialFilters}>
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </PageBlockItem>
      <PageBlockItem height={800}>
        <DataGrid
          sx={{ minHeight: "200px" }}
          columns={columns}
          rows={reportData}
          loading={loading}
          components={{ Toolbar: CustomToolBar, LoadingOverlay: LinearProgress }}
        />
      </PageBlockItem>
    </>
  );
};

function CustomToolBar() {
  return (
    <GridToolbarContainer style={{ display: "flex", gap: 3 }}>
      <GridToolbarFilterButton {...({ variant: "text" } as any)} />
      <GridToolbarColumnsButton variant="text" />
      <GridToolbarExport variant="text" />
    </GridToolbarContainer>
  );
}

export default React.memo(ReportResultData);
