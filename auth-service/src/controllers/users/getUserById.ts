import { Response, NextFunction } from "express";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { formatUserResponseWithRoles } from "#root/util/formatResponses";

import User from "#root/db/entities/User";
import RoleMapping from "#root/db/entities/RoleMapping";
import TeamMapping from "#root/db/entities/TeamMapping";

export async function getUserById(req: CustomRequest<{}>, res: Response, next: NextFunction) {
	const { id } = req.params;

	try {
		const user = await User.findOneOrFail({ where: { userId: id } });
		const roleMappings = await RoleMapping.find({ where: { userId: id } });
		const teamMappings = await TeamMapping.find({ where: { userId: id } });

		const roles = roleMappings.map((roleMapping) => roleMapping.roleId);
		const teams = teamMappings.map((teamMapping) => teamMapping.teamId);

		return res.json({
			statusCode: 200,
			data: formatUserResponseWithRoles({ user, roles, teams }),
			errors: [],
		});
	} catch (error) {
		return res.json({
			statusCode: 403,
			data: null,
			errors: [
				{
					field: "user",
					message: "User does not exist",
				},
			],
		});
	}
}
