import { DEFAULT_PERMISSIONS_MAP } from "./default_permissions";

export const DEFAULT_ROLES_ARRAY: { viewName: string; rootName: string; permissions: string[] }[] = [
  {
    viewName: "Basic",
    rootName: "employee",
    permissions: DEFAULT_PERMISSIONS_MAP.employee,
  },
  {
    viewName: "Administrator",
    rootName: "admin",
    permissions: DEFAULT_PERMISSIONS_MAP.admin,
  },
  {
    viewName: "Human Resources",
    rootName: "hr",
    permissions: DEFAULT_PERMISSIONS_MAP.hr,
  },
  {
    viewName: "Manager",
    rootName: "manager",
    permissions: DEFAULT_PERMISSIONS_MAP.manager,
  },
  {
    viewName: "Employee",
    rootName: "basic_access_user",
    permissions: DEFAULT_PERMISSIONS_MAP.basic_access_user,
  },
];
