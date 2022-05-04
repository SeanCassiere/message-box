import { Request, Response } from "express";
import * as yup from "yup";

import { validateYupSchema } from "#root/utils/validateYupSchema";
import { log } from "#root/utils/logger";
import ChatRoom from "#root/db/entities/ChatRoom";
import ChatRoomUserMapping from "#root/db/entities/ChatRoomUserMappings";

import { createDbActivityLog } from "#root/utils/createDbActivityLog";

const validationSchema = yup.object().shape({
  variables: yup.object().shape({
    clientId: yup.string().required("ClientId is required"),
    userId: yup.string().required("UserId is required"),
  }),
  body: yup.object().shape({
    roomId: yup.string().required("RoomId is required"),
  }),
});

export async function deleteChatRoomForRoomId(req: Request, res: Response) {
  const checkErrors = await validateYupSchema(validationSchema, req.body);
  if (checkErrors && checkErrors.length > 0) {
    return res.json({
      statusCode: 400,
      data: null,
      pagination: null,
      errors: checkErrors,
    });
  }

  const variables = req.body.variables;
  const body = req.body.body;

  try {
    const chatRoom = await ChatRoom.findOne({ where: { roomId: body.roomId } });
    if (chatRoom) {
      chatRoom.isDeleted = true;
      await chatRoom.save();
    }
  } catch (error) {
    return res.json({
      statusCode: 400,
      data: {
        success: false,
        message: "There was an error removing this chat room",
      },
      errors: [
        {
          propertyPath: "roomId",
          message: "Could not find chat room",
        },
      ],
      pagination: null,
    });
  }

  const chatUserMappingQuery = ChatRoomUserMapping.createQueryBuilder()
    .update(ChatRoomUserMapping)
    .set({ isDeleted: true })
    .where("room_id = :room_id", { room_id: body.roomId });

  try {
    await chatUserMappingQuery.execute();
  } catch (error) {
    log.error(`Error removing participants`);
  }

  createDbActivityLog({
    clientId: variables.clientId,
    userId: variables.userId,
    action: "chat-room-delete",
    description: `Deleted chat room with roomId:${body.roomId}`,
  }).then(() => {
    log.info(`Activity log created for userId: ${variables?.userId}`);
  });

  return res.json({
    statusCode: 200,
    data: {
      success: true,
      message: "Chat room deleted",
    },
    errors: [],
    pagination: null,
  });
}
