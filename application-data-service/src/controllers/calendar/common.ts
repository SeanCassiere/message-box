import * as yup from "yup";

export const calendarEventBodySchema = yup.object().shape({
  ownerId: yup.string().required("Task must have an owner"),
  title: yup.string().required("Event name is required"),
  description: yup.string(),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .test({
      name: "End date",
      message: "End date cannot be before the start date",
      test: function (value, ctx) {
        if (!value) return true;

        const startDate = new Date(ctx?.parent?.startDate as string);

        if (Number(new Date(value)) <= Number(startDate)) {
          return false;
        } else {
          return true;
        }
      },
    })
    .required("End date is required"),
  sharedWith: yup.array().of(
    yup.object().shape({
      userId: yup.string().required("User ID for guest is required"),
    })
  ),
});
