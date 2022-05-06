export function returnStringsNotInOriginalArray(originalArray: string[], comparisonArray: string[]) {
  return comparisonArray.filter((string) => !originalArray.includes(string));
}

export function createConversationChatRoomName(roomName: string, participantIds: string[]) {
  const participantsToJoinedString = participantIds.join(",").trim().replace(" ", "");
  const newRoomName = `${participantsToJoinedString}[JOINED_IDS] - ${roomName}`;
  return newRoomName;
}

export function getUserIdsFromChatRoomName(roomName: string) {
  const idsInString = roomName.split("[JOINED_IDS]");
  const idsAsArray = idsInString[0].split(",");

  return {
    userIds: idsAsArray,
    restOfRootName: idsInString[1],
  };
}
