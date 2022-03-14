import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";
import Team from "#root/db/entities/Team";
import TeamMapping from "#root/db/entities/TeamMapping";

import { validateYupSchema } from "#root/util/validateYupSchema";
import { formatTeamResponse } from "#root/util/formatResponses";
import { returnStringsNotInOriginalArray } from "#root/util/returnArray";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    teamId: yup.string().required("TeamId is required"),
  }),
  body: yup.object().shape({
    rootName: yup.string().required("RootName is required"),
    teamName: yup.string().required("Team view name is required"),
    members: yup.array().of(
      yup.object({
        userId: yup.string().required("UserId is required"),
        isLeader: yup.boolean(),
      })
    ),
  }),
});

export async function updateTeamById(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { teamId } = req.body.variables;
  const { teamName, rootName, members } = req.body.body;

  try {
    const team = await Team.findOne({ where: { teamId: teamId } });

    if (!team) {
      return res.json({
        statusCode: 403,
        data: null,
        errors: [{ propertyPath: "teamId", message: "Team does not exist" }],
      });
    }

    team.teamName = teamName;
    team.rootName = rootName;
    await team.save();

    // change team mappings
    let teamsHaveChanged = false;
    const teamMappings = await TeamMapping.find({ where: { teamId: team.teamId } });
    let foundTeamMappings = teamMappings.map((teamMapping) => teamMapping.userId);

    const teamMappingsToRemove = returnStringsNotInOriginalArray(
      members.map((m: any) => m.userId),
      foundTeamMappings
    );
    for (const u_id of teamMappingsToRemove) {
      teamsHaveChanged = true;
      const findMapping = await TeamMapping.findOne({ where: { teamId: team.teamId, userId: u_id } });
      if (findMapping) {
        await findMapping.remove();
      }
    }

    for (const member of members) {
      const newMappingUser = await User.findOne({ where: { userId: member.userId, isActive: true } });
      if (newMappingUser) {
        const findMappingForMember = await TeamMapping.findOne({
          where: { teamId: team.teamId, userId: member.userId },
        });

        if (!findMappingForMember) {
          await TeamMapping.create({
            teamId: team.teamId,
            userId: member.userId,
            isATeamLeader: member.isLeader,
          }).save();
        } else {
          findMappingForMember.isATeamLeader = member.isLeader;
          findMappingForMember.save();
        }
      }
    }

    const mappings = await TeamMapping.find({ where: { teamId: teamId } });

    const response = await formatTeamResponse({ team, members: mappings });
    return res.json({
      statusCode: 200,
      data: response,
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the team updating method" }],
    });
  }
}
