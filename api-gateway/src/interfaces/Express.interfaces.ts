import { Request } from "express";

export type JwtAuthDetails = {
  message_box_clientId: string;
  message_box_userId: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
};

export interface CustomRequest<T> extends Request {
  body: T;
  user?: JwtAuthDetails;
  auth?: JwtAuthDetails;
}
