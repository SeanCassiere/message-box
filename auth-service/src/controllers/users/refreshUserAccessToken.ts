import { Request, Response, NextFunction } from "express";

import Token from "#root/db/entities/Token";
import User from "#root/db/entities/User";
import { generateJWT } from "#root/utils/generateJWT";

export async function refreshUserAccessToken(req: Request, res: Response, next: NextFunction) {
  const { cookie } = req.body;
  if (!cookie) {
    return res.json({
      statusCode: 200,
      data: {
        message: "Sorry!, but you do not get a new access_token",
        tokenType: "Bearer",
        accessToken: null,
        refreshToken: null,
        expiresIn: 0,
        refreshExpiresAt: new Date(),
      },
      errors: [],
    });
  }

  try {
    const token = await Token.findOne({ where: { token: cookie } });

    if (!token) {
      return res.json({
        statusCode: 200,
        data: {
          message: "Refresh token not found",
          accessToken: null,
          tokenType: "Bearer",
          refreshToken: null,
          expiresIn: 0,
          refreshExpiresAt: new Date(),
        },
        errors: [],
      });
    }

    if (token.expiresAt < new Date()) {
      return res.json({
        statusCode: 200,
        data: {
          message: "Refresh token expired",
          accessToken: null,
          tokenType: "Bearer",
          refreshToken: null,
          expiresIn: 0,
          refreshExpiresAt: new Date(),
        },
        errors: [],
      });
    }

    if (token.isBlocked) {
      const allTokensForUser = await Token.find({ where: { userId: token.userId, isBlocked: false } });

      const promises = [];
      for (const singleToken of allTokensForUser) {
        singleToken.isBlocked = true;
        promises.push(singleToken.save());
      }
      if (promises.length > 0) {
        await Promise.all(promises);
      }

      return res.json({
        statusCode: 200,
        data: {
          message: "Refresh token is blocked",
          accessToken: null,
          tokenType: "Bearer",
          refreshToken: null,
          expiresIn: 0,
          refreshExpiresAt: new Date(),
        },
        errors: [],
      });
    }

    const user = await User.findOne({ where: { userId: token.userId } });

    if (!user || user?.isActive === false) {
      return res.json({
        statusCode: 200,
        data: {
          message: "Sorry! User account not found for this token",
          accessToken: null,
          tokenType: "Bearer",
          refreshToken: null,
          expiresIn: 0,
          refreshExpiresAt: new Date(),
        },
        errors: [],
      });
    }

    const accessToken = await generateJWT(user, "10min");

    const newRefreshTokenObject = Token.create({ userId: user.userId });
    newRefreshTokenObject.appendRefreshToken();
    await newRefreshTokenObject.save();
    newRefreshTokenObject.reload();

    token.isBlocked = true;
    await token.save();

    return res.json({
      statusCode: 200,
      data: {
        message: "Successfully refreshed access token",
        accessToken: accessToken,
        tokenType: "Bearer",
        refreshToken: newRefreshTokenObject.token,
        expiresIn: 10 * 60,
        refreshExpiresAt: newRefreshTokenObject.expiresAt,
      },
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 200,
      data: {
        message: "Sorry!, but you do not get a new access_token",
        accessToken: null,
        tokenType: "Bearer",
        refreshToken: null,
        expiresIn: 0,
      },
      errors: [],
    });
  }
}
