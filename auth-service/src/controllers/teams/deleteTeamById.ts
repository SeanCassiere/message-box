import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/util/validateYupSchema";
import Team from "#root/db/entities/Team";
import TeamMapping from "#root/db/entities/TeamMapping";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
    teamId: yup.string().required("TeamId is required"),
  }),
});

export async function deleteTeamById(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { teamId } = req.body.variables;

  try {
    const team = await Team.findOne({ where: { teamId: teamId } });

    if (!team) {
      return res.json({
        statusCode: 403,
        data: null,
        errors: [{ propertyPath: "teamId", message: "Team does not exist" }],
      });
    }

    if (!team.isUserDeletable) {
      return res.json({
        statusCode: 403,
        data: null,
        errors: [{ propertyPath: "teamId", message: "TEam is not user deletable" }],
      });
    }

    const teamMappings = await TeamMapping.find({ where: { teamId: teamId } });

    for (const teamMapping of teamMappings) {
      await teamMapping.remove();
    }

    await team.remove();

    return res.json({
      statusCode: 200,
      data: {
        success: true,
        message: "Team deleted successfully",
      },
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the team deleting method" }],
    });
  }
}
