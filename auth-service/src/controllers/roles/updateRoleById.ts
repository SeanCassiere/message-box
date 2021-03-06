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
    roleId: yup.string().required("RoleId is required"),
  }),
  body: yup.object().shape({
    viewName: yup.string().required("Role view name is required"),
    permissions: yup.array().of(yup.string().required("Role permissions are required")),
  }),
});

export async function updateRoleById(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { roleId, ...otherVariables } = req.body.variables;
  const { viewName, permissions } = req.body.body;

  try {
    const role = await Role.findOne({ where: { roleId: roleId } });

    if (!role) {
      return res.json({
        statusCode: 403,
        data: null,
        errors: [{ propertyPath: "roleId", message: "Role does not exist" }],
      });
    }

    role.viewName = viewName;
    let saveablePermissions = [];
    for (const reqPerm of permissions) {
      const mapDown = ALL_AVAILABLE_ROLE_PERMISSIONS.map((item) => item.key);
      if (mapDown.includes(reqPerm)) {
        saveablePermissions.push(reqPerm);
      }
    }
    role.permissions = saveablePermissions;

    await role.save();

    createActivityLog({
      clientId: otherVariables?.clientId,
      userId: otherVariables?.userId,
      action: "update-role",
      description: `Updated access role ${role.viewName}:${role.roleId}`,
    }).then(() => {
      log.info(`Activity log created for user ${otherVariables?.userId}`);
    });

    return res.json({
      statusCode: 200,
      data: formatRoleResponse({ role }),
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the role updating method" }],
    });
  }
}
