import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import Role from "#root/db/entities/Role";
import { validateYupSchema } from "#root/utils/validateYupSchema";
import { formatRoleResponse } from "#root/utils/formatResponses";
import { ALL_AVAILABLE_ROLE_PERMISSIONS } from "#root/constants/allPermissions";
import { createActivityLog } from "#root/utils/createActivityLog";
import { log } from "#root/utils/logger";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    rootName: yup.string().required("Root name is required"),
    viewName: yup.string().required("Role view name is required"),
    permissions: yup.array().of(yup.string().required("Role permissions are required")),
  }),
});

export async function createRoleForClient(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { clientId, userId } = req.body.variables;
  const { rootName, viewName, permissions } = req.body.body;

  try {
    const findExistingName = await Role.findOne({ where: { clientId: clientId, viewName: viewName } });
    if (findExistingName) {
      return res.json({
        statusCode: 400,
        data: null,
        errors: [
          {
            propertyPath: "viewName",
            message: "Role with this name already exists",
          },
        ],
      });
    }
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the role creation method" }],
    });
  }

  try {
    let saveablePermissions: string[] = [];

    for (const reqPerm of permissions) {
      const mapDown = ALL_AVAILABLE_ROLE_PERMISSIONS.map((item) => item.key);
      if (mapDown.includes(reqPerm)) {
        saveablePermissions.push(reqPerm);
      }
    }
    const role = await Role.create({
      clientId: clientId,
      rootName: rootName.toLowerCase(),
      viewName: viewName,
      permissions: saveablePermissions,
    }).save();

    createActivityLog({
      clientId: clientId,
      userId: userId,
      action: "update-role",
      description: `Updated access role ${role.viewName}:${role.roleId}`,
    }).then(() => {
      log.info(`Activity log created for user ${userId}`);
    });

    return res.json({
      statusCode: 200,
      data: formatRoleResponse({ role }),
      errors: [],
    });
  } catch (err) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the role creation method" }],
    });
  }
}
