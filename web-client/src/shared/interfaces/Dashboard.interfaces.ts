type WidgetCoordinates = {
  x: number;
  y: number;
};

export type VariableConfigDTO = {
  parameter: string;
  mode: string;
};

interface IWidgetSchema {
  widgetType: string;
  widgetName: string;
  widgetScale: number;
  widgetHeight: number;
  position: WidgetCoordinates;
  config: {
    parameter: string;
    value: string;
  }[];
  variableOptions: VariableConfigDTO[];
}

export interface IWidgetFromApi extends IWidgetSchema {
  id: string;
  path: string;
}

export interface IParsedWidgetOnDashboard extends IWidgetFromApi {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface IWidgetCreatorOptionFromApi {
  widgetType: string;
  typeDisplayName: string;
  scaleOptions: number[];
  heightOptions: number[];
  mandatoryConfigOptions: {
    parameter: string;
    displayName: string;
    clientFill: string;
  }[];
  mandatoryVariableOptions: VariableConfigDTO[];
}

export interface IWidgetCreatorDTO extends IWidgetSchema {}
