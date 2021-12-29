import React from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface IProps {
	open: boolean;
}

const RegistrationSuccessDialog = (props: IProps) => {
	const navigate = useNavigate();
	const { open } = props;

	const handleOkClick = () => {
		navigate("/");
	};

	return (
		<>
			<Dialog
				open={open}
				onClose={() => ({})}
				maxWidth='xs'
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>Confirm your account</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						Your account has been created. Please check your email to confirm your account.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleOkClick} variant='text' autoFocus>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default RegistrationSuccessDialog;
