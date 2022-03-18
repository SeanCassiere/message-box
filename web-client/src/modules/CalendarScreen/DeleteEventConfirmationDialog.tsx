import { useCallback, useState, memo } from "react";
import { useSnackbar } from "notistack";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import DialogHeaderClose from "../../shared/components/Dialog/DialogHeaderClose";
import DialogBigButtonFooter from "../../shared/components/Dialog/DialogBigButtonFooter";
import { client } from "../../shared/api/client";
import { MESSAGES } from "../../shared/util/messages";

interface IProps {
  handleClose: () => void;
  handleAccept: () => void;
  showDialog: boolean;
  deleteId: string | null;
}

const DeleteEventConfirmationDialog = (props: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleClose, handleAccept, showDialog, deleteId } = props;

  const [isLoading, setIsLoading] = useState(false);

  const deleteCalendarEvent = useCallback(async () => {
    if (!deleteId) return;

    setIsLoading(true);

    client
      .delete(`/CalendarEvent/${deleteId}`)
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar("Successfully deleted event", { variant: "success" });
        } else {
          enqueueSnackbar("Error: Something went wrong", { variant: "error" });
        }
      })
      .catch((e) => {
        console.log(`deleting event ${deleteId}`, e);
        enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
      })
      .finally(() => {
        setIsLoading(false);
        handleAccept();
      });
  }, [deleteId, enqueueSnackbar, handleAccept]);

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

export default memo(DeleteEventConfirmationDialog);
