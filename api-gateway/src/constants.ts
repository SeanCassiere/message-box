import dotenv from "dotenv-safe";

dotenv.config();

export const AUTH_SERVICE_URI = process.env.AUTH_SERVICE_URI || "http://auth-service:4000";
export const APP_DATA_SERVICE_URI = process.env.APP_DATA_SERVICE_URI || "http://application-data-service:4000";

export const API_PREFIX = "/api";

export const ALLOWED_PUBLIC_PATHS = [
  "/Docs",
  `${API_PREFIX}/Authentication/Login`,
  `${API_PREFIX}/Authentication/Refresh`,
  `${API_PREFIX}/Authentication/Login/Refresh`,
  `${API_PREFIX}/Authentication/2FA/Code/Login`,
  `${API_PREFIX}/Authentication/2FA/Code/ConfirmUser`,
  `${API_PREFIX}/Authentication/Logout`,
  `${API_PREFIX}/Clients`,
  `${API_PREFIX}/Users/:id/ChangePassword`,
  `${API_PREFIX}/Users/ConfirmUser`,
  `${API_PREFIX}/Users/ConfirmUser/ResendConfirmationEmail`,
  `${API_PREFIX}/Users/ResetPassword`,
  `${API_PREFIX}/Users/ResetPassword/RequestEmail`,
  `${API_PREFIX}/Users/ResetPassword/With2FA`,
  `${API_PREFIX}/Users/ResetPassword/WithToken`,
];
