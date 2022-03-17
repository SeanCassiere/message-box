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
