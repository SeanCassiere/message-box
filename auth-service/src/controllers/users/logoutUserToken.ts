import { Request, Response, NextFunction } from "express";

import Token from "#root/db/entities/Token";

export async function logoutUserToken(req: Request, res: Response, next: NextFunction) {
  const { cookie } = req.body;
  if (!cookie) {
    return res.json({
      statusCode: 200,
      data: {
        success: true,
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
          success: true,
        },
        errors: [],
      });
    }

    token.isBlocked = true;
    await token.save();

    return res.json({
      statusCode: 200,
      data: {
        success: true,
      },
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 200,
      data: {
        success: true,
      },
      errors: [],
    });
  }
}
