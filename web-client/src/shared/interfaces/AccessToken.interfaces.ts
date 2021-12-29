export interface AccessTokenPair {
	access_token: string | null;
	expiresIn: number;
}

export interface JwtPayload {
	message_box_clientId: string;
	message_box_userId: string;
	exp: number;
}
