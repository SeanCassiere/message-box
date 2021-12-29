import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";

interface IProps {
	handleClose: () => void;
	handleAccept: () => void;
	showDialog: boolean;
}

const DeleteConfirmationDialog = (props: IProps) => {
	const { handleClose, handleAccept, showDialog } = props;

	return (
		<Dialog open={showDialog} onClose={() => ({})} maxWidth='sm' disableEscapeKeyDown fullWidth>
			<DialogTitle>Are you sure you want to delete this?</DialogTitle>
			<DialogContent>
				<DialogContentText>This is a permanent deletion, are you sure you want to proceed.</DialogContentText>
			</DialogContent>
			<DialogActions>
				<LoadingButton onClick={handleClose} color='error'>
					Cancel
				</LoadingButton>
				<LoadingButton onClick={handleAccept}>Confirm</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};

export default DeleteConfirmationDialog;
