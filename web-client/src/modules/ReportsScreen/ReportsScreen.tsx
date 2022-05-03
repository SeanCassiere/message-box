import React, { useCallback, useMemo } from "react";
import { flushSync } from "react-dom";

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
  const [selectedReportData, setSelectedReportData] = React.useState<ExtendedReportSchema | null>(null);
  const [reports, setReports] = React.useState<ExtendedReportSchema[]>([]);

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
    },
    [reports]
  );

  React.useEffect(() => {
    client
      .get("/Reports")
      .then((res) => {
        if (res.status !== 200) {
          console.log("get reports failed");
        } else {
          const map = res.data.map((r: any) => ({ ...r, label: r.reportName }));
          setReports(map);
        }
      })
      .catch((error) => {
        console.log("get reports by a fair amount");
      })
      .finally(() => {});
  }, []);

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
