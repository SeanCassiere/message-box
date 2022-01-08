import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";
import Role from "#root/db/entities/Role";
import EmailConfirmations from "#root/db/entities/EmailConfirmations";
import RoleMapping from "#root/db/entities/RoleMapping";

import { hashPassword } from "#root/util/hashPassword";
import { validateYupSchema } from "#root/util/validateYupSchema";
import { sendEmail } from "#root/email/sendEmail";
import { generateEmailConfirmationTemplate } from "#root/email/generateEmailConfirmationTemplate";
import Team from "#root/db/entities/Team";
import TeamMapping from "#root/db/entities/TeamMapping";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    host: yup.string().required("Host is required"),
    path: yup.string().required("Path is required"),
  }),
  body: yup.object().shape({
    email: yup.string().email("Must be a valid email").required("Email is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    password: yup.string().required("Password is required"),
  }),
});

export async function createUserForClient(req: Request, res: Response, next: NextFunction) {
  const { body, variables } = req.body;
  const { email, password, firstName, lastName } = body;
  const { clientId } = variables;

  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  try {
    const findExistingUser = await User.findOne({ where: { email: email.toLowerCase() } });

    if (findExistingUser) {
      return res.json({
        statusCode: 400,
        data: null,
        errors: [
          {
            field: "email",
            message: "Email is already in use.",
          },
        ],
      });
    }
  } catch (err) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something went wrong" }],
    });
  }

  try {
    const user = await User.create({
      clientId: clientId,
      email: email.toLowerCase(),
      password: await hashPassword(password),
      firstName: firstName,
      lastName: lastName,
    }).save();

    // find roles
    const employeeRole = await Role.findOneOrFail({ where: { clientId: clientId, rootName: "employee" } });
    await RoleMapping.create({ roleId: employeeRole.roleId, userId: user.userId }).save();

    // find company team
    const companyTeam = await Team.findOneOrFail({ where: { rootName: "company", clientId: clientId } });
    await TeamMapping.create({ userId: user.userId, teamId: companyTeam.teamId }).save();

    const confirmationEmail = await EmailConfirmations.create({
      userId: user.userId,
      type: "account_confirmation",
    }).save();
    await sendEmail({
      recipient: user.email,
      subject: "Confirm Account",
      html: generateEmailConfirmationTemplate({
        host: req.body.variables.host,
        path: req.body.variables.path,
        token: confirmationEmail.confirmationId,
      }),
    });

    return res.json({
      statusCode: 200,
      data: {
        userId: user.userId,
        email: user.email,
        roles: [employeeRole.roleId],
      },
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something went wrong" }],
    });
  }
}
