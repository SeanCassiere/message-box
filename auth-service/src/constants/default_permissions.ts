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
    // chat
    "chat:read",
    "chat:create",
    // calendar
    "calendar:read",
    // dashboard
    "dashboard:read",
    "dashboard:write",
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
    // report
    "report:read",
    "report:write",
    "report:admin",
    // team-activity
    "team-activity:read",
    "team-activity:write",
    "team-activity:admin",
    // calendar
    "calendar:admin",
    // chat
    "chat:delete",
    "chat:admin",
    // calendar
    "calendar:create",
    "calendar:delete",
    "calendar:admin",
    // dashboard
    "dashboard:read",
    "dashboard:write",
    "dashboard:admin",
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
    // report
    "report:read",
    "report:write",
    // team-activity
    "team-activity:read",
    "team-activity:write",
    // chat
    "chat:delete",
    // calendar
    "calendar:create",
    "calendar:delete",
    // dashboard
    "dashboard:read",
    "dashboard:write",
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
    // report
    "report:read",
    "report:write",
    // team-activity
    "team-activity:read",
    "team-activity:write",
    // chat
    "chat:delete",
    // calendar
    "calendar:create",
    "calendar:delete",
    // dashboard
    "dashboard:read",
    "dashboard:write",
    "dashboard:admin",
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
    // calendar
    "calendar:create",
    "calendar:delete",
    // chat
    "chat:create",
    "chat:delete",
    // dashboard
    "dashboard:read",
    "dashboard:write",
  ],
};
