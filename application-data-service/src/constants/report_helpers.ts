import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { log } from "#root/utils/logger";
import axios from "axios";

import { DEFAULT_REPORTS, REPORT_PROCEDURES } from "./default_reports";

function enterDefaultValueIntoSearchField(
  reports: typeof DEFAULT_REPORTS,
  fieldName: string,
  fieldValue: any,
  procedureName?: string
) {
  const allReports = reports;
  const reportReports: typeof DEFAULT_REPORTS = [];

  if (procedureName) {
    for (const report of allReports) {
      if (report.procedureName === procedureName) {
        for (const searchField of report.searchFields) {
          if (searchField.fieldName === fieldName) {
            searchField.defaultValue = fieldValue;
          }
        }
      }

      reportReports.push(report);
    }
  } else {
    for (const report of allReports) {
      for (const searchField of report.searchFields) {
        if (searchField.fieldName === fieldName) {
          searchField.defaultValue = fieldValue;
        }
      }

      reportReports.push(report);
    }
  }

  return reportReports;
}

function enterOptionsValueIntoSearchField(
  reports: typeof DEFAULT_REPORTS,
  fieldName: string,
  fieldValue: any,
  procedureName?: string
) {
  const allReports = reports;
  const reportReports: typeof DEFAULT_REPORTS = [];

  if (procedureName) {
    for (const report of allReports) {
      if (report.procedureName === procedureName) {
        for (const searchField of report.searchFields) {
          if (searchField.fieldName === fieldName) {
            searchField.options = fieldValue;
          }
        }
      }

      reportReports.push(report);
    }
  } else {
    for (const report of allReports) {
      for (const searchField of report.searchFields) {
        if (searchField.fieldName === fieldName) {
          searchField.options = fieldValue;
        }
      }
      reportReports.push(report);
    }
  }

  return reportReports;
}

type TypeSelectOption = { value: string; label: string };
export async function resolveReportsListForClient({ clientId, userId }: { clientId: string; userId: string }) {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDayOfCurrentMonth = new Date(y, m, 1);
  const lastDayOfCurrentMonth = new Date(y, m + 1, 0);

  let users: TypeSelectOption[] = [];
  try {
    let clientUsers: any[] = [];
    const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient`, {
      variables: {
        clientId: clientId,
      },
    });

    clientUsers = response.data;
    users = clientUsers.map((u) => ({ value: `${u.userId}`, label: `${u.firstName} ${u.lastName}` }));
  } catch (error) {
    log.error(
      `POST /reports/resolveReportsListForClient -> ${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient\n
      could not fetch the user ids for this client\n
      ${error}`
    );
  }

  // resolve teams
  let teams: TypeSelectOption[] = [];
  try {
    let clientTeams: any[] = [];
    const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/teams/getAllTeamsForClient`, {
      clientId: clientId,
    });

    clientTeams = response.data;
    teams = clientTeams.map((t) => ({ value: `${t.teamId}`, label: `${t.teamName}` }));
  } catch (error) {
    log.error(
      `POST /reports/resolveReportsListForClient -> ${AUTH_SERVICE_URI}/teams/getAllTeamsForClient\n
      could not fetch the user ids for this client\n
      ${error}`
    );
  }

  let reports = enterDefaultValueIntoSearchField(DEFAULT_REPORTS, "clientId", clientId); // w/ clientId

  /**
   * REPORT>>>
   * REPORT_PROCEDURES.GetEmployeeLoginReportForClient
   */
  reports = enterOptionsValueIntoSearchField(
    reports,
    "userId",
    users,
    REPORT_PROCEDURES.GetEmployeeLoginReportForClient
  ); // userId & labels
  reports = enterDefaultValueIntoSearchField(
    reports,
    "userId",
    null,
    REPORT_PROCEDURES.GetEmployeeLoginReportForClient
  ); // w/ default userId to null
  reports = enterDefaultValueIntoSearchField(
    reports,
    "startDate",
    firstDayOfCurrentMonth.toISOString().substring(0, 10),
    REPORT_PROCEDURES.GetEmployeeLoginReportForClient
  ); // w/ startDate
  reports = enterDefaultValueIntoSearchField(
    reports,
    "endDate",
    lastDayOfCurrentMonth.toISOString().substring(0, 10),
    REPORT_PROCEDURES.GetEmployeeLoginReportForClient
  ); // w/ endDate

  /**
   * REPORT>>>
   * REPORT_PROCEDURES.GetEmployeeLoginReportByTeam
   */
  reports = enterDefaultValueIntoSearchField(
    reports,
    "startDate",
    firstDayOfCurrentMonth.toISOString().substring(0, 10),
    REPORT_PROCEDURES.GetEmployeeLoginReportByTeam
  ); // w/ startDate
  reports = enterDefaultValueIntoSearchField(
    reports,
    "endDate",
    lastDayOfCurrentMonth.toISOString().substring(0, 10),
    REPORT_PROCEDURES.GetEmployeeLoginReportByTeam
  ); // w/ endDate
  reports = enterOptionsValueIntoSearchField(reports, "teamId", teams, REPORT_PROCEDURES.GetEmployeeLoginReportByTeam); // w/ teamIds
  reports = enterDefaultValueIntoSearchField(
    reports,
    "teamId",
    teams[0]?.value ?? null,
    REPORT_PROCEDURES.GetEmployeeLoginReportByTeam
  ); // w/ default teamId to null

  /**
   * REPORT>>>
   * REPORT_PROCEDURES.GetEmployeeFullActivity
   */
  reports = enterOptionsValueIntoSearchField(reports, "userId", users, REPORT_PROCEDURES.GetEmployeeFullActivity); // userId & labels
  reports = enterDefaultValueIntoSearchField(reports, "userId", userId, REPORT_PROCEDURES.GetEmployeeFullActivity); // w/ default userId to null
  reports = enterDefaultValueIntoSearchField(
    reports,
    "startDate",
    firstDayOfCurrentMonth.toISOString().substring(0, 10),
    REPORT_PROCEDURES.GetEmployeeFullActivity
  ); // w/ startDate
  reports = enterDefaultValueIntoSearchField(
    reports,
    "endDate",
    lastDayOfCurrentMonth.toISOString().substring(0, 10),
    REPORT_PROCEDURES.GetEmployeeFullActivity
  ); // w/ endDate

  /**
   * REPORT>>>
   * REPORT_PROCEDURES.GetEmployeeStatusChange
   */
  reports = enterOptionsValueIntoSearchField(reports, "userId", users, REPORT_PROCEDURES.GetEmployeeStatusChange); // userId & labels
  reports = enterDefaultValueIntoSearchField(reports, "userId", userId, REPORT_PROCEDURES.GetEmployeeStatusChange); // w/ default userId to null
  reports = enterDefaultValueIntoSearchField(
    reports,
    "currentDate",
    new Date().toISOString().substring(0, 10),
    REPORT_PROCEDURES.GetEmployeeStatusChange
  ); // w/ startDate
  reports = enterDefaultValueIntoSearchField(reports, "startDate", null, REPORT_PROCEDURES.GetEmployeeStatusChange); // w/ startDate
  reports = enterDefaultValueIntoSearchField(reports, "endDate", null, REPORT_PROCEDURES.GetEmployeeStatusChange); // w/ startDate

  /**
   * REPORT>>>
   * REPORT_PROCEDURES.GetEmployeeTasksSummary
   */
  reports = enterOptionsValueIntoSearchField(reports, "userId", users, REPORT_PROCEDURES.GetEmployeeTasksSummary); // userId & labels
  reports = enterDefaultValueIntoSearchField(reports, "userId", userId, REPORT_PROCEDURES.GetEmployeeTasksSummary); // w/ default userId to null
  reports = enterDefaultValueIntoSearchField(
    reports,
    "startDate",
    firstDayOfCurrentMonth.toISOString().substring(0, 10),
    REPORT_PROCEDURES.GetEmployeeTasksSummary
  ); // w/ startDate
  reports = enterDefaultValueIntoSearchField(
    reports,
    "endDate",
    lastDayOfCurrentMonth.toISOString().substring(0, 10),
    REPORT_PROCEDURES.GetEmployeeTasksSummary
  ); // w/ startDate
  //
  return reports;
}
