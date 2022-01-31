export const DEFAULT_PERMISSIONS_MAP: {
  [role: string]: string[];
} = {
  employee: [
    //profile
    "profile:read",
    // user
    "user:read",
    // client
    "client:read",
    // role
    "role:read",
    // team
    "team:read",
    // task
    "task:read",
  ],
  admin: [
    //profile
    "profile:read",
    "profile:write",
    // user
    "user:read",
    "user:write",
    "user:admin",
    // client
    "client:read",
    "client:write",
    "client:admin",
    // role
    "role:read",
    "role:write",
    "role:admin",
    // team
    "team:read",
    "team:create",
    "team:admin",
    // task
    "task:read",
    "task:delete",
    "task:create",
    "task:admin",
  ],
  hr: [
    //profile
    "profile:read",
    "profile:write",
    // user
    "user:read",
    "user:write",
    "user:admin",
    // client
    "client:read",
    // role
    "role:read",
    "role:write",
    "role:admin",
    // team
    "team:read",
    "team:write",
    "team:admin",
    // task
    "task:read",
    "task:create",
    "task:delete",
    "task:admin",
  ],
  manager: [
    //profile
    "profile:read",
    "profile:write",
    // user
    "user:read",
    "user:write",
    "user:admin",
    // client
    "client:read",
    // role
    "role:read",
    "role:write",
    "role:admin",
    // team
    "team:read",
    "team:write",
    "team:admin",
    // task
    "task:read",
    "task:create",
    "task:delete",
    "task:admin",
  ],
  basic_access_user: [
    //profile
    "profile:read",
    "profile:write",
    // user
    "user:read",
    // client
    "client:read",
    // role
    "role:read",
    // team
    "team:read",
    // task
    "task:read",
    "task:create",
    "task:delete",
  ],
};
