import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import User from "#root/db/entities/User";
import { generateJWT } from "#root/util/generateJWT";

export async function refreshUserAccessToken(req: Request, res: Response, next: NextFunction) {
  const { cookie } = req.body;
  if (!cookie) {
    return res.json({
      statusCode: 200,
      data: {
        message: "Sorry!, but you do not get a new access_token",
        accessToken: null,
        expiresIn: 0,
      },
      errors: [],
    });
  }

  try {
    const cookieData = jwt.verify(cookie, process.env.REFRESH_TOKEN_SECRET!) as { message_box_userId: string };

    const user = await User.findOne({ where: { userId: cookieData.message_box_userId } });

    if (!user) {
      return res.json({
        statusCode: 200,
        data: {
          message: "Sorry!, but you do not get a new access_token",
          accessToken: null,
          expiresIn: 0,
        },
        errors: [],
      });
    }

    const accessToken = await generateJWT(user, "10min");
    return res.json({
      statusCode: 200,
      data: {
        message: "Successfully refreshed access token",
        accessToken: accessToken,
        expiresIn: 10 * 60,
      },
      errors: [],
    });
  } catch (err) {
    return res.json({
      statusCode: 200,
      data: {
        message: "Sorry!, but you do not get a new access_token",
        accessToken: null,
        expiresIn: 0,
      },
      errors: [],
    });
  }
}
