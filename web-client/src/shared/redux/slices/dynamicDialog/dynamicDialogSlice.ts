import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const ADD_TASK_DIALOG = "ADD_TASK_DIALOG";
const ADD_CALENDAR_EVENT_DIALOG = "ADD_CALENDAR_EVENT_DIALOG";
const CHANGE_PASSWORD_DIALOG = "CHANGE_PASSWORD_DIALOG";

type DynamicDialogReferenceTypes =
  | null
  | typeof ADD_TASK_DIALOG
  | typeof ADD_CALENDAR_EVENT_DIALOG
  | typeof CHANGE_PASSWORD_DIALOG;

type DynamicDialogSliceState = { referenceType: DynamicDialogReferenceTypes; referenceId: string; config: any };

const initialState: DynamicDialogSliceState = {
  referenceType: null,
  referenceId: "",
  config: null,
};

const dynamicDialogSlice = createSlice({
  name: "dynamicDialog",
  initialState,
  reducers: {
    stateCloseDynamicDialog: (state) => {
      state.referenceType = null;
      state.referenceId = "";
      state.config = null;
    },
    stateOpenAddTaskDialog: (state, action: PayloadAction<{ referenceId: string }>) => {
      state.referenceType = ADD_TASK_DIALOG;
      state.referenceId = action.payload.referenceId;
    },
    stateOpenAddCalendarEventDialog: (
      state,
      action: PayloadAction<{
        referenceId: string;
        currentUserId?: string;
        startDate?: string;
        endDate?: string;
        isAllDay?: boolean;
      }>
    ) => {
      state.referenceType = ADD_CALENDAR_EVENT_DIALOG;
      state.referenceId = action.payload.referenceId;
      state.config = {
        currentUserId: action.payload.currentUserId,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate,
        isAllDay: action.payload.isAllDay,
      };
    },
    stateOpenChangePasswordDialog: (state, action: PayloadAction<{}>) => {
      state.referenceType = CHANGE_PASSWORD_DIALOG;
      state.referenceId = "";
      state.config = null;
    },
  },
});

export const {
  stateCloseDynamicDialog,
  stateOpenAddTaskDialog,
  stateOpenAddCalendarEventDialog,
  stateOpenChangePasswordDialog,
} = dynamicDialogSlice.actions;

export default dynamicDialogSlice;
