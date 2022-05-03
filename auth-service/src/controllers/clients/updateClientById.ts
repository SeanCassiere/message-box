import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import Client from "#root/db/entities/Client";
import User from "#root/db/entities/User";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { formatClientResponse } from "#root/utils/formatResponses";
import { createActivityLog } from "#root/utils/createActivityLog";
import { log } from "#root/utils/logger";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("Client ID is required"),
    userId: yup.string().required("User ID is required"),
  }),
  body: yup.object().shape({
    clientName: yup.string().required("Company name is required"),
    adminUserId: yup.string().required("Admin user ID is required"),
  }),
});

export async function updateClientById(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }
  const { variables, body } = req.body;
  const { clientId } = variables;

  try {
    const findClient = await Client.findOne({ where: { clientId: clientId } });

    if (!findClient) {
      return res.json({
        statusCode: 400,
        data: null,
        errors: [
          {
            field: "clientId",
            message: `Cannot find the client for client id: ${clientId}`,
          },
        ],
      });
    }

    let adminUserId = body.adminUserId;

    if (adminUserId !== findClient.adminUserId) {
      const findUsersForClient = await User.find({ where: { clientId: clientId, isActive: true } });
      const findUser = findUsersForClient.find((user) => user.userId === body.adminUserId);

      if (!findUser) {
        {
          return res.json({
            statusCode: 400,
            data: null,
            errors: [
              {
                field: "adminUserId",
                message: `This user cannot be set as the company admin`,
              },
            ],
          });
        }
      }

      adminUserId = findUser.userId;
    }

    findClient.name = body.clientName;
    findClient.adminUserId = adminUserId;

    await findClient.save();
    await findClient.reload();

    createActivityLog({
      clientId: variables.clientId,
      userId: variables.userId,
      action: "company-profile-updated",
      description: `Updated the company profile:${findClient.clientId}`,
    }).then(() => {
      log.info(`Activity log created for userId: ${variables?.userId}`);
    });

    return res.json({
      statusCode: 200,
      data: formatClientResponse({ client: findClient }),
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something went wrong when trying to get the client profile" }],
    });
  }
}
