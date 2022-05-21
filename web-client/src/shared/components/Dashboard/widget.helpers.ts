import { VariableConfigDTO } from "../../interfaces/Dashboard.interfaces";

export function parseDynamicParameters(dynamicParamDto: VariableConfigDTO) {
  let value = "";

  switch (dynamicParamDto.mode) {
    case "date-today":
      value = new Date().toISOString().slice(0, 10);
      break;
    default:
      value = "";
      break;
  }

  return {
    parameter: dynamicParamDto.parameter,
    value,
  };
}
