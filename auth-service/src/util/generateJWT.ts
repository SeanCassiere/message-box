import jwt from "jsonwebtoken";
import fs from "fs";

import User from "#root/db/entities/User";
import Role from "#root/db/entities/Role";
import RoleMapping from "#root/db/entities/RoleMapping";

export async function generateJWT(user: User, expiresIn: string) {
  const userRoles: string[] = [];
  const permissions: string[] = [];

  const secret = fs.readFileSync(__dirname + "/../../certs/private.pem");

  try {
    const roleMappings = await RoleMapping.find({ where: { userId: user.userId } });

    for (const mapping of roleMappings) {
      const role = await Role.findOne({ where: { roleId: mapping.roleId } });
      if (role && !userRoles.includes(role.rootName)) {
        userRoles.push(role?.rootName);
        const perms = role.permissions;
        for (const perm of perms) {
          if (!permissions.includes(perm)) {
            permissions.push(perm);
          }
        }
      }
    }
  } catch (error) {
    console.log("ACCESS TOKEN: Could not get roles for user", error);
  }

  const sortedPermissions = permissions.sort((a, b) => {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });

  return jwt.sign(
    {
      message_box_clientId: user.clientId,
      message_box_userId: user.userId,
      roles: [...userRoles],
      permissions: [...sortedPermissions],
    },
    secret,
    { expiresIn, algorithm: "RS256" }
  );
}

export function generateRefreshJWT(user: User, expiresIn: string) {
  return jwt.sign(
    {
      message_box_clientId: user.clientId,
      message_box_userId: user.userId,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn,
    }
  );
}
