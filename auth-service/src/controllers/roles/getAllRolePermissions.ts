import { Response, NextFunction, Request } from "express";

import { ALL_AVAILABLE_ROLE_PERMISSIONS } from "#root/util/permissions";

export async function getAllRolePermissions(req: Request, res: Response, next: NextFunction) {
  const sortedPermissions = ALL_AVAILABLE_ROLE_PERMISSIONS.sort((a, b) => a.id - b.id);
  const keyOnlyArray = sortedPermissions.map((permission) => permission.key);
  return res.json({
    statusCode: 200,
    data: [...keyOnlyArray],
    errors: [],
  });
}
