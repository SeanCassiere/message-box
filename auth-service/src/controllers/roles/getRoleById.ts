import { Response, NextFunction } from "express";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import Role from "#root/db/entities/Role";
import { formatRoleResponse } from "#root/util/formatResponses";

export async function getRoleById(req: CustomRequest<{ roleId: string }>, res: Response, next: NextFunction) {
	const { roleId } = req.body;

	try {
		const role = await Role.findOneOrFail({ where: { roleId: roleId } });

		return res.json({
			statusCode: 200,
			data: formatRoleResponse({ role }),
			errors: [],
		});
	} catch (error) {
		return res.json({
			statusCode: 403,
			data: null,
			errors: [
				{
					field: "role",
					message: "Role does not exist",
				},
			],
		});
	}
}
