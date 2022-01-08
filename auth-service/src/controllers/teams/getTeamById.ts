import { Response, NextFunction } from "express";

import Team from "#root/db/entities/Team";
import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { formatTeamResponse } from "#root/util/formatResponses";

export async function getTeamById(req: CustomRequest<{ teamId: string }>, res: Response, next: NextFunction) {
  const { teamId } = req.body;

  try {
    const team = await Team.findOneOrFail({ where: { teamId: teamId } });

    return res.json({
      statusCode: 200,
      data: formatTeamResponse({ team }),
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 403,
      data: null,
      errors: [
        {
          field: "role",
          message: "Team does not exist",
        },
      ],
    });
  }
}
