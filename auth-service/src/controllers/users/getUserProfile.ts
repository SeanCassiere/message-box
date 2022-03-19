import { Response, NextFunction } from "express";

import RoleMapping from "#root/db/entities/RoleMapping";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { formatUserResponseWithRoles } from "#root/utils/formatResponses";
import TeamMapping from "#root/db/entities/TeamMapping";

export async function getUserProfile(req: CustomRequest<{}>, res: Response, next: NextFunction) {
  const user = req.user;

  try {
    if (user) {
      const roleMappings = await RoleMapping.find({ where: { userId: req.user?.userId } });
      const teamMappings = await TeamMapping.find({ where: { userId: req.user?.userId } });

      const roles = roleMappings.map((roleMapping) => roleMapping.roleId);
      const teams = teamMappings.map((teamMapping) => teamMapping.teamId);

      return res.json({
        statusCode: 200,
        data: formatUserResponseWithRoles({ user, roles, teams }),
        errors: [],
      });
    }

    return res.json({
      statusCode: 200,
      data: null,
      errors: [
        {
          field: "user",
          message: "user is not found",
        },
      ],
    });
  } catch (err) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something went wrong with the profile method" }],
    });
  }
}
