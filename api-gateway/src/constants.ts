import dotenv from "dotenv-safe";
import { pathToRegexp } from "path-to-regexp";

dotenv.config();

export const AUTH_SERVICE_URI = process.env.AUTH_SERVICE_URI || "http://auth-service:4000";
export const APP_DATA_SERVICE_URI = process.env.APP_DATA_SERVICE_URI || "http://application-data-service:4000";

export const API_PREFIX = "/Api";

export const ALLOWED_PUBLIC_PATHS = [
  pathToRegexp(`${API_PREFIX}/Hidden/Roles/SetDefaultRoles`),
  pathToRegexp(`${API_PREFIX}/Hidden/Roles/SetDefaultRolePermissions`),
  pathToRegexp(`/docs`),
  pathToRegexp(`${API_PREFIX}/Authentication/Login`),
  pathToRegexp(`${API_PREFIX}/Authentication/Logout`),
  pathToRegexp(`${API_PREFIX}/Authentication/Refresh`),
  pathToRegexp(`${API_PREFIX}/Authentication/Login/Refresh`),
  pathToRegexp(`${API_PREFIX}/Authentication/2FA/Code/Login`),
  pathToRegexp(`${API_PREFIX}/Authentication/2FA/Code/ConfirmUser`),
  pathToRegexp(`${API_PREFIX}/Clients`),
  pathToRegexp(`${API_PREFIX}/Users/ConfirmUser`),
  pathToRegexp(`${API_PREFIX}/Users/ConfirmUser/ResendConfirmationEmail`),
  pathToRegexp(`${API_PREFIX}/Users/ResetPassword`),
  pathToRegexp(`${API_PREFIX}/Users/ResetPassword/RequestEmail`),
  pathToRegexp(`${API_PREFIX}/Users/ResetPassword/With2FA`),
  pathToRegexp(`${API_PREFIX}/Users/ResetPassword/WithToken`),
  pathToRegexp(`${API_PREFIX}/Users/Reset2FA/RequestEmail`),
  pathToRegexp(`${API_PREFIX}/Users/Reset2FA/:token`),
];
