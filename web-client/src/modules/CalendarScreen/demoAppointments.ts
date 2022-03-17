export function getDummyCalendarEvents(month: number) {
  const returnEvents = [];

  const currentDate = new Date(Date.now());

  const year = currentDate.getFullYear();
  // const month = currentDate.getMonth() + 1;
  const day = parseInt(currentDate.toISOString().substring(8, 10));

  returnEvents.push({
    id: "1",
    ownerId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
    title: "Approve Personal Computer Upgrade Plan",
    startDate: new Date(`${year}-${month}-${day} 10:00`).toISOString(),
    endDate: new Date(`${year}-${month}-${day} 15:00`).toISOString(),
    isAllDay: false,
    sharedWith: [
      {
        userId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
        name: "Sean Cassiere",
      },
      {
        userId: "3ba2c179-4460-4c11-abba-92b58c01b8af",
        name: "test 1",
      },
    ],
    description: "nothing to see here\n\nboo",
  });

  returnEvents.push({
    id: "2",
    ownerId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
    title: "Sign Updated NDA",
    startDate: new Date(`${year}-${month}-${day} 12:00`).toISOString(),
    endDate: new Date(`${year}-${month}-${day} 14:00`).toISOString(),
    isAllDay: false,
    sharedWith: [],
    description: "nda event",
  });

  returnEvents.push({
    id: "3",
    ownerId: "dd4662a8-33cc-41da-a095-6102dbf613e6",
    title: "Book Flights to San Fran for Sales Trip",
    startDate: new Date(
      `${year}-${month}-${parseInt(currentDate.toISOString().substring(8, 10)) + 1} 0:00`
    ).toISOString(),
    endDate: new Date(
      `${year}-${month}-${parseInt(currentDate.toISOString().substring(8, 10)) + 2} 0:00`
    ).toISOString(),
    isAllDay: true,
    sharedWith: [],
    description: "long event man",
  });

  returnEvents.push({
    id: "4",
    ownerId: "74251bdf-808e-4a1a-9792-ef5e4a2b14f0",
    title: "Mid 24 hours",
    startDate: new Date(
      `${year}-${month}-${parseInt(currentDate.toISOString().substring(8, 10)) + 1} 09:00`
    ).toISOString(),
    endDate: new Date(
      `${year}-${month}-${parseInt(currentDate.toISOString().substring(8, 10)) + 1} 16:00`
    ).toISOString(),
    isAllDay: true,
    sharedWith: [],
    description: "very long event",
  });

  return returnEvents;
}
