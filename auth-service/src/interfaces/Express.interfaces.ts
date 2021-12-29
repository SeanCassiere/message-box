import { Request } from "express";

import User from "#root/db/entities/User";

export interface CustomRequest<T> extends Request {
	body: T;
	user?: User;
	auth?: {
		message_box_clientId: string;
		message_box_userId: string;
	};
}
