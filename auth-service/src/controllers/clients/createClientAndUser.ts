import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";
import Client from "#root/db/entities/Client";
import Role from "#root/db/entities/Role";
import RoleMapping from "#root/db/entities/RoleMapping";
import EmailConfirmations from "#root/db/entities/EmailConfirmations";
import Team from "#root/db/entities/Team";
import TeamMapping from "#root/db/entities/TeamMapping";

import { hashPassword } from "#root/util/hashPassword";
import { validateYupSchema } from "#root/util/validateYupSchema";
import { formatClientResponse } from "#root/util/formatResponses";
import { sendEmail } from "#root/email/sendEmail";
import { generateEmailConfirmationTemplate } from "#root/email/generateEmailConfirmationTemplate";
import { DEFAULT_PERMISSIONS_MAP } from "#root/constants/default_permissions";
import { DEFAULT_ROLES_ARRAY } from "#root/constants/default_roles";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    host: yup.string().required("Host is required"),
    path: yup.string().required("Path is required"),
  }),
  body: yup.object().shape({
    client: yup.object().shape({
      clientName: yup.string().required("Company name is required"),
    }),
    user: yup.object().shape({
      email: yup.string().email("Must be a valid email").required("Username is required"),
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().required("Last name is required"),
      password: yup.string().required("Password is required"),
    }),
  }),
});

export async function createClientAndUser(req: Request, res: Response, next: NextFunction) {
  const { user, client } = req.body.body;

  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { email, password, firstName, lastName } = user;
  const { clientName } = client;

  const findExistingUser = await User.findOne({ where: { email: email.toLowerCase() } });

  if (findExistingUser) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: [
        {
          field: "email",
          message: "Username is already in use.",
        },
      ],
    });
  }

  try {
    // creat the client
    const newClient = await Client.create({
      name: clientName,
    }).save();

    const rolePromises = [];
    // add the default roles
    for (const role of DEFAULT_ROLES_ARRAY) {
      rolePromises.push(
        Role.create({
          clientId: newClient.clientId,
          viewName: role.viewName,
          rootName: role.rootName,
          permissions: role.permissions,
          isUserDeletable: false,
        }).save()
      );
    }

    await Promise.all(rolePromises);

    // create the admin user account
    const adminUser = await User.create({
      clientId: newClient.clientId,
      email: email.toLowerCase(),
      password: await hashPassword(password),
      firstName: firstName,
      lastName: lastName,
    }).save();

    const adminRole = await Role.findOne({ where: { clientId: newClient.clientId, rootName: "admin" } });
    const employeeRole = await Role.findOne({ where: { clientId: newClient.clientId, rootName: "employee" } });

    if (adminRole && employeeRole) {
      // create role mappings for Admin and Employee
      await RoleMapping.create({
        roleId: adminRole.roleId,
        userId: adminUser.userId,
      }).save();
      await RoleMapping.create({
        roleId: employeeRole.roleId,
        userId: adminUser.userId,
      }).save();
    }

    // create the default teams
    const companyTeam = await Team.create({
      rootName: "company",
      teamName: "Company",
      clientId: newClient.clientId,
      isUserDeletable: false,
    }).save();

    // create the team mappings
    await TeamMapping.create({ userId: adminUser.userId, teamId: companyTeam.teamId }).save();

    // save the admin user to the client profile
    newClient.adminUserId = adminUser.userId;
    await newClient.save();

    const emailConfirmation = await EmailConfirmations.create({
      userId: adminUser.userId,
      type: "account_confirmation",
    }).save();
    await sendEmail({
      recipient: adminUser.email,
      html: generateEmailConfirmationTemplate({
        host: req.body.variables.host,
        path: req.body.variables.path,
        token: emailConfirmation.confirmationId,
      }),
      subject: "Confirm your account",
    });

    return res.json({
      statusCode: 200,
      data: formatClientResponse({ client: newClient }),
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something went wrong with creating a new client and user" }],
    });
  }
}
