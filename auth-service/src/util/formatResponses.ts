import Client from "#root/db/entities/Client";
import Role from "#root/db/entities/Role";
import Team from "#root/db/entities/Team";
import TeamMapping from "#root/db/entities/TeamMapping";
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
    adminUserId: client.adminUserId,
    updatedAt: client.updatedAt,
  };
}

export function formatRoleResponse({ role }: { role: Role }) {
  return {
    roleId: role.roleId,
    rootName: role.rootName,
    viewName: role.viewName,
    isUserDeletable: role.isUserDeletable,
    permissions: role.permissions,
    updatedAt: role.updatedAt,
  };
}

export async function formatTeamResponse({
  team,
  members: mappings,
  resolveUsers,
}: {
  team: Team;
  members: TeamMapping[];
  resolveUsers?: boolean;
}) {
  const mappingsToReturn = [];

  for (const map of mappings) {
    try {
      let user: any = { firstName: null, lastName: null };

      if (resolveUsers) {
        user = await User.findOne({ where: { userId: map.userId } });
      }

      mappingsToReturn.push({
        userId: map.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        isLeader: map.isATeamLeader,
      });
    } catch (error) {
      console.log("User not found", error);
    }
  }

  console.log("\n\n", mappingsToReturn, "\n\n");

  return {
    teamId: team.teamId,
    rootName: team.rootName,
    teamName: team.teamName,
    members: mappingsToReturn,
    isUserDeletable: team.isUserDeletable,
    updatedAt: team.updatedAt,
  };
}
