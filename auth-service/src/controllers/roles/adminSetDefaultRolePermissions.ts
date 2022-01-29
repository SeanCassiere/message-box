import { Request, Response, NextFunction } from "express";

import Role from "#root/db/entities/Role";

import { DEFAULT_PERMISSIONS_MAP } from "#root/constants/default_permissions";

export async function adminSetDefaultRolePermissions(req: Request, res: Response, next: NextFunction) {
  try {
    const allDefaultRoles = await Role.find({ where: { isActive: true, isUserDeletable: false } });

    const savePromises = [];
    for (const role of allDefaultRoles) {
      if (DEFAULT_PERMISSIONS_MAP[role.rootName]) {
        role.permissions = DEFAULT_PERMISSIONS_MAP[role.rootName];
        savePromises.push(role.save());
      }
    }

    await Promise.all(savePromises);

    return res.json({
      statusCode: 200,
      data: {
        success: true,
        message: "Successfully updated default roles",
      },
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the admin role seeding method" }],
    });
  }
}
