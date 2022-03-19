import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import Team from "#root/db/entities/Team";
import TeamMapping from "#root/db/entities/TeamMapping";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { formatTeamResponse } from "#root/utils/formatResponses";
import User from "#root/db/entities/User";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
  }),
  body: yup.object().shape({
    rootName: yup.string().required("Root name is required"),
    teamName: yup.string().required("Team view name is required"),
    members: yup.array().of(
      yup.object({
        userId: yup.string().required("UserId is required"),
        isLeader: yup.boolean(),
      })
    ),
  }),
});

export async function createTeamForClient(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { clientId } = req.body.variables;
  const { rootName, teamName, members } = req.body.body;

  try {
    const team = await Team.create({
      clientId: clientId,
      rootName: rootName.toLowerCase(),
      teamName: teamName,
    }).save();

    for (const member of members) {
      const user = await User.findOne({ where: { userId: member.userId, isActive: true } });

      if (user) {
        await TeamMapping.create({
          teamId: team.teamId,
          userId: member.userId,
          isATeamLeader: member.isLeader,
        }).save();
      }
    }

    const mappings = await TeamMapping.find({ where: { teamId: team.teamId } });

    const response = await formatTeamResponse({ team, members: mappings, resolveUsers: true });
    return res.json({
      statusCode: 200,
      data: response,
      errors: [],
    });
  } catch (err) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the team creation method" }],
    });
  }
}
