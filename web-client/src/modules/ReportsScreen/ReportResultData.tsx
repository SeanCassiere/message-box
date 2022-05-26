import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { GridColDef } from "@mui/x-data-grid";

import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import PageBlockItem from "../../shared/components/Layout/PageBlockItem";
import FilterField from "./FilterField";
import FormTextField from "../../shared/components/Form/FormTextField";
import ReportDataGrid from "../../shared/components/DataGrid/ReportDataGrid";

import { IReportSchema } from "../../shared/interfaces/Reports.interfaces";
import { removeEmptyQueryParamsToSend } from "../../shared/util/general";
import { client } from "../../shared/api/client";
import { formatDateTimeShort, formatDateShort } from "../../shared/util/dateTime";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

  // filter options
  const initialFilters = selectedReport.searchFields.filter((f) => f.hidden === false).map((r) => ({ ...r }));

  const [currentFilters, setCurrentFilters] = React.useState(initialFilters);
  const setInitialFilters = React.useCallback(() => {
    setFilterData(initialData);

    setCurrentFilters(initialFilters);
    setLoading(true);
  }, [initialData, initialFilters]);

  const [reportData, setReportData] = React.useState([]);

  const columns: GridColDef[] = React.useMemo(() => {
    const cols: GridColDef[] = [];
    selectedReport.reportFields.forEach((field) => {
      let colData = {} as GridColDef;
      colData.field = field.fieldName;
      colData.headerName = field.label;
      colData.description = field.label;
      colData.minWidth = 150;

      if (field.fieldType === "date-time") {
        colData.valueFormatter = (value: any) => {
          const dateValue = formatDateTimeShort(value.value);
          return dateValue !== "Invalid date" ? dateValue : "";
        };
        colData.minWidth = 250;
      }

      if (field.fieldType === "date") {
        colData.valueFormatter = (value: any) => {
          const dateValue = formatDateShort(value.value);
          return dateValue !== "Invalid date" ? dateValue : "";
        };
        colData.minWidth = 250;
      }

      if (field.fieldName === "action") {
        colData.minWidth = 200;
      }

      if (field.fieldName === "taskName") {
        colData.minWidth = 300;
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

  const visibleColumns = React.useMemo(() => {
    let fields = {};
    selectedReport.reportFields.forEach((field) => {
      fields = {
        ...fields,
        [field.fieldName]: field.visible,
      };
    });

    return fields;
  }, [selectedReport.reportFields]);

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
          {currentFilters
            .filter((f) => f.visible)
            .map((filter) => (
              <Grid item xs={12} md={2} key={filter.fieldName}>
                <Box>
                  <FilterField field={filter} filterData={filterData} setFilterData={setFilterData} />
                </Box>
              </Grid>
            ))}
          {selectedReport.searchFields.filter((f) => f.hidden === false).length > 0 && (
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <Autocomplete
                  size="small"
                  limitTags={2}
                  renderInput={(params) => <FormTextField {...params} label="Search filters" />}
                  multiple
                  options={currentFilters.filter((r) => r.hidden === false)}
                  getOptionLabel={(option) => option.label}
                  disableCloseOnSelect
                  disableClearable
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        onClick={() => {
                          if (option.mandatory) return;
                          const allFilters = currentFilters;

                          const indexOfOption = allFilters.findIndex((f) => f.fieldName === option.fieldName);

                          if (indexOfOption > -1) {
                            currentFilters[indexOfOption].visible = option.visible ? false : true;
                            setCurrentFilters([...allFilters]);
                          }
                        }}
                      >
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          disabled={option.mandatory}
                          checked={option.mandatory || option.visible}
                        />
                        {option.label}
                      </li>
                    );
                  }}
                  renderTags={(value, getTagProps) => <span></span>}
                  disableListWrap
                />
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12} md={2}>
            <Button fullWidth type="submit" sx={{ height: "100%" }}>
              Search
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button type="reset" color="secondary" fullWidth onClick={setInitialFilters} sx={{ height: "100%" }}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </PageBlockItem>
      {loading === false && (
        <ReportDataGrid
          columns={columns}
          rows={reportData}
          loading={loading}
          height={700}
          initialVisibleColumns={visibleColumns}
        />
      )}
    </>
  );
};

export default React.memo(ReportResultData);
