import { JwtAuthDetails } from "#root/interfaces/Express.interfaces";

const widgetOptions = [
  {
    key: "widget-1",
    requires: ["task:read"],
    clientType: "web-client",
    widgetType: "MyTasks",
    typeDisplayName: "My Tasks",
    scaleOptions: [4, 6],
    heightOptions: [2, 3],
    mandatoryConfigOptions: [{ parameter: "for", clientFill: "task-for-time-periods", displayName: "For" }],
    mandatoryVariableOptions: [{ parameter: "currentDate", mode: "date-today" }],
  },
  {
    key: "widget-2",
    requires: ["task:read"],
    clientType: "web-client",
    widgetType: "MyTasksCompletion",
    typeDisplayName: "My Task Completion",
    scaleOptions: [3, 4],
    heightOptions: [2, 3],
    mandatoryConfigOptions: [
      { parameter: "timePeriod", clientFill: "task-completion-time-periods", displayName: "For this" },
    ],
    mandatoryVariableOptions: [{ parameter: "currentDate", mode: "date-today" }],
  },
  {
    key: "widget-3",
    requires: ["task:admin"],
    clientType: "web-client",
    widgetType: "EmployeeTasks",
    typeDisplayName: "Employee's Tasks",
    scaleOptions: [4, 6],
    heightOptions: [2, 3],
    mandatoryConfigOptions: [
      { parameter: "ownerId", clientFill: "system-users", displayName: "Employee" },
      { parameter: "for", clientFill: "task-for-time-periods", displayName: "For" },
    ],
    mandatoryVariableOptions: [{ parameter: "currentDate", mode: "date-today" }],
  },
  {
    key: "widget-4",
    requires: ["task:admin"],
    clientType: "web-client",
    widgetType: "EmployeeTasksCompletion",
    typeDisplayName: "Employee Task Completion",
    scaleOptions: [3, 4],
    heightOptions: [2, 3],
    mandatoryConfigOptions: [
      { parameter: "userId", clientFill: "system-users", displayName: "Employee" },
      { parameter: "timePeriod", clientFill: "task-completion-time-periods", displayName: "For this" },
    ],
    mandatoryVariableOptions: [{ parameter: "currentDate", mode: "date-today" }],
  },
];

export function getConfigurableWidgetsForUser(auth: JwtAuthDetails, clientType: string) {
  let widgets: typeof widgetOptions = [];

  for (const permissionValue of auth.permissions) {
    widgets = [...widgets, ...widgetOptions.filter((w) => w.requires.includes(permissionValue))];
  }
  widgets = widgets.filter((w) => w.clientType === clientType);

  //
  widgets = widgets.filter((widget, index, self) => self.findIndex((w) => w.key === widget.key) === index);
  widgets = widgets.sort((a, b) => {
    if (a.key < b.key) {
      return -1;
    }
    if (a.key > b.key) {
      return 1;
    }
    return 0;
  });
  const removeUnnecessaryConfigOptions = widgets.map(({ key, requires, clientType, ...rest }) => ({ ...rest }));
  const alphabeticallySorted = removeUnnecessaryConfigOptions.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
  return alphabeticallySorted;
}
