export function addPathsForWidgets(widgets: any[]) {
  for (const widget of widgets) {
    if (widget.widgetType === "MyTasks" || widget.widgetType === "EmployeeTasks") {
      widget.path = "/Tasks";
    } else if (widget.widgetType === "MyTasksCompletion" || widget.widgetType === "EmployeeTasksCompletion") {
      widget.path = "/Dashboard/Statistics/EmployeeTaskCompletion";
    } else {
      widget.path = "/";
    }
  }
  return widgets;
}
