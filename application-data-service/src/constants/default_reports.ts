import { AUTH_SERVICE_URI } from "#root/utils/constants";
import { log } from "#root/utils/logger";
import axios from "axios";

const DEFAULT_REPORTS = [
  {
    reportId: "1",
    reportName: "Report 1",
    procedureName: "demoGetReportsForClient",
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
        fieldName: "name",
        fieldType: "form-text",
        defaultValue: "",
        label: "Name",
        options: [],
        mandatory: true,
        visible: true,
        hidden: false,
      },
      {
        fieldName: "userId",
        fieldType: "form-select",
        defaultValue: "",
        label: "Users",
        options: [],
        mandatory: true,
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
        fieldName: "startDate",
        fieldType: "text",
        label: "Start Date",
        visible: true,
      },
    ],
  },
  {
    reportId: "2",
    reportName: "Report 2",
    procedureName: "demoGetReportsForClient2",
    searchFields: [
      {
        fieldName: "clientId",
        fieldType: "form-text",
        defaultValue: "",
        label: "Client ID",
        options: [],
        mandatory: true,
        visible: false,
        hidden: true,
      },
      {
        fieldName: "name",
        fieldType: "form-text",
        defaultValue: "",
        label: "Name",
        options: [],
        mandatory: true,
        visible: true,
        hidden: false,
      },
      {
        fieldName: "currentDate",
        fieldType: "form-date",
        defaultValue: "",
        label: "Current Date",
        options: [],
        mandatory: false,
        visible: true,
        hidden: false,
      },
      {
        fieldName: "userId",
        fieldType: "form-select",
        defaultValue: "",
        label: "User",
        options: [],
        mandatory: false,
        visible: true,
        hidden: false,
      },
    ],
    reportFields: [
      {
        fieldName: "startDate",
        fieldType: "text",
        label: "Start Date",
        visible: true,
      },
      {
        fieldName: "endDate",
        fieldType: "text",
        label: "End Date",
        visible: true,
      },
    ],
  },
  {
    reportId: "3",
    reportName: "Employee Login Report",
    procedureName: "GetEmployeeLoginReportForClient",
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
        label: "Users",
        options: [],
        mandatory: true,
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
        fieldName: "activityAction",
        fieldType: "text",
        label: "Action",
        visible: true,
      },
      {
        fieldName: "dateTime",
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
      `POST /clients/createCalendarEventForUser -> ${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient\ncould not fetch the user ids for this client\n${error}`
    );
  }

  const reports1 = enterDefaultValueIntoSearchField(DEFAULT_REPORTS, "clientId", clientId); // w/ clientId

  const reports2 = enterOptionsValueIntoSearchField(reports1, "userId", users); // w/ userIds

  const reports3 = enterDefaultValueIntoSearchField(reports2, "userId", null); // w/ default userId to null

  return reports3;
}
