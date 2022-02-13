import React from "react";

import Typography from "@mui/material/Typography";

import PagePaperWrapper from "../../shared/components/Layout/PagePaperWrapper";
import SearchForReports from "./SearchForReports";
import PageBlockItem from "../../shared/components/Layout/PageBlockItem";

const ReportsScreen = () => {
  return (
    <PagePaperWrapper>
      <Typography variant="h4" fontWeight={500} component="h1">
        Reports
      </Typography>
      <PageBlockItem title="Select report">
        <SearchForReports availableReports={REPORTS} />
      </PageBlockItem>
    </PagePaperWrapper>
  );
};

const REPORTS = [
  {
    id: "report-1",
    name: "User application usage report",
  },
  {
    id: "report-2",
    name: "User activity report",
  },
  {
    id: "report-3",
    name: "Team user activity report",
  },
  {
    id: "report-4",
    name: "Team live event usage report",
  },
  {
    id: "report-5",
    name: "Teams PSTN blocked users report",
  },
  {
    id: "report-6",
    name: "Teams device usage report",
  },
];

export type REPORT_LIST_TYPE = typeof REPORTS;

export default ReportsScreen;
