import express from "express";
import axios from "axios";

import { CustomRequest } from "#root/interfaces/Express.interfaces";
import { AUTH_SERVICE_URI } from "#root/constants";

const userRouter = express.Router();

const client = axios.create({
  baseURL: AUTH_SERVICE_URI,
});

const updateUserByIdController = async (req: express.Request, res: express.Response) => {
  const request = req as CustomRequest<{}>;
  const { id } = request.params;
  const userId = id ?? request.auth?.message_box_userId;

  try {
    const { data: response } = await client.post("/users/updateUserByUserId", {
      variables: { userId: userId, clientId: request.auth?.message_box_clientId },
      body: { ...request.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: response.data, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
};

const getUserByIdController = async (req: express.Request, res: express.Response) => {
  const request = req as CustomRequest<{}>;
  const { id } = request.params;
  const userId = id ?? request.auth?.message_box_userId;

  try {
    const { data: response } = await client.get(`/users/${userId}`);

    return res.status(response.statusCode).json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users network error" });
  }
};

userRouter.route("/Profile").get(getUserByIdController).put(updateUserByIdController);

userRouter.route("/Profile/ChangePassword").post(async (req, res) => {
  const request = req as CustomRequest<{}>;

  try {
    const { data: response } = await client.post("/users/changePasswordForUser", {
      variables: {
        clientId: request.auth?.message_box_clientId,
        userId: request.auth?.message_box_userId,
      },
      body: { ...request.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /changePasswordForUser network error" });
  }
});

userRouter
  .route("/:id")
  .get(getUserByIdController)
  .put(updateUserByIdController)
  .delete(async (req, res) => {
    const request = req as CustomRequest<{}>;
    const { id } = request.params;

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

userRouter.route("/:id/ChangePassword").post(async (req, res) => {
  const request = req as CustomRequest<{}>;
  const { id } = request.params;
  try {
    const { data: response } = await client.post("/users/changePasswordByUserId", {
      variables: {
        clientId: request.auth?.message_box_clientId,
        userId: id,
      },
      body: { ...request.body },
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
  const request = req as CustomRequest<{}>;
  try {
    const { data: response } = await client.post("/2fa/changePasswordUsing2FA", {
      variables: null,
      body: { ...request.body },
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
  const request = req as CustomRequest<{}>;
  try {
    const { data: response } = await client.post("/users/resetPasswordByToken", { body: { ...request.body } });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /resetPasswordByToken network error" });
  }
});

userRouter.route("/ResetPassword/RequestEmail").post(async (req, res) => {
  const request = req as CustomRequest<{ host: string; path: string }>;
  try {
    const { data: response } = await client.post("/users/requestPasswordByEmail", {
      variables: {
        host: request.body?.host ?? "http://localhost:3000",
        path: request.body?.path ?? "/forgot-password/",
      },
      body: { ...request.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /requestPasswordByEmail network error" });
  }
});

userRouter.route("/Reset2FA/RequestEmail").post(async (req, res) => {
  const request = req as CustomRequest<{ host: string; path: string }>;
  try {
    const { data: response } = await client.post("/2fa/sendReset2faTokenEmail", {
      variables: {
        host: request.body?.host ?? "http://localhost:3000",
        path: request.body?.path ?? "/reset-2fa/",
      },
      body: { ...request.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /sendReset2faTokenEmail network error" });
  }
});

userRouter.route("/Reset2FA/:token").get(async (req, res) => {
  try {
    const { data: response } = await client.post("/2fa/getReset2faDetailsFromEmailToken", {
      body: { token: req.params.token },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /getReset2faDetailsFromEmailToken network error" });
  }
});

userRouter.route("/ConfirmUser").post(async (req, res) => {
  const request = req as CustomRequest<{}>;
  try {
    const { data: response } = await client.post("/users/confirmUserAccountByToken", { body: { ...request.body } });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /confirmUserAccountByToken network error" });
  }
});

userRouter.route("/ConfirmUser/ResendConfirmationEmail").post(async (req, res) => {
  const request = req as CustomRequest<{ host: string; path: string }>;

  try {
    const { data: response } = await client.post("/users/resendConfirmationEmail", {
      variables: {
        host: request.body?.host ?? "http://localhost:3000",
        path: request.body?.path ?? "/confirm-account/",
      },
      body: { ...request.body },
    });

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
    }

    return res.json({ ...response.data });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /users /confirmUserAccountByToken network error" });
  }
});

export default userRouter;
