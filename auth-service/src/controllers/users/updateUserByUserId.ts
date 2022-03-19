import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";

import User from "#root/db/entities/User";
import RoleMapping from "#root/db/entities/RoleMapping";
import Team from "#root/db/entities/Team";
import TeamMapping from "#root/db/entities/TeamMapping";
import Role from "#root/db/entities/Role";

import { formatUserResponseWithRoles } from "#root/utils/formatResponses";
import { returnStringsNotInOriginalArray } from "#root/utils/returnArray";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    userId: yup.string().required("UserId is required"),
    clientId: yup.string().required("ClientId is required"),
  }),
  body: yup.object().shape({
    email: yup.string().email("Must be a valid email").required("Email is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    roles: yup.array().of(yup.string().required("Role is required")),
    teams: yup.array().of(yup.string().required("Team is required")),
    isActive: yup.boolean().required("Status is required"),
  }),
});

export async function updateUserByUserId(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  try {
    const foundUser = await User.findOneOrFail({ where: { userId: req.body.variables.userId } });

    // change user details
    if (foundUser.email !== req.body.body.email) {
      const checkExistingUsername = await User.findOne({ where: { email: req.body.body.email } });
      if (checkExistingUsername) {
        return res.json({
          statusCode: 400,
          data: null,
          errors: [{ propertyPath: "email", message: "Email is already in use" }],
        });
      }
    }
    foundUser.email = req.body.body.email;
    foundUser.firstName = req.body.body.firstName;
    foundUser.lastName = req.body.body.lastName;
    foundUser.isActive = req.body.body.isActive;
    await foundUser.save();

    // change role information
    let rolesHaveChanged = false;
    const roleMappings = await RoleMapping.find({ where: { userId: req.body.variables.userId } });
    let foundRoles = roleMappings.map((roleMapping) => roleMapping.roleId);

    const rolesToAdd = returnStringsNotInOriginalArray(foundRoles, req.body.body.roles);
    for (const r of rolesToAdd) {
      rolesHaveChanged = true;

      const isTeamValid = await Role.findOne({ where: { roleId: r } });

      if (isTeamValid) {
        await RoleMapping.create({ roleId: r, userId: foundUser.userId }).save();
      }
    }

    const rolesToRemove = returnStringsNotInOriginalArray(req.body.body.roles, foundRoles);
    if (rolesToRemove.length > 0) {
      rolesHaveChanged = true;
      for (const roleId of rolesToRemove) {
        const findRoleMappingToDelete = await RoleMapping.findOne({ where: { roleId, userId: foundUser.userId } });
        if (findRoleMappingToDelete) {
          await findRoleMappingToDelete.remove();
        }
      }
    }

    if (rolesHaveChanged) {
      const freshRoleMappings = await RoleMapping.find({ where: { userId: req.body.variables.userId } });
      foundRoles = freshRoleMappings.map((roleMapping) => roleMapping.roleId);
    }

    // change team information
    let teamsHaveChanged = false;
    const teamMappings = await TeamMapping.find({ where: { userId: req.body.variables.userId } });
    let foundTeams = teamMappings.map((teamMapping) => teamMapping.teamId);

    const teamsToAdd = returnStringsNotInOriginalArray(foundTeams, req.body.body.teams);
    for (const tId of teamsToAdd) {
      teamsHaveChanged = true;

      const isTeamValid = await Team.findOne({ where: { teamId: tId } });

      if (isTeamValid) {
        await TeamMapping.create({ teamId: tId, userId: foundUser.userId }).save();
      }
    }

    const teamsToRemove = returnStringsNotInOriginalArray(req.body.body.teams, foundTeams);
    if (teamsToRemove.length > 0) {
      teamsHaveChanged = true;
      for (const teamId of teamsToRemove) {
        const findTeamMappingToDelete = await TeamMapping.findOne({ where: { teamId, userId: foundUser.userId } });
        if (findTeamMappingToDelete) {
          await findTeamMappingToDelete.remove();
        }
      }
    }

    if (teamsHaveChanged) {
      const freshTeamMappings = await TeamMapping.find({ where: { userId: req.body.variables.userId } });
      foundTeams = freshTeamMappings.map((teamMapping) => teamMapping.teamId);
    }

    await foundUser.reload();

    return res.json({
      statusCode: 200,
      data: formatUserResponseWithRoles({ user: foundUser, roles: foundRoles, teams: foundTeams }),
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ propertyPath: "service", message: "Something went wrong with the user updating method" }],
    });
  }
}
