import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import PageBlockItem from "../../shared/components/Layout/PageBlockItem";
import FilterField from "./FilterField";

import { IReportSchema } from "../../shared/interfaces/Reports.interfaces";
import { removeEmptyQueryParamsToSend } from "../../shared/util/general";

interface IProps {
  selectedReport: IReportSchema;
}

const ReportResultData = (props: IProps) => {
  const { selectedReport } = props;

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
            const params = removeEmptyQueryParamsToSend(filterData);
            console.log(JSON.stringify(params));
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
                Clear Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </PageBlockItem>
      <PageBlockItem>
        <Box>
          <Typography>Table Data</Typography>
        </Box>
      </PageBlockItem>
    </>
  );
};

export default React.memo(ReportResultData);
