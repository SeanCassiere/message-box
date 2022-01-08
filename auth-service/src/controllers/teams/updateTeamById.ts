import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import Team from "#root/db/entities/Team";
import { validateYupSchema } from "#root/util/validateYupSchema";
import { formatTeamResponse } from "#root/util/formatResponses";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    teamId: yup.string().required("TeamId is required"),
  }),
  body: yup.object().shape({
    rootName: yup.string().required("RootName is required"),
    teamName: yup.string().required("Team view name is required"),
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
  const { teamName, rootName } = req.body.body;

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

    return res.json({
      statusCode: 200,
      data: formatTeamResponse({ team }),
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
