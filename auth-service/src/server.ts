import express from "express";
import cors from "cors";
import morgan from "morgan";

import { jwtValidator } from "./middleware/authMiddleware";

import { createUserForClient } from "./controllers/users/createUserForClient";
import { getAllUsers } from "./controllers/users/getAllUsers";
import { loginUser } from "./controllers/users/loginUser";
import { getUserProfile } from "./controllers/users/getUserProfile";
import { getUserById } from "./controllers/users/getUserById";
import { refreshUserAccessToken } from "./controllers/users/refreshUserAccessToken";
import { deleteUserById } from "./controllers/users/deleteUserById";
import { updateUserByUserId } from "./controllers/users/updateUserByUserId";
import { confirmUserAccountByToken } from "./controllers/email-related/confirmUserAccountByToken";
import { requestPasswordByEmail } from "./controllers/email-related/requestPasswordByEmail";
import { resetPasswordByToken } from "./controllers/email-related/resetPasswordByToken";
import { resendConfirmationEmail } from "./controllers/email-related/resendConfirmationEmail";
import { logoutUserToken } from "./controllers/users/logoutUserToken";

import { createClientAndUser } from "./controllers/clients/createClientAndUser";
import { getAllClients } from "./controllers/clients/getAllClients";
import { getClientById } from "./controllers/clients/getClientById";
import { updateClientById } from "./controllers/clients/updateClientById";

import { getAllRolesForClient } from "./controllers/roles/getAllRolesForClient";
import { getRoleById } from "./controllers/roles/getRoleById";
import { updateRoleById } from "./controllers/roles/updateRoleById";
import { deleteRoleById } from "./controllers/roles/deleteRoleById";
import { createRoleForClient } from "./controllers/roles/createRoleForClient";
import { getAllRolePermissions } from "./controllers/roles/getAllRolePermissions";

import { emailAndPasswordLogin2FA } from "./controllers/2fa/emailAndPasswordLogin2FA";
import { getAccessTokenFor2FACode } from "./controllers/2fa/getAccessTokenFor2FACode";
import { verifyUser2FAStatus } from "./controllers/2fa/verifyUser2FAStatus";
import { changePasswordUsing2FA } from "./controllers/2fa/changePasswordUsing2FA";
import { sendReset2faTokenEmail } from "./controllers/2fa/sendReset2faTokenEmail";
import { getReset2faDetailsFromEmailToken } from "./controllers/2fa/getReset2faDetailsFromEmailToken";

import { getAllTeamsForClient } from "./controllers/teams/getAllTeamsForClient";
import { getTeamById } from "./controllers/teams/getTeamById";
import { createTeamForClient } from "./controllers/teams/createTeamForClient";
import { updateTeamById } from "./controllers/teams/updateTeamById";
import { deleteTeamById } from "./controllers/teams/deleteTeamById";
import { changePasswordForUser } from "./controllers/users/changePasswordForUser";
import { changePasswordByUserId } from "./controllers/users/changePasswordByUserId";

import { getAllUserIdsForClient } from "./controllers/clients/getAllUserIdsForClient";
import { adminSetDefaultRolePermissions } from "./controllers/roles/adminSetDefaultRolePermissions";
import { adminSetDefaultRoles } from "./controllers/roles/adminSetDefaultRoles";

const expressApp = express();

expressApp.use(cors({ origin: (_, cb) => cb(null, true), credentials: true }));
expressApp.use(express.json());

expressApp.use(morgan("dev"));

expressApp.use(express.static(__dirname + "/../public"));

// private routes
expressApp.post("/clients/getAllUserIdsForClient", getAllUserIdsForClient);
expressApp.get("/admin/roles/adminSetDefaultRoles", adminSetDefaultRoles);
expressApp.get("/admin/roles/adminSetDefaultRolePermissions", adminSetDefaultRolePermissions);

// public routes
/**
 * User routes
 */
expressApp.post("/users", getAllUsers as any);
expressApp.post("/users/createUserForClient", createUserForClient);
expressApp.post("/users/login", loginUser);
expressApp.get("/users/profile", jwtValidator, getUserProfile as any);
expressApp.post("/users/refresh", refreshUserAccessToken);
expressApp.get("/users/:id", getUserById as any);
expressApp.post("/users/updateUserByUserId", updateUserByUserId);
expressApp.post("/users/deleteUserById", deleteUserById as any);
expressApp.post("/users/confirmUserAccountByToken", confirmUserAccountByToken);
expressApp.post("/users/requestPasswordByEmail", requestPasswordByEmail);
expressApp.post("/users/resetPasswordByToken", resetPasswordByToken);
expressApp.post("/users/resendConfirmationEmail", resendConfirmationEmail);
expressApp.post("/users/changePasswordForUser", changePasswordForUser);
expressApp.post("/users/changePasswordByUserId", changePasswordByUserId);
expressApp.post("/users/logoutUserToken", logoutUserToken);

/**
 * Client routes
 */
expressApp.get("/clients/getAllClients", getAllClients);
expressApp.post("/clients/getClientById", getClientById);
expressApp.post("/clients/createClientAndUser", createClientAndUser);
expressApp.post("/clients/updateClientById", updateClientById);

/**
 * Role routes
 */
expressApp.post("/roles/getAllRolesForClient", getAllRolesForClient as any);
expressApp.post("/roles/getRoleById", getRoleById as any);
expressApp.post("/roles/createRoleForClient", createRoleForClient);
expressApp.post("/roles/updateRoleById", updateRoleById);
expressApp.post("/roles/deleteRoleById", deleteRoleById);
expressApp.get("/roles/getAllRolePermissions", getAllRolePermissions);

/**
 * Team routes
 */
expressApp.post("/teams/getAllTeamsForClient", getAllTeamsForClient as any);
expressApp.post("/teams/getTeamById", getTeamById as any);
expressApp.post("/teams/createTeamForClient", createTeamForClient);
expressApp.post("/teams/updateTeamById", updateTeamById);
expressApp.post("/teams/deleteTeamById", deleteTeamById);

expressApp.post("/2fa/emailAndPasswordLogin2FA", emailAndPasswordLogin2FA);
expressApp.post("/2fa/verifyUser2FAStatus", verifyUser2FAStatus);
expressApp.post("/2fa/getAccessTokenFor2FACode", getAccessTokenFor2FACode);
expressApp.post("/2fa/changePasswordUsing2FA", changePasswordUsing2FA);
expressApp.post("/2fa/sendReset2faTokenEmail", sendReset2faTokenEmail);
expressApp.post("/2fa/getReset2faDetailsFromEmailToken", getReset2faDetailsFromEmailToken);

export default expressApp;
