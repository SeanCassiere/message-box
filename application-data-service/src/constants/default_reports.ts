import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { log } from "#root/utils/logger";
import axios from "axios";

export const REPORT_PROCEDURES = {
  GetEmployeeLoginReportForClient: "GetEmployeeLoginReportForClient",
};

const DEFAULT_REPORTS = [
  {
    reportId: "1",
    reportName: "Employee Login Report",
    procedureName: REPORT_PROCEDURES.GetEmployeeLoginReportForClient,
    searchFields: [
      {
        fieldName: "clientId",
        fieldType: "form-text",
        label: "Client ID",
        defaultValue: "",
        options: [],
        mandatory: true,
        visible: false,
        hidden: true,
      },
      {
        fieldName: "userId",
        fieldType: "form-select",
        defaultValue: "",
        label: "Employee",
        options: [],
        mandatory: false,
        visible: true,
        hidden: false,
      },
      {
        fieldName: "startDate",
        fieldType: "form-date",
        defaultValue: "",
        label: "Start Date",
        options: [],
        mandatory: true,
        visible: true,
        hidden: false,
      },
      {
        fieldName: "endDate",
        fieldType: "form-date",
        defaultValue: "",
        label: "End Date",
        options: [],
        mandatory: true,
        visible: true,
        hidden: false,
      },
    ],
    reportFields: [
      {
        fieldName: "name",
        fieldType: "text",
        label: "Employee",
        visible: true,
      },
      {
        fieldName: "action",
        fieldType: "text",
        label: "Action",
        visible: true,
      },
      {
        fieldName: "timestamp",
        fieldType: "date-time",
        label: "Timestamp",
        visible: true,
      },
    ],
  },
];

function enterDefaultValueIntoSearchField(reports: typeof DEFAULT_REPORTS, fieldName: string, fieldValue: any) {
  const allReports = reports;
  const reportReports: typeof DEFAULT_REPORTS = [];

  for (const report of allReports) {
    for (const searchField of report.searchFields) {
      if (searchField.fieldName === fieldName) {
        searchField.defaultValue = fieldValue;
      }
    }
    reportReports.push(report);
  }

  return reportReports;
}

function enterOptionsValueIntoSearchField(reports: typeof DEFAULT_REPORTS, fieldName: string, fieldValue: any) {
  const allReports = reports;
  const reportReports: typeof DEFAULT_REPORTS = [];

  for (const report of allReports) {
    for (const searchField of report.searchFields) {
      if (searchField.fieldName === fieldName) {
        searchField.options = fieldValue;
      }
    }
    reportReports.push(report);
  }

  return reportReports;
}

export async function resolveReportsListForClient({ clientId }: { clientId: string }) {
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  let users: any[] = [];
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
      `POST /reports/resolveReportsListForClient -> ${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient\ncould not fetch the user ids for this client\n${error}`
    );
  }

  const reports1 = enterDefaultValueIntoSearchField(DEFAULT_REPORTS, "clientId", clientId); // w/ clientId
  const reports2 = enterOptionsValueIntoSearchField(reports1, "userId", users); // w/ userIds
  const reports3 = enterDefaultValueIntoSearchField(reports2, "userId", null); // w/ default userId to null
  const reports4 = enterDefaultValueIntoSearchField(reports3, "startDate", firstDay.toISOString().substring(0, 10)); // w/ startDate
  const reports5 = enterDefaultValueIntoSearchField(reports4, "endDate", lastDay.toISOString().substring(0, 10)); // w/ endDate

  return reports5;
}
