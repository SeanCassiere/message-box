import { Request, Response, NextFunction } from "express";

import Client from "#root/db/entities/Client";
import { formatClientResponse } from "#root/util/formatResponses";

export async function getAllClients(req: Request, res: Response, next: NextFunction) {
  try {
    const allClients = await Client.find({
      where: { isActive: true },
      select: ["clientId", "name", "updatedAt"],
      order: { createdAt: "DESC" },
    });
    const formatClients = allClients.map((client) => {
      return formatClientResponse({ client });
    });

    return res.json({
      statusCode: 200,
      data: [...formatClients],
      errors: [],
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      data: null,
      errors: [{ field: "service", message: "Something went wrong with fetching the users" }],
    });
  }
}
