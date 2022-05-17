export interface IWidgetOnDashboard {
  id: string;
  widgetType: string;
  widgetName: string;
  widgetScale: number;
  widgetPosition: number;
  isWidgetTall: boolean;
  config: {
    [key: string]: any;
  };
}
