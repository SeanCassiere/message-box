import { JwtAuthDetails } from "#root/interfaces/Express.interfaces";

const widgetOptions = [
  {
    key: "widget-1",
    requires: ["task:read"],
    clientType: "web-client",
    widgetType: "MyTasks",
    typeDisplayName: "My Tasks",
    scaleOptions: [4, 6],
    canWidgetBeTall: true,
    mandatoryConfigOptions: [{ parameter: "for", value: null, clientFill: "task-for-time-periods" }],
    mandatoryVariableOptions: [{ parameter: "currentDate", mode: "date-today" }],
  },
  {
    key: "widget-2",
    requires: ["task:admin"],
    clientType: "web-client",
    widgetType: "EmployeeTasks",
    typeDisplayName: "Employee Tasks",
    scaleOptions: [4, 6],
    canWidgetBeTall: true,
    mandatoryConfigOptions: [
      { parameter: "for", value: null, clientFill: "task-for-time-periods" },
      { parameter: "ownerId", value: null, clientFill: "system-users" },
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
