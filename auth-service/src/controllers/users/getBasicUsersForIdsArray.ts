import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

import User from "#root/db/entities/User";
import { validateYupSchema } from "#root/util/validateYupSchema";

const validationSchema = yup.object().shape({
  body: yup.object().shape({
    idList: yup.array().of(yup.string()).required("IdList is required"),
  }),
});

export async function getBasicUsersForIdsArray(req: Request, res: Response, next: NextFunction) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      errors: checkErrors,
    });
  }

  const { idList } = req.body.body;

  const usersToReturn = [];

  for (const id of idList) {
    try {
      const user = await User.findOne({ where: { userId: id } });
      if (user) {
        const { password, ...data } = user;
        usersToReturn.push({ ...data });
      }
    } catch (error) {
      console.log("Could not find user");
    }
  }

  return res.json({
    statusCode: 200,
    data: usersToReturn,
    errors: [],
  });
}
