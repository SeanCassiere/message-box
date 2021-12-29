import { Response, NextFunction } from "express";
import { nanoid } from "nanoid";

import User from "#root/db/entities/User";
import RoleMapping from "#root/db/entities/RoleMapping";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import TeamMapping from "#root/db/entities/TeamMapping";

export async function deleteUserById(req: CustomRequest<{ userId: string }>, res: Response, next: NextFunction) {
	const { userId } = req.body;

	if (!userId || userId === "") {
		return res.json({
			statusCode: 403,
			data: null,
			errors: [
				{
					propertyPath: "userId",
					message: "UserId is required",
				},
			],
		});
	}

	try {
		const user = await User.findOne({ where: { userId: userId } });

		if (!user) {
			return res.json({
				statusCode: 403,
				data: null,
				errors: [
					{
						propertyPath: "userId",
						message: "UserId is not valid",
					},
				],
			});
		}

		// Soft delete
		if (user.isActive) {
			user.email = "DELETE" + "=" + nanoid(5) + "=" + user.email;
			user.isActive = false;
			await user.save();
		} else {
			// Hard delete of the user
			// remove any role mappings
			const existingRoles = await RoleMapping.find({ where: { userId: user.userId } });
			for (const role of existingRoles) {
				await role.remove();
			}

			// remove any team mappings
			const existingTeams = await TeamMapping.find({ where: { userId: user.userId } });
			for (const team of existingTeams) {
				await team.remove();
			}

			await user.remove();
		}
		return res.json({
			statusCode: 200,
			data: { success: true },
			errors: [],
		});
	} catch (error) {
		return res.json({
			statusCode: 500,
			data: null,
			errors: [{ propertyPath: "service", message: "Something went wrong with the delete user by id method" }],
		});
	}
}
