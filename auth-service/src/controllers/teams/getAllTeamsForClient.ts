import { Response, NextFunction } from "express";

import Team from "#root/db/entities/Team";
import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { formatTeamResponse } from "#root/util/formatResponses";

export async function getAllTeamsForClient(
  req: CustomRequest<{ clientId: string }>,
  res: Response,
  next: NextFunction
) {
  const { clientId } = req.body;

  try {
    const teams = await Team.find({ where: { clientId: clientId }, order: { createdAt: "ASC" } });
    const formattedTeams = teams.map((team) => {
      return formatTeamResponse({ team });
    });

    return res.json({
      statusCode: 200,
      data: [...formattedTeams],
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 403,
      data: null,
      errors: [{ field: "service", message: "Something went wrong" }],
    });
  }
}
