import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { AUTH_SERVICE_URI } from "#root/constants";

const authenticationRouter = express.Router();

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
        .cookie("mb_refresh_token", response.data.refreshToken, {
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
  const request = req as CustomRequest<{}>;

  try {
    const { data: response } = await client.post("/2fa/verifyUser2FAStatus", { body: request.body });

    if (response.statusCode === 200) {
      return res.json(response.data);
    }

    return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
});

authenticationRouter.route("/Login/Refresh").get(async (req, res) => {
  const request = req as CustomRequest<{}>;

  const cookieToken = request.cookies["mb_refresh_token"];

  if (cookieToken) {
    try {
      const { data: response } = await client.post("/users/refresh", { cookie: cookieToken });

      if (response.statusCode === 200) {
        return res.json({ access_token: response.data.accessToken, expiresIn: response.data.expiresIn });
      }
      return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /users network error" });
    }
  }

  return res.status(200).json({ access_token: null, expiresIn: 0 });
});

authenticationRouter.route("/Logout").get(async (_, res) => {
  return res
    .cookie("mb_refresh_token", "expiring now", {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({ success: true });
});

authenticationRouter.route("/Profile").get(async (req, res) => {
  const request = req as CustomRequest<{}>;

  try {
    const { data: response } = await client.get(`/users/${request.auth?.message_box_userId}`);

    return res.status(response.statusCode).json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
});

export default authenticationRouter;
