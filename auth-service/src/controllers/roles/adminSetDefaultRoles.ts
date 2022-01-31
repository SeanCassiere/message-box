import { Request, Response, NextFunction } from "express";

import Client from "#root/db/entities/Client";
import Role from "#root/db/entities/Role";

import { DEFAULT_ROLES_ARRAY } from "#root/constants/default_roles";
import { returnStringsNotInOriginalArray } from "#root/util/returnArray";

export async function adminSetDefaultRoles(req: Request, res: Response, next: NextFunction) {
  try {
    const clients = await Client.find();

    for (const client of clients) {
      const id = client.clientId;
      const roles = await Role.find({ where: { clientId: id, isUserDeletable: false } });

      const savePromises = [];
      if (roles.length < DEFAULT_ROLES_ARRAY.length) {
        const rolesToAdd = returnStringsNotInOriginalArray(
          roles.map((role) => role.rootName),
          DEFAULT_ROLES_ARRAY.map((role) => role.rootName)
        );
        for (const roleRootName of rolesToAdd) {
          const newRoleContent = DEFAULT_ROLES_ARRAY.find((role) => role.rootName === roleRootName);
          if (newRoleContent) {
            savePromises.push(
              Role.create({
                clientId: id,
                viewName: newRoleContent.viewName,
                rootName: newRoleContent.rootName,
                permissions: newRoleContent.permissions,
                isUserDeletable: false,
              }).save()
            );
          }
        }
      }

      await Promise.all(savePromises);
    }

    return res.json({
      statusCode: 200,
      data: {
        success: true,
        message: "Successfully seeded all the default roles",
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
