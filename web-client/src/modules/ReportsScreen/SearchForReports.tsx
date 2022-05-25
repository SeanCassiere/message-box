import React, { useCallback, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";

import FormTextField from "../../shared/components/Form/FormTextField";

import { COMMON_ITEM_BORDER_COLOR } from "../../shared/util/constants";
import { ExtendedReportSchema } from "./ReportsScreen";

interface Props {
  availableReports: ExtendedReportSchema[];
  selectedReport: ExtendedReportSchema | null;
  selectReportFunc: (reportId: string) => void;
}

const SearchForReports = (props: Props) => {
  const theme = useTheme();
  const isOnMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { availableReports, selectedReport, selectReportFunc } = props;

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
          {availableReports.length > 0 && (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={formattedReports}
              value={selectedReport ?? availableReports[0]}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              sx={{ width: isOnMobile ? "100%" : 450 }}
              disableClearable
              fullWidth
              onSelect={handleSearchSelectItem}
              renderInput={(params) => <FormTextField {...params} label="Search reports" size="small" />}
            />
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={12} sx={{ mt: isOnMobile ? 2 : 1 }}>
        <Grid container spacing={1}>
          {formattedReports.map((report) => (
            <Grid key={`report-item-${report.label}`} item xs={12} md={3}>
              <Box
                onClick={() => selectReportFunc(report.reportId)}
                sx={{
                  cursor: "pointer",
                  px: 2,
                  py: 1,
                  borderStyle: "solid",
                  bgcolor:
                    theme.palette.mode === "light"
                      ? () => {
                          return selectedReport?.reportId === report.reportId ? "primary.50" : COMMON_ITEM_BORDER_COLOR;
                        }
                      : () => {
                          return selectedReport?.reportId === report.reportId ? "primary.400" : "#292929";
                        },
                  borderColor:
                    theme.palette.mode === "light"
                      ? () => {
                          return selectedReport?.reportId === report.reportId
                            ? "primary.500"
                            : COMMON_ITEM_BORDER_COLOR;
                        }
                      : () => {
                          return selectedReport?.reportId === report.reportId ? "primary.500" : "#292929";
                        },
                  borderWidth: 2,
                  borderRadius: 0.5,
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
