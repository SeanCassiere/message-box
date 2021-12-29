export interface IClientProfile {
	clientId: string;
	clientName: string;
	updatedAt: string;
}

export interface IRoleProfile {
	roleId: string;
	rootName: string;
	viewName: string;
	isUserDeletable: boolean;
	updatedAt: string;
}

export interface ITeamProfile {
	teamId: string;
	rootName: string;
	teamName: string;
	isUserDeletable: boolean;
	updatedAt: string;
}
