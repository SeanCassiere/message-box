import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import Role from "#root/db/entities/Role";
import { validateYupSchema } from "#root/util/validateYupSchema";
import { formatRoleResponse } from "#root/util/formatResponses";

const validationSchema = yup.object().shape({
	variables: yup.object().shape({
		clientId: yup.string().required("ClientId is required"),
		userId: yup.string().required("UserId is required"),
		roleId: yup.string().required("RoleId is required"),
	}),
	body: yup.object().shape({
		viewName: yup.string().required("Role view name is required"),
	}),
});

export async function updateRoleById(req: Request, res: Response, next: NextFunction) {
	const checkErrors = await validateYupSchema(validationSchema, req.body);
	if (checkErrors && checkErrors.length > 0) {
		return res.json({
			statusCode: 400,
			data: null,
			errors: checkErrors,
		});
	}

	const { roleId } = req.body.variables;
	const { viewName } = req.body.body;

	try {
		const role = await Role.findOne({ where: { roleId: roleId } });

		if (!role) {
			return res.json({
				statusCode: 403,
				data: null,
				errors: [{ propertyPath: "roleId", message: "Role does not exist" }],
			});
		}

		role.viewName = viewName;
		await role.save();

		return res.json({
			statusCode: 200,
			data: formatRoleResponse({ role }),
			errors: [],
		});
	} catch (error) {
		return res.json({
			statusCode: 500,
			data: null,
			errors: [{ propertyPath: "service", message: "Something went wrong with the role updating method" }],
		});
	}
}
