import { IRoleProfile, ITeamProfile } from "./Client.interfaces";

export interface IUserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  teams: string[];
  isActive: boolean;
  updatedAt: string;
}

export interface IUserProfileWithSortedDetails extends IUserProfile {
  roleDetails: IRoleProfile[];
  teamDetails: ITeamProfile[];
}

export interface ICurrentUserStatusInterface {
  status: string;
  color: string;
}
