import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectDynamicDialogState } from "../../../redux/store";
import { stateCloseDynamicDialog } from "../../../redux/slices/dynamicDialog/dynamicDialogSlice";

import AddTaskDialog from "../AddTaskDialog";
import AddCalendarEventDialog from "../AddCalendarEventDialog";
import ChangePasswordDialog from "../ChangePasswordDialog";

const DynamicDialogListener = () => {
  const dispatch = useDispatch();
  const state = useSelector(selectDynamicDialogState);

  const handleCloseDialogInRedux = React.useCallback(() => {
    dispatch(stateCloseDynamicDialog());
  }, [dispatch]);

  return (
    <React.Fragment>
      <AddTaskDialog
        showDialog={state.referenceType === "ADD_TASK_DIALOG"}
        taskId={state.referenceType === "ADD_TASK_DIALOG" ? state.referenceId : null}
        handleCloseFunction={handleCloseDialogInRedux}
      />
      <AddCalendarEventDialog
        showDialog={state.referenceType === "ADD_CALENDAR_EVENT_DIALOG"}
        eventId={state.referenceType === "ADD_CALENDAR_EVENT_DIALOG" ? state.referenceId : ""}
        ownerId={state.referenceType === "ADD_CALENDAR_EVENT_DIALOG" ? state.config?.currentUserId : ""}
        startDate={state.referenceType === "ADD_CALENDAR_EVENT_DIALOG" ? state.config?.startDate : undefined}
        endDate={state.referenceType === "ADD_CALENDAR_EVENT_DIALOG" ? state.config?.endDate : undefined}
        handleClose={handleCloseDialogInRedux}
        handleRefreshList={() => ({})}
      />
      <ChangePasswordDialog
        showDialog={state.referenceType === "CHANGE_PASSWORD_DIALOG"}
        handleClose={handleCloseDialogInRedux}
      />
    </React.Fragment>
  );
};

export default DynamicDialogListener;
