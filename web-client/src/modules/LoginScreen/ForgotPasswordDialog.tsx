import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { red } from "@mui/material/colors";

import Snackbar from "@mui/material/Snackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";

import Alert from "./Alert";

import { client } from "../../shared/api/client";
import { formatErrorsToFormik } from "../../shared/util/errorsToFormik";

interface IProps {
	open: boolean;
	handleDismiss: () => void;
}

const validation2fa = yup.object().shape({
	email: yup.string().required("Email is required"),
	password: yup.string().required("A new password is required"),
	code: yup.string().required("2FA Code is required"),
});

const validationEmailReset = yup.object().shape({
	emailReset: yup.string().required("Email is required"),
});

const ForgotPasswordDialog = (props: IProps) => {
	const { open, handleDismiss } = props;
	const [expanded, setExpanded] = useState("panel1"); // controls which panel is expanded
	const [showSnackbar, setShowSnackbar] = useState(false); // used to toggle the snackbar (toast)

	const handleChangeOpen = (key: string) => {
		setExpanded(key);
	};

	const formik2fa = useFormik({
		initialValues: {
			email: "",
			password: "",
			code: "",
		},
		validationSchema: validation2fa,
		onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
			client
				.post("/Users/ResetPassword/With2FA", values)
				.then((res) => {
					if (res.status === 400) {
						setErrors(formatErrorsToFormik(res.data.errors));
					}

					if (res.status === 200) {
						setShowSnackbar(true);
						handleDismiss();
						resetForm();
					}
				})
				.catch((err) => console.log(err))
				.finally(() => {
					setSubmitting(false);
				});
		},
	});

	const formikEmailReset = useFormik({
		initialValues: {
			emailReset: "",
		},
		validationSchema: validationEmailReset,
		onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
			const formData = { email: values.emailReset };
			client
				.post("/Users/ResetPassword/RequestEmail", formData)
				.then((res) => {
					if (res.status === 400) {
						setErrors(formatErrorsToFormik(res.data.errors));
					}

					if (res.status === 200) {
						setShowSnackbar(true);
						handleDismiss();
						resetForm();
					}
				})
				.catch((err) => console.log(err))
				.finally(() => {
					setSubmitting(false);
				});
		},
	});

	// handles the closing of the main forgot-password dialog
	const closeDialog = () => {
		formik2fa.resetForm();
		formikEmailReset.resetForm();
		handleDismiss();
	};

	//
	const handleCloseSuccessAlert = (_?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === "clickaway") {
			return;
		}
		setShowSnackbar(false);
	};

	return (
		<>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				open={showSnackbar}
				autoHideDuration={6000}
				onClose={handleCloseSuccessAlert}
			>
				<Alert onClose={handleCloseSuccessAlert} severity='success' sx={{ width: "100%" }}>
					{expanded === "panel1" && <>Your password has been changed</>}
					{expanded === "panel2" && <>A password reset link has been sent to your email</>}
				</Alert>
			</Snackbar>
			<Dialog open={open} onClose={handleDismiss} maxWidth='xs' disableEscapeKeyDown>
				<DialogTitle>Reset password</DialogTitle>
				<DialogContent>
					<DialogContentText sx={{ mb: 2 }}>How do you want to reset your password?</DialogContentText>
					<Accordion
						elevation={0}
						expanded={expanded === "panel1"}
						onChange={() => handleChangeOpen("panel1")}
						disabled={formikEmailReset.isSubmitting}
					>
						<AccordionSummary
							expandIcon={
								expanded === "panel1" ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />
							}
							aria-controls='panel1a-content'
							id='panel1a-header'
						>
							<Typography sx={{ py: 0.3 }}>Using 2FA</Typography>
							<Typography
								color='white'
								sx={{
									bgcolor: red[500],
									px: 1,
									ml: 1,
									borderRadius: 5,
									fontSize: 14,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								recommended
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<form onSubmit={formik2fa.handleSubmit}>
								<Typography sx={{ mb: 2 }}>Enter the two-factor code from your authenticator app.</Typography>
								<TextField
									margin='dense'
									fullWidth
									label='Email Address'
									id='email'
									name='email'
									autoComplete='off'
									variant='standard'
									value={formik2fa.values.email}
									onChange={formik2fa.handleChange}
									error={formik2fa.touched.email && Boolean(formik2fa.errors.email)}
									helperText={formik2fa.touched.email && formik2fa.errors.email}
									autoFocus
								/>
								<TextField
									margin='dense'
									fullWidth
									label='New Password'
									id='password'
									name='password'
									type='password'
									autoComplete='off'
									variant='standard'
									value={formik2fa.values.password}
									onChange={formik2fa.handleChange}
									error={formik2fa.touched.password && Boolean(formik2fa.errors.password)}
									helperText={formik2fa.touched.password && formik2fa.errors.password}
								/>
								<TextField
									margin='dense'
									fullWidth
									label='Two-Factor Authentication Code'
									id='code'
									name='code'
									autoComplete='off'
									variant='standard'
									value={formik2fa.values.code}
									onChange={formik2fa.handleChange}
									error={formik2fa.touched.code && Boolean(formik2fa.errors.code)}
									helperText={formik2fa.touched.code && formik2fa.errors.code}
								/>
								<LoadingButton
									variant='contained'
									loading={formik2fa.isSubmitting}
									sx={{ mt: 2 }}
									fullWidth
									type='submit'
								>
									Reset
								</LoadingButton>
							</form>
						</AccordionDetails>
					</Accordion>
					<Accordion
						elevation={0}
						expanded={expanded === "panel2"}
						onChange={() => handleChangeOpen("panel2")}
						disabled={formik2fa.isSubmitting}
					>
						<AccordionSummary
							expandIcon={
								expanded === "panel2" ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />
							}
							aria-controls='panel2a-content'
							id='panel2a-header'
						>
							<Typography sx={{ py: 0.3 }}>Using email</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<form onSubmit={formikEmailReset.handleSubmit}>
								<Typography sx={{ mb: 2 }}>An email will be sent with a link to reset your password.</Typography>
								<TextField
									margin='dense'
									fullWidth
									label='Email Address'
									id='emailReset'
									name='emailReset'
									autoComplete='email'
									variant='standard'
									value={formikEmailReset.values.emailReset}
									onChange={formikEmailReset.handleChange}
									error={formikEmailReset.touched.emailReset && Boolean(formikEmailReset.errors.emailReset)}
									helperText={formikEmailReset.touched.emailReset && formikEmailReset.errors.emailReset}
									autoFocus
								/>
								<LoadingButton
									variant='contained'
									loading={formikEmailReset.isSubmitting}
									sx={{ mt: 2 }}
									fullWidth
									type='submit'
								>
									Send Email
								</LoadingButton>
							</form>
						</AccordionDetails>
					</Accordion>
				</DialogContent>
				<DialogActions>
					<LoadingButton type='button' onClick={closeDialog}>
						Close
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ForgotPasswordDialog;
