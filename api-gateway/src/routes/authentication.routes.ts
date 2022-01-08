import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { validateToken } from "#root/middleware/authMiddleware";

const authenticationRouter = express.Router();

const client = axios.create({
  baseURL: "http://auth-service:4000",
});

authenticationRouter.route("/Login").post(async (req: CustomRequest<{}>, res) => {
  try {
    const { data } = await client.post("/2fa/emailAndPasswordLogin2FA", { body: req.body });

    if (data.statusCode === 200) {
      if (data.data.key === "/2fa/login") {
        return res
          .status(200)
          .json({ next: "/2FA/Code/Login", userId: data.data.userId, twoFactorAuthenticationCodeCreator: null });
      }

      if (data.data.key === "/2fa/verify") {
        return res.status(200).json({
          next: "/2FA/Code/VerifyRegistration",
          userId: data.data.userId,
          twoFactorAuthenticationCodeCreator: data.data.secret,
        });
      }
    }

    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
});

authenticationRouter.route("/2FA/Code/Login").post(async (req: CustomRequest<{}>, res) => {
  try {
    const { data } = await client.post("/2fa/getAccessTokenFor2FACode", { body: req.body });

    if (data.statusCode === 200) {
      return res
        .status(200)
        .cookie("mb_refresh_token", data.data.refreshToken, {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          expires: new Date(Date.now() + 18 * 60 * 60 * 1000),
        })
        .json({ access_token: data.data.accessToken, expiresIn: data.data.expiresIn, message: data.data.message });
    }

    return res.status(data.statusCode).json(data);
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
});

authenticationRouter.route("/2FA/Code/ConfirmUser").post(async (req: CustomRequest<{}>, res) => {
  try {
    const { data } = await client.post("/2fa/verifyUser2FAStatus", { body: req.body });

    if (data.statusCode === 200) {
      return res.json(data.data);
    }

    return res.status(data.statusCode).json({ data: data.data, errors: data.errors });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
});

authenticationRouter.route("/Login/Refresh").get(async (req, res) => {
  const cookieToken = req.cookies["mb_refresh_token"];

  if (cookieToken) {
    try {
      const { data } = await client.post("/users/refresh", { cookie: cookieToken });

      if (data.statusCode === 200) {
        return res.json({ access_token: data.data.accessToken, expiresIn: data.data.expiresIn });
      }
      return res.status(data.statusCode).json({ data: data.data, errors: data.errors });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /users network error" });
    }
  }

  return res.status(200).json({ access_token: null, expiresIn: 0 });
});

authenticationRouter.route("/Logout").get(async (_, res) => {
  return res.cookie("mb_refresh_token", "expiring now", { expires: new Date(Date.now()) }).json({ success: true });
});

authenticationRouter.route("/Profile").get(validateToken, async (req: CustomRequest<{}>, res) => {
  try {
    const { data } = await client.get(`/users/${req.auth?.message_box_userId}`);

    return res.status(data.statusCode).json({ ...data.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
});

export default authenticationRouter;
