import { Response, NextFunction } from "express";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import Role from "#root/db/entities/Role";
import { formatRoleResponse } from "#root/util/formatResponses";

export async function getAllRolesForClient(
	req: CustomRequest<{ clientId: string }>,
	res: Response,
	next: NextFunction
) {
	const { clientId } = req.body;

	try {
		const roles = await Role.find({ where: { clientId: clientId }, order: { createdAt: "ASC" } });
		const formattedRoles = roles.map((role) => {
			return formatRoleResponse({ role });
		});

		return res.json({
			statusCode: 200,
			data: [...formattedRoles],
			errors: [],
		});
	} catch (error) {
		return res.json({
			statusCode: 403,
			data: null,
			errors: [{ field: "service", message: "Something went wrong" }],
		});
	}
}
