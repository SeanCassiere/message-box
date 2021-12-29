import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import Team from "#root/db/entities/Team";
import { validateYupSchema } from "#root/util/validateYupSchema";
import { formatTeamResponse } from "#root/util/formatResponses";

const validationSchema = yup.object().shape({
	variables: yup.object().shape({
		clientId: yup.string().required("ClientId is required"),
	}),
	body: yup.object().shape({
		rootName: yup.string().required("Root name is required"),
		teamName: yup.string().required("Team view name is required"),
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
	const { rootName, teamName } = req.body.body;

	try {
		const team = await Team.create({
			clientId: clientId,
			rootName: rootName.toLowerCase(),
			teamName: teamName,
		}).save();

		return res.json({
			statusCode: 200,
			data: formatTeamResponse({ team }),
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
