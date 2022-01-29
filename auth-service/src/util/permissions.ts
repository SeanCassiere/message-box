export const ALL_AVAILABLE_ROLE_PERMISSIONS: { id: number; key: string }[] = [
  // user
  { id: 1, key: "profile:read" },
  { id: 2, key: "profile:write" },
  // user
  { id: 3, key: "user:read" },
  { id: 4, key: "user:write" },
  { id: 5, key: "user:admin" },
  // client
  { id: 6, key: "client:read" },
  { id: 7, key: "client:write" },
  { id: 8, key: "client:admin" },
  // role
  { id: 9, key: "role:read" },
  { id: 10, key: "role:write" },
  { id: 11, key: "role:admin" },
  // team
  { id: 12, key: "team:read" },
  { id: 13, key: "team:write" },
  { id: 14, key: "team:admin" },
  // task
  { id: 15, key: "task:read" },
  { id: 16, key: "task:create" },
  { id: 17, key: "task:delete" },
  { id: 18, key: "task:admin" },
];

export const DEFAULT_PERMISSIONS_MAP: {
  [role: string]: string[];
} = {
  employee: [
    // user
    "user:read",
    "user:update",
    // client
    "client:read",
    // role
    "role:read",
    // team
    "team:read",
    // task
    "task:read",
    "task:update",
    "task:create",
    "task:delete",
  ],
  admin: [
    // user
    "user:read",
    "user:create",
    "user:update",
    "user:delete",
    // client
    "client:read",
    "client:create",
    "client:update",
    "client:delete",
    // role
    "role:read",
    "role:update",
    "role:create",
    "role:delete",
    // team
    "team:read",
    "team:create",
    "team:update",
    "team:delete",
    // task
    "task:read",
    "task:delete",
    "task:create",
    "task:update",
  ],
  hr: [
    // user
    "user:read",
    "user:create",
    "user:update",
    // role
    "role:read",
    "role:update",
    "role:create",
    "role:delete",
    // team
    "team:read",
    "team:create",
    "team:update",
    "team:delete",
  ],
};
