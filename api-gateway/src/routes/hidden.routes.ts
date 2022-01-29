import express from "express";
import axios from "axios";

import { AUTH_SERVICE_URI } from "#root/constants";

const router = express.Router();

const authServiceClient = axios.create({ baseURL: AUTH_SERVICE_URI });

/**
 * @description seeds the default roles in the database with new permissions
 */
router.route("/Roles/SetDefaultRolePermissions").get(async (req, res) => {
  try {
    const { data: response } = await authServiceClient.get("/admin/roles/adminSetDefaultRolePermissions");

    if (response.statusCode === 200) {
      if (response.statusCode === 200) {
        return res.json({ ...response.data });
      }
    }

    return res.status(response.statusCode).json({ data: { ...response.data }, errors: response.errors });
  } catch (error) {
    return res.status(500).json({ message: "auth-service /client network error" });
  }
});

export default router;
