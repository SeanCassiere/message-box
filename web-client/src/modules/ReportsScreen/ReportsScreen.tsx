import React, { useCallback, useMemo } from "react";
import { flushSync } from "react-dom";
import { useSnackbar } from "notistack";

import Typography from "@mui/material/Typography";

import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import SearchForReports from "./SearchForReports";
import PageBlockItem from "../../shared/components/Layout/PageBlockItem";
import ReportResultData from "./ReportResultData";

import { IReportSchema } from "../../shared/interfaces/Reports.interfaces";
import { client } from "../../shared/api/client";

export interface ExtendedReportSchema extends IReportSchema {
  label: string;
}

const ReportsScreen = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [selectedReportData, setSelectedReportData] = React.useState<ExtendedReportSchema | null>(null);
  const [reports, setReports] = React.useState<ExtendedReportSchema[]>([]);

  const fetchReports = useCallback(
    async (isInitial: boolean = false) => {
      client
        .get("/Reports")
        .then((res) => {
          if (res.status !== 200) {
            console.log("get reports failed");
            enqueueSnackbar(isInitial ? `Error loading reports` : `Could not refresh the reports`, {
              variant: isInitial ? "error" : "warning",
            });
          } else {
            const mappedFetchReports = res.data.map((r: any) => ({ ...r, label: r.reportName }));
            setReports(mappedFetchReports);
            if (isInitial && mappedFetchReports.length > 0) {
              setSelectedReportData(mappedFetchReports[0]);
            }
          }
        })
        .catch((error) => {
          enqueueSnackbar(isInitial ? `Error loading reports` : `Could not refresh the reports`, {
            variant: isInitial ? "error" : "warning",
          });
          console.log(`FATAL ERROR LOADING REPORTS ${new Date().toDateString()}`, error);
        })
        .finally(() => {});
    },
    [enqueueSnackbar]
  );

  const availableReports = useMemo(() => reports, [reports]);

  const selectViewingReportId = useCallback(
    (reportId: string) => {
      flushSync(() => {
        setSelectedReportData(null);
      });

      if (!reportId) return;

      const filtered = reports.find((r) => r.reportId === reportId);
      if (filtered) {
        setSelectedReportData(filtered);
      }
      fetchReports();
    },
    [fetchReports, reports]
  );

  React.useEffect(() => {
    fetchReports(true);
  }, [fetchReports]);

  return (
    <PagePaperWrapper>
      <Typography variant="h4" fontWeight={500} component="h1">
        Reports
      </Typography>
      <PageBlockItem title="Select report">
        <SearchForReports
          availableReports={availableReports}
          selectedReport={selectedReportData}
          selectReportFunc={selectViewingReportId}
        />
      </PageBlockItem>
      {selectedReportData && <ReportResultData selectedReport={selectedReportData} />}
    </PagePaperWrapper>
  );
};

export default ReportsScreen;
