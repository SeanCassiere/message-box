import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import Client from "#root/db/entities/Client";

import { validateYupSchema } from "#root/util/validateYupSchema";
import { formatClientResponse } from "#root/util/formatResponses";

const validationSchema = yup.object().shape({
	variables: yup.object().shape({
		clientId: yup.string().required("Client ID is required"),
		userId: yup.string().required("User ID is required"),
	}),
});

export async function getClientById(req: Request, res: Response, next: NextFunction) {
	const checkErrors = await validateYupSchema(validationSchema, req.body);
	if (checkErrors && checkErrors.length > 0) {
		return res.json({
			statusCode: 400,
			data: null,
			errors: checkErrors,
		});
	}
	const { variables } = req.body;
	const { clientId } = variables;

	try {
		const findClient = await Client.findOne({ where: { clientId: clientId } });

		if (!findClient) {
			return res.json({
				statusCode: 400,
				data: null,
				errors: [
					{
						field: "client",
						message: `Cannot find the client for client id: ${clientId}`,
					},
				],
			});
		}

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
