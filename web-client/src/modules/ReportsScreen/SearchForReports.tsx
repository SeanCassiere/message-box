import React, { useCallback, useMemo, useState } from "react";

import { REPORT_LIST_TYPE } from "./ReportsScreen";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { COMMON_ITEM_BORDER_COLOR } from "../../shared/util/constants";

interface Props {
  availableReports: REPORT_LIST_TYPE;
}

const SearchForReports = (props: Props) => {
  const { availableReports } = props;

  const [selectedReportId, setSelectedReportId] = useState("");

  const formattedReports = useMemo(() => {
    const reps = availableReports.map((report) => {
      return { label: report.name, reportId: report.id };
    });
    setSelectedReportId(reps[0].reportId);
    return reps;
  }, [availableReports]);

  const handleSearchSelectItem = useCallback(
    (evt: any) => {
      if (!evt?.target?.value || evt.target.value.length === 0) return;

      const selectedReport = formattedReports.find((report) => report.label === evt.target.value);

      if (selectedReport) setSelectedReportId(selectedReport.reportId);
    },
    [formattedReports]
  );

  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12} md={12}>
        <Box>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={formattedReports}
            sx={{ width: 300 }}
            onSelect={handleSearchSelectItem}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search reports"
                size="small"
                InputProps={{ ...params.InputProps, endAdornment: <></> }}
              />
            )}
          />
        </Box>
      </Grid>
      <Grid item xs={12} md={12}>
        <Grid container spacing={1}>
          {formattedReports.map((report) => (
            <Grid key={`report-item-${report.label}`} item xs={12} md={3}>
              <Box
                onClick={() => setSelectedReportId(report.reportId)}
                sx={{
                  cursor: "pointer",
                  px: 2,
                  py: 1,
                  bgcolor: selectedReportId === report.reportId ? "primary.50" : "#fff",
                  borderStyle: "solid",
                  borderColor: selectedReportId === report.reportId ? "primary.500" : COMMON_ITEM_BORDER_COLOR,
                  borderWidth: 2,
                  borderRadius: 3,
                }}
              >
                {report.label}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SearchForReports;
