export interface IChatRoom {
  roomId: string;
  roomType: "group" | "private";
  roomName: string;
  participants: string[];
  participantUserId: string | null;
}

export interface IChatMessage {
  messageId: string;
  senderId: string;
  senderName: string;
  type: string;
  message: string;
  timestamp: string;
}
