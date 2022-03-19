import { Response, NextFunction } from "express";

import User from "#root/db/entities/User";
import RoleMapping from "#root/db/entities/RoleMapping";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { formatUserResponseWithRoles } from "#root/utils/formatResponses";
import TeamMapping from "#root/db/entities/TeamMapping";

export async function getAllUsers(req: CustomRequest<{ clientId: string }>, res: Response, next: NextFunction) {
  try {
    const foundUsers = await User.find({
      where: { clientId: req.body.clientId },
      // select: ["userId", "email", "firstName", "lastName", "updatedAt"],
      order: { createdAt: "DESC" },
    });

    const returnUsers = [];
    for (const user of foundUsers) {
      const userRoles = await RoleMapping.find({ where: { userId: user.userId } });
      const userTeams = await TeamMapping.find({ where: { userId: user.userId } });
      returnUsers.push(
        formatUserResponseWithRoles({
          user,
          roles: userRoles.map((role) => role.roleId),
          teams: userTeams.map((team) => team.teamId),
        })
      );
    }

    return res.json({
      statusCode: 200,
      data: [...returnUsers],
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something went wrong" }],
    });
  }
}
