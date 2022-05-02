import React, { useCallback, useMemo } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";

import TextField from "../../shared/components/Form/TextField";

import { COMMON_ITEM_BORDER_COLOR } from "../../shared/util/constants";
import { IReportSchema } from "../../shared/interfaces/Reports.interfaces";

interface Props {
  availableReports: IReportSchema[];
  currentReportId: string;
  selectReportFunc: (reportId: string) => void;
}

const SearchForReports = (props: Props) => {
  const { availableReports, currentReportId, selectReportFunc } = props;

  const formattedReports = useMemo(() => {
    const reps = availableReports.map((report) => {
      return { label: report.reportName, reportId: report.reportId };
    });
    // selectReportFunc(reps[0]?.reportId);
    return reps;
  }, [availableReports]);

  const handleSearchSelectItem = useCallback(
    (evt: any) => {
      if (!evt?.target?.value || evt.target.value.length === 0) return;

      const selectedReport = formattedReports.find((report) => report.label === evt.target.value);

      if (selectedReport) selectReportFunc(selectedReport.reportId);
    },
    [formattedReports, selectReportFunc]
  );

  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={12} md={12}>
        <Box sx={{ maxWidth: { sx: "80vw", md: "25vw" } }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={formattedReports}
            sx={{ width: 300 }}
            fullWidth
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
                onClick={() => selectReportFunc(report.reportId)}
                sx={{
                  cursor: "pointer",
                  px: 2,
                  py: 1,
                  bgcolor: currentReportId === report.reportId ? "primary.50" : "#fff",
                  borderStyle: "solid",
                  borderColor: currentReportId === report.reportId ? "primary.500" : COMMON_ITEM_BORDER_COLOR,
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

export default React.memo(SearchForReports);
