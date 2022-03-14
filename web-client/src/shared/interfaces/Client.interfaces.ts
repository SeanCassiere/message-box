export interface IClientProfile {
  clientId: string;
  clientName: string;
  adminUserId: string;
  updatedAt: string;
}

export interface IRoleProfile {
  roleId: string;
  rootName: string;
  viewName: string;
  permissions: string[];
  isUserDeletable: boolean;
  updatedAt: string;
}

export interface ITeamMember {
  userId: string;
  firstName?: string;
  lastName?: string;
  isLeader: boolean;
}
export interface ITeamProfile {
  teamId: string;
  rootName: string;
  teamName: string;
  members: ITeamMember[];
  isUserDeletable: boolean;
  updatedAt: string;
}
