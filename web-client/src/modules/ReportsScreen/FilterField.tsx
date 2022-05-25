import React from "react";

import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import FormTextField from "../../shared/components/Form/FormTextField";

import { IReportSearchFieldSchema } from "../../shared/interfaces/Reports.interfaces";
import { useSelector } from "react-redux";
import { selectUserState } from "../../shared/redux/store";

const FilterField = React.memo(
  ({ field, filterData, setFilterData }: { field: IReportSearchFieldSchema; filterData: any; setFilterData: any }) => {
    const { formats } = useSelector(selectUserState);
    const dateMemoed = React.useMemo(() => {
      try {
        return filterData[field.fieldName] !== "" && filterData[field.fieldName] !== null
          ? new Date(filterData[field.fieldName]).toISOString()
          : null;
      } catch (error) {
        return null;
      }
    }, [field.fieldName, filterData]);

    if (field.fieldType === "form-date") {
      return (
        <FormControl fullWidth>
          <DesktopDatePicker
            label={field.label}
            value={dateMemoed}
            inputFormat={formats.shortDateFormat}
            onChange={(date, keyboardValue) => {
              const momentDate = date as any;
              if (momentDate && momentDate._isValid) {
                setFilterData((prev: any) => ({
                  ...prev,
                  [field.fieldName]: new Date(momentDate).toISOString().substring(0, 10),
                }));
                return;
              }
            }}
            // showDaysOutsideCurrentMonth
            renderInput={(params) => (
              <FormTextField
                variant="outlined"
                fullWidth
                label={field.label}
                {...params}
                name={field.fieldName}
                size="small"
                required={field.mandatory}
              />
            )}
          />
        </FormControl>
      );
    }

    if (field.fieldType === "form-select") {
      return (
        <FormControl fullWidth>
          <Autocomplete
            id={`${field.fieldName}-autocomplete`}
            options={field.options}
            value={
              filterData[field.fieldName] ? field.options.find((o) => o.value === filterData[field.fieldName]) : null
            }
            getOptionLabel={(option) => option.label}
            onChange={(evt, value) => {
              if (!value) {
                setFilterData((prev: any) => ({ ...prev, [field.fieldName]: "" }));
                return;
              }
              setFilterData((prev: any) => ({ ...prev, [field.fieldName]: value.value }));
            }}
            sx={{ mr: 2, width: "100%" }}
            size="small"
            renderInput={(params) => (
              <FormTextField
                {...params}
                label={field.label}
                InputLabelProps={{ disableAnimation: false, shrink: undefined }}
                fullWidth
                required={field.mandatory}
              />
            )}
          />
        </FormControl>
      );
    }

    if (field.fieldType === "form-text") {
      return (
        <FormControl fullWidth>
          <FormTextField
            autoComplete="off"
            label={field.label}
            value={filterData[field.fieldName] ?? undefined}
            onChange={(evt) => {
              setFilterData((prev: any) => ({ ...prev, [field.fieldName]: evt.target.value }));
            }}
            name={filterData[field.fieldName]}
            required={field.mandatory}
            size="small"
          />
        </FormControl>
      );
    }

    return <></>;
  }
);

export default FilterField;
