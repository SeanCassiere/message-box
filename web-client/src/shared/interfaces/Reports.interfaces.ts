export interface IReportSchema {
  reportId: string;
  reportName: string;
  procedureName: string;
  searchFields: IReportSearchFieldSchema[];
  reportFields: IReportColumnFieldSchema[];
}

export interface IReportSearchFieldSchema {
  fieldName: string;
  label: string;
  fieldType: string;
  defaultValue: string | null;
  options: {
    value: string;
    label: string;
  }[];
  mandatory: boolean;
  visible: boolean;
  hidden: boolean;
}

export interface IReportColumnFieldSchema {
  fieldName: string;
  label: string;
  fieldType: string;
  visible: boolean;
}
