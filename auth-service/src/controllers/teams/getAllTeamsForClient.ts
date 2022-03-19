import { Response, NextFunction } from "express";

import Team from "#root/db/entities/Team";
import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { formatTeamResponse } from "#root/utils/formatResponses";
import TeamMapping from "#root/db/entities/TeamMapping";

export async function getAllTeamsForClient(req: CustomRequest<{ clientId: string }>, res: Response) {
  const { clientId } = req.body;

  let foundTeams = [];

  try {
    const teams = await Team.find({ where: { clientId: clientId }, order: { createdAt: "ASC" } });

    foundTeams = teams;
  } catch (error) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: [{ field: "service", message: "Something went wrong fetching the teams" }],
    });
  }

  try {
    const formattedTeams = [];

    for (const team of foundTeams) {
      const mapping = await TeamMapping.find({ where: { teamId: team.teamId } });
      const fullTeam = await formatTeamResponse({ team, members: mapping });
      formattedTeams.push(fullTeam);
    }

    return res.json({
      statusCode: 200,
      data: [...formattedTeams],
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: [{ field: "service", message: "Something went wrong fetching the team mappings" }],
    });
  }
}
