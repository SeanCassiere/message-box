export interface IWidgetFromApi {
  id: string;
  widgetType: string;
  widgetName: string;
  widgetScale: number;
  isWidgetTall: boolean;
  position: {
    x: number;
    y: number;
  };
  config: {
    [key: string]: any;
  };
}

export interface IParsedWidgetOnDashboard extends IWidgetFromApi {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
