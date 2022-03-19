import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import Role from "#root/db/entities/Role";
import { validateYupSchema } from "#root/utils/validateYupSchema";
import RoleMapping from "#root/db/entities/RoleMapping";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    roleId: yup.string().required("RoleId is required"),
  }),
});

export async function deleteRoleById(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { roleId } = req.body.variables;

  try {
    const role = await Role.findOne({ where: { roleId: roleId } });

    if (!role) {
      return res.json({
        statusCode: 403,
        data: null,
        errors: [{ propertyPath: "roleId", message: "Role does not exist" }],
      });
    }

    if (!role.isUserDeletable) {
      return res.json({
        statusCode: 403,
        data: null,
        errors: [{ propertyPath: "roleId", message: "Role is not user deletable" }],
      });
    }

    const roleMappings = await RoleMapping.find({ where: { roleId: roleId } });

    for (const roleMapping of roleMappings) {
      await roleMapping.remove();
    }

    await role.remove();

    return res.json({
      statusCode: 200,
      data: {
        success: true,
        message: "Role deleted successfully",
      },
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the role deleting method" }],
    });
  }
}
