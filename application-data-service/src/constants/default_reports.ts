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
        defaultValue: "",
        options: [],
        mandatory: true,
        visible: false,
        hidden: true,
      },
      {
        fieldName: "startDate",
        fieldType: "form-date",
        defaultValue: "",
        options: [],
        mandatory: true,
        visible: true,
        hidden: false,
      },
      {
        fieldName: "endDate",
        fieldType: "form-date",
        defaultValue: "",
        options: [],
        mandatory: true,
        visible: true,
        hidden: false,
      },
      {
        fieldName: "userId",
        fieldType: "form-select",
        defaultValue: "",
        options: [],
        mandatory: false,
        visible: true,
        hidden: false,
      },
    ],
    reportFields: [
      {
        fieldName: "Field Name",
        fieldType: "text",
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

  const reports3 = enterDefaultValueIntoSearchField(reports2, "userId", "Select"); // w/ default userId

  return reports3;
}
