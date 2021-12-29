import Client from "#root/db/entities/Client";
import Role from "#root/db/entities/Role";
import Team from "#root/db/entities/Team";
import User from "#root/db/entities/User";

export function formatUserResponseWithRoles({ user, roles, teams }: { user: User; roles: string[]; teams: string[] }) {
	return {
		userId: user.userId,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		roles: roles,
		teams: teams,
		isActive: user.isActive,
		updatedAt: user.updatedAt,
	};
}

export function formatClientResponse({ client }: { client: Client }) {
	return {
		clientId: client.clientId,
		clientName: client.name,
		updatedAt: client.updatedAt,
	};
}

export function formatRoleResponse({ role }: { role: Role }) {
	return {
		roleId: role.roleId,
		rootName: role.rootName,
		viewName: role.viewName,
		isUserDeletable: role.isUserDeletable,
		updatedAt: role.updatedAt,
	};
}

export function formatTeamResponse({ team }: { team: Team }) {
	return {
		teamId: team.teamId,
		rootName: team.rootName,
		teamName: team.teamName,
		isUserDeletable: team.isUserDeletable,
		updatedAt: team.updatedAt,
	};
}
