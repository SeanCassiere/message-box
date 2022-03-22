import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { AUTH_SERVICE_URI } from "#root/constants";

const authenticationRouter = express.Router();

const REFRESH_TOKEN_KEY = "mb_refresh_token";

const client = axios.create({
  baseURL: AUTH_SERVICE_URI,
});

authenticationRouter.route("/Login").post(async (req, res) => {
  const request = req as CustomRequest<{}>;

  try {
    const { data: response } = await client.post("/2fa/emailAndPasswordLogin2FA", { body: request.body });

    if (response.statusCode === 200) {
      if (response.data.key === "/2fa/login") {
        return res.status(200).json({
          next: "/Api/Authentication/2FA/Code/Login",
          userId: response.data.userId,
          twoFactorAuthenticationCodeCreator: null,
        });
      }

      if (response.data.key === "/2fa/verify") {
        return res.status(200).json({
          next: "/Api/Authentication/2FA/Code/ConfirmUser",
          userId: response.data.userId,
          twoFactorAuthenticationCodeCreator: response.data.secret,
        });
      }
    }
    if (response.statusCode === 400) {
      return res.status(400).json({
        data: null,
        errors: response.errors,
      });
    }

    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
});

authenticationRouter.route("/2FA/Code/Login").post(async (req, res) => {
  const request = req as CustomRequest<{}>;

  try {
    const { data: response } = await client.post("/2fa/getAccessTokenFor2FACode", { body: request.body });

    if (response.statusCode === 200) {
      return res
        .status(200)
        .cookie(REFRESH_TOKEN_KEY, response.data.refreshToken, {
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          expires: new Date(Date.now() + 18 * 60 * 60 * 1000),
        })
        .json({
          access_token: response.data.accessToken,
          token_type: response.data.tokenType,
          expiresIn: response.data.expiresIn,
          message: response.data.message,
        });
    }

    return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
});

authenticationRouter.route("/2FA/Code/ConfirmUser").post(async (req, res) => {
  const request = req as CustomRequest<{ token?: string }>;

  try {
    const { data: response } = await client.post("/2fa/verifyUser2FAStatus", { body: request.body });

    if (request.body.token) {
      await client.post("/email/markEmailConfirmationIdAsUsed", { body: { confirmationId: request.body.token } });
    }

    if (response.statusCode === 200) {
      return res.json(response.data);
    }

    return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
});

authenticationRouter
  .route("/Login/Passwordless")
  .get(async (req, res) => {
    let email = "";
    if (typeof req.query.email === "string") {
      email = req.query.email;
    } else {
      email = Array.from(req.query.email as any)[0] as string;
    }

    try {
      const { data: response } = await client.post("/users/checkForPasswordlessAccessibleByEmail", {
        body: { email: email.toLowerCase() },
      });

      if (response.statusCode === 200) {
        return res.json(response.data);
      }

      return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /users network error" });
    }
  })
  .post(async (req, res) => {
    try {
      const { data: response } = await client.post("/2fa/sendPasswordlessPin", {
        body: { ...req.body },
      });

      if (response.statusCode === 200) {
        return res.json(response.data);
      }

      return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /2fa network error" });
    }
  });

authenticationRouter.route("/Login/Refresh").get(async (req, res) => {
  const request = req as CustomRequest<{}>;

  const cookieToken = request.cookies[REFRESH_TOKEN_KEY];

  if (cookieToken) {
    try {
      const { data: response } = await client.post("/users/refresh", { cookie: cookieToken });

      if (response.statusCode === 200) {
        const refreshExpiry = new Date(response.data.refreshExpiresAt);
        return res
          .cookie(REFRESH_TOKEN_KEY, `${response.data.refreshToken}`, {
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            expires: refreshExpiry,
          })
          .json({
            access_token: response.data.accessToken,
            token_type: response.data.tokenType,
            expiresIn: response.data.expiresIn,
            message: response.data.message,
          });
      }
      return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /users network error" });
    }
  }

  return res.status(200).json({ access_token: null, expiresIn: 0, token_type: "Bearer", message: "No cookie" });
});

authenticationRouter.route("/Logout").get(async (req, res) => {
  const request = req as CustomRequest<{}>;

  const cookieToken = request.cookies[REFRESH_TOKEN_KEY];

  try {
    await client.post("/users/logoutUserToken", { cookie: cookieToken ?? null });
  } catch (error) {
    console.log(`Could not logout this refresh_token ${cookieToken}`);
  }

  return res
    .cookie(REFRESH_TOKEN_KEY, "null", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({ success: true });
});

export default authenticationRouter;
