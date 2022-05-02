import React from "react";

import FormControl from "@mui/material/FormControl";
import Autocomplete from "@mui/material/Autocomplete";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import TextField from "../../shared/components/Form/TextField";

import { IReportSearchFieldSchema } from "../../shared/interfaces/Reports.interfaces";
import { useSelector } from "react-redux";
import { selectUserState } from "../../shared/redux/store";

const FilterField = React.memo(
  ({ field, filterData, setFilterData }: { field: IReportSearchFieldSchema; filterData: any; setFilterData: any }) => {
    const { formats } = useSelector(selectUserState);
    if (field.fieldType === "form-date") {
      return (
        <FormControl fullWidth>
          <DesktopDatePicker
            label={field.label}
            value={
              filterData[field.fieldName] !== "" &&
              filterData[field.fieldName] !== null &&
              new Date(filterData[field.fieldName])
                ? new Date(filterData[field.fieldName])
                : null
            }
            inputFormat={formats.shortDateFormat}
            onChange={(date, keyboardValue) => {
              const momentDate = date as any;
              console.log({ date, keyboardValue });
              if (momentDate && momentDate._isValid) {
                setFilterData((prev: any) => ({
                  ...prev,
                  [field.fieldName]: new Date(momentDate).toISOString().substring(0, 10),
                }));
              }
            }}
            showDaysOutsideCurrentMonth
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
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
            openOnFocus
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
              <TextField
                {...params}
                placeholder={field.label}
                InputLabelProps={{ disableAnimation: false, shrink: true }}
                InputProps={{ ...params.InputProps, endAdornment: <></> }}
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
          <TextField
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
