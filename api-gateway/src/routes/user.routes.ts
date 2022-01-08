import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { validateToken } from "#root/middleware/authMiddleware";

const userRouter = express.Router();

const client = axios.create({
  baseURL: "http://auth-service:4000",
});

const updateUserByIdController = async (req: CustomRequest<{}>, res: express.Response) => {
  const { id } = req.params;
  const userId = id ?? req.auth?.message_box_userId;

  try {
    const { data } = await client.post("/users/updateUserByUserId", {
      variables: { userId: userId, clientId: req.auth?.message_box_clientId },
      body: { ...req.body },
    });

    if (data.statusCode !== 200) {
      return res.status(data.statusCode).json({ data: data.data, errors: data.errors });
    }

    return res.json({ ...data.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
};

const getUserByIdController = async (req: CustomRequest<{}>, res: express.Response) => {
  const { id } = req.params;
  const userId = id ?? req.auth?.message_box_userId;

  try {
    const { data } = await client.get(`/users/${userId}`);

    return res.status(data.statusCode).json({ ...data.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
};

userRouter.route("/Profile").get(validateToken, getUserByIdController).put(validateToken, updateUserByIdController);

userRouter
  .route("/:id")
  .get(validateToken, getUserByIdController)
  .put(validateToken, updateUserByIdController)
  .delete(validateToken, async (req, res) => {
    const { id } = req.params;

    try {
      const { data: response } = await client.post("/users/deleteUserById", { userId: id });

      if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
      }

      return res.json({ ...response.data });
    } catch (error) {
      return res.status(500).json({ message: "auth-service /users network error" });
    }
  });

userRouter.route("/:id/ChangePassword").post(validateToken, async (req: CustomRequest<{}>, res) => {
  const { id } = req.params;
  try {
    const { data: response } = await client.post("/users/changePasswordByUserId", {
      variables: {
        host: process.env.FRONTEND_HOST,
        clientId: req.auth?.message_box_clientId,
        userId: id,
      },
      body: { ...req.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /changePasswordWith2FA network error" });
  }
});

userRouter.route("/ResetPassword/With2FA").post(async (req, res) => {
  try {
    const { data: response } = await client.post("/2fa/changePasswordUsing2FA", {
      variables: { host: process.env.FRONTEND_HOST },
      body: { ...req.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /changePasswordWith2FA network error" });
  }
});

userRouter.route("/ResetPassword/WithToken").post(async (req, res) => {
  try {
    const { data: response } = await client.post("/users/resetPasswordByToken", { body: { ...req.body } });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /resetPasswordByToken network error" });
  }
});

userRouter.route("/ResetPassword/RequestEmail").post(async (req, res) => {
  try {
    const { data: response } = await client.post("/users/requestPasswordByEmail", {
      variables: { host: process.env.FRONTEND_HOST, path: "/forgot-password/" },
      body: { ...req.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /requestPasswordByEmail network error" });
  }
});

userRouter.route("/ConfirmUser").post(async (req, res) => {
  try {
    const { data: response } = await client.post("/users/confirmUserAccountByToken", { body: { ...req.body } });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /confirmUserAccountByToken network error" });
  }
});

userRouter.route("/ConfirmUser/ResendConfirmationEmail").post(async (req, res) => {
  try {
    const { data: response } = await client.post("/users/resendConfirmationEmail", {
      variables: { host: process.env.FRONTEND_HOST, path: "/confirm-account/" },
      body: { ...req.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /confirmUserAccountByToken network error" });
  }
});

userRouter.route("/ChangePassword").post(validateToken, async (req: CustomRequest<{}>, res) => {
  try {
    const { data: response } = await client.post("/users/changePasswordForUser", {
      variables: {
        host: process.env.FRONTEND_HOST,
        clientId: req.auth?.message_box_clientId,
        userId: req.auth?.message_box_userId,
      },
      body: { ...req.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /changePasswordWith2FA network error" });
  }
});

export default userRouter;
