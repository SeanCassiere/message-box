export function addPathsForWidgets(widgets: any[]) {
  for (const widget of widgets) {
    if (widget.widgetType === "MyTasks" || widget.widgetType === "EmployeeTasks") {
      widget.path = "/Tasks";
    } else {
      widget.path = "/";
    }
  }
  return widgets;
}
