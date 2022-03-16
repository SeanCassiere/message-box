import { useCallback, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";
import { dummyPromise } from "../../shared/util/testingUtils";

interface IProps {
  handleClose: () => void;
  handleAccept: () => void;
  showDialog: boolean;
  deleteId: string | null;
}

const DeleteEventConfirmationDialog = (props: IProps) => {
  const { handleClose, handleAccept, showDialog, deleteId } = props;

  const [isLoading, setIsLoading] = useState(false);

  const deleteCalendarEvent = useCallback(async () => {
    if (!deleteId) return;

    setIsLoading(true);

    await dummyPromise(4000);
    console.log("deleting", deleteId);
    setIsLoading(false);

    handleAccept();
  }, [deleteId, handleAccept]);

  return (
    <Dialog open={showDialog} onClose={() => ({})} maxWidth="sm" disableEscapeKeyDown fullWidth>
      <DialogHeaderClose title="Are you sure?" onClose={handleClose} />
      <DialogContent>
        <DialogContentText sx={{ mt: 3 }}>Are you sure you want to delete this event?</DialogContentText>
      </DialogContent>
      <DialogBigButtonFooter
        submitButtonText="YES, DELETE THIS EVENT"
        onSubmit={deleteCalendarEvent}
        color="error"
        isLoading={isLoading}
      />
    </Dialog>
  );
};

export default DeleteEventConfirmationDialog;