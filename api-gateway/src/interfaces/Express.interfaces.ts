import { Request } from "express";

export interface CustomRequest<T> extends Request {
  body: T;
  user?: {
    message_box_clientId: string;
    message_box_userId: string;
  };
  auth?: {
    message_box_clientId: string;
    message_box_userId: string;
  };
}
