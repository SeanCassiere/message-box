import { Response, NextFunction } from "express";

import TeamMapping from "#root/db/entities/TeamMapping";

import { CustomRequest } from "#root/interfaces/Express.interfaces";

export async function getUserIdsForTeamId(req: CustomRequest<{ teamId: string }>, res: Response, next: NextFunction) {
  const { teamId } = req.body;

  try {
    const mappings = await TeamMapping.find({ where: { teamId: teamId } });

    return res.json({
      statusCode: 200,
      data: mappings.map((mapping) => mapping.userId),
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: [
        {
          field: "teamId",
          message: "Team does not exist",
        },
      ],
    });
  }
}
