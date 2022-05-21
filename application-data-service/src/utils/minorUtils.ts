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

export function getStartDateOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getLastDateOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function getSundayOfCurrentWeek(date: Date) {
  const first = date.getDate() - date.getDay() + 1;
  const last = first - 1;
  const sunday = new Date(date.setDate(last));
  return sunday;
}

export function getSaturdayOfCurrentWeek(date: Date) {
  const first = date.getDate() - date.getDay() + 1;
  const last = first + 6;
  const parsed = new Date(date.setDate(last));
  const saturday = new Date(parsed.setHours(23, 59, 59, 999));
  return saturday;
}
