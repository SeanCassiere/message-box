const PREFIX = "MessageBox";

export const classes = {
  appointment: `${PREFIX}-appointment`,
  weekEndCell: `${PREFIX}-weekEndCell`,
  ownEventAlone: `${PREFIX}-ownEventAlone`,
  ownEventWithGuests: `${PREFIX}-ownEventWithGuests`,
  guestToAnotherEvent: `${PREFIX}-guestToAnotherEvent`,
  weekEndDayScaleCell: `${PREFIX}-weekEndDayScaleCell`,
  text: `${PREFIX}-text`,
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  toolbarRoot: `${PREFIX}-toolbarRoot`,
  progress: `${PREFIX}-progress`,
};

export const resources = [
  // {
  //   fieldName: "ownerId",
  //   title: "Owner ID",
  //   instances: [
  //     { id: "dd4662a8-33cc-41da-a095-6102dbf613e6", text: "Single Event", color: teal },
  //     { id: "2", text: "Medium Priority", color: blue },
  //     { id: "3", text: "Low Priority", color: indigo },
  //   ],
  // },
];

export const isWeekEnd = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;

export const getDateRangeFromViewName = (viewName: string, date: Date): [Date, Date] => {
  let startDate = new Date(date);
  let endDate = new Date(date);

  if (viewName.toLowerCase() === "month") {
    // restricted to current month only
    startDate = new Date(new Date(new Date(date).setMonth(date.getMonth(), 1)).setHours(0, 0, 0, 0));
    endDate = new Date(new Date(new Date(date).setMonth(date.getMonth() + 1, 0)).setHours(23, 59, 59, 999));
  } else if (viewName.toLowerCase() === "week") {
    // gets the start of sunday through to the start of the next sunday
    startDate = new Date(new Date(new Date(date).setDate(date.getDate() - date.getDay() + 0)).setHours(0, 0, 0, 0));
    endDate = new Date(new Date(new Date(date).setDate(date.getDate() - date.getDay() + 7)).setHours(23, 59, 59, 999));
  } else if (viewName.toLowerCase() === "day") {
    // gets the start of the today to the start of the next day
    startDate = new Date(new Date(date).setHours(0, 0, 0, 0));
    endDate = new Date(new Date(new Date(date).setDate(date.getDate() + 1)).setHours(0, 1, 0, 0));
  } else if (viewName.toLowerCase() === "3-days") {
    // gets the start of the yesterday and the start of 3 days from now
    startDate = new Date(new Date(new Date(date).setDate(date.getDate() - 1)).setHours(0, 1, 0, 0));
    endDate = new Date(new Date(new Date(date).setDate(date.getDate() + 4)).setHours(0, 1, 0, 0));
  }

  return [startDate, endDate];
};
