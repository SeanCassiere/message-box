import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

import { client } from "../../../../shared/api/client";
import { selectLookupListsState } from "../../../../shared/redux/store";
import { formatErrorsToFormik } from "../../../../shared/util/errorsToFormik";
import { IRoleProfile } from "../../../../shared/interfaces/Client.interfaces";

const validationSchema = yup.object().shape({
	rootName: yup.string().required("A role has be based on an existing role"),
	viewName: yup.string().required("Role name is required"),
});

interface IProps {
	roleId: string | null;
	handleClose: () => void;
	handleRefreshList: () => void;
	showDialog: boolean;
}

const EditUserDialog = (props: IProps) => {
	const { handleClose, handleRefreshList, showDialog, roleId } = props;

	const { rolesList } = useSelector(selectLookupListsState);

	const [isLoadingData, setIsLoadingData] = useState(true);
	const [foundDefaultRole, setFoundDefaultRole] = useState<IRoleProfile | null>(null);

	const isFieldInactive = useMemo(
		() => isLoadingData || foundDefaultRole?.isUserDeletable === false,
		[isLoadingData, foundDefaultRole]
	);

	const formik = useFormik({
		initialValues: {
			rootName: "employee",
			viewName: "",
		},
		validationSchema,
		onSubmit: (values, { setSubmitting, setErrors }) => {
			console.log(values);
			client[roleId ? "put" : "post"](roleId ? `/Roles/${roleId}` : "/Clients/Roles", values)
				.then((res) => {
					if (res.status === 403 || res.status === 400) {
						setErrors(formatErrorsToFormik(res.data.errors));
					}

					if (res.status === 200) {
						handleRefreshList();
						handleClose();
					}
				})
				.catch((e) => console.log(e))
				.finally(() => {
					setSubmitting(false);
				});
		},
	});

	useEffect(() => {
		setFoundDefaultRole(null);
		formik.resetForm();

		if (roleId) {
			client
				.get(`/Roles/${roleId}`)
				.then((res) => {
					if (res.status === 200) {
						setFoundDefaultRole(res.data);
						formik.setFieldValue("viewName", res.data.viewName);
						formik.setFieldValue("rootName", res.data.rootName);
					} else {
						console.log(res.data);
					}
				})
				.catch((e) => console.log(e))
				.finally(() => {
					setIsLoadingData(false);
				});
		} else {
			setIsLoadingData(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roleId]);

	return (
		<Dialog open={showDialog} onClose={() => ({})} maxWidth='sm' disableEscapeKeyDown fullWidth>
			<form onSubmit={formik.handleSubmit}>
				<DialogTitle>{roleId ? "Edit" : "New"}&nbsp;Role</DialogTitle>
				<DialogContent>
					<Grid container spacing={1}>
						<Grid item md={12}>
							<TextField
								margin='normal'
								fullWidth
								label='Role Name'
								id='viewName'
								name='viewName'
								autoComplete='off'
								variant='standard'
								value={formik.values.viewName}
								onChange={formik.handleChange}
								error={formik.touched.viewName && Boolean(formik.errors.viewName)}
								helperText={formik.touched.viewName && formik.errors.viewName}
								autoFocus
								disabled={isFieldInactive}
							/>
						</Grid>
						<Grid item md={12}>
							<FormControl variant='standard' sx={{ mt: 2, minWidth: 120 }} fullWidth disabled={isFieldInactive}>
								<InputLabel id='viewName-label' disableAnimation shrink>
									Based on
								</InputLabel>
								<Select
									labelId='viewName-label'
									id='rootName'
									name='rootName'
									value={formik.values.rootName}
									onChange={formik.handleChange}
									error={formik.touched.rootName && Boolean(formik.errors.rootName)}
								>
									{rolesList
										.filter((role) => role.isUserDeletable === false)
										.map((role) => (
											<MenuItem key={`select-root-rol-${role.roleId}`} value={role.rootName}>
												{role.viewName}
											</MenuItem>
										))}
								</Select>
								{/* formik.touched.viewName && formik.errors.viewName */}
								<FormHelperText>{formik.touched.rootName && formik.errors.rootName}</FormHelperText>
							</FormControl>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<LoadingButton onClick={handleClose} color='error'>
						Cancel
					</LoadingButton>
					<LoadingButton type='submit' loading={formik.isSubmitting}>
						{roleId ? <>Update</> : <>Submit</>}
					</LoadingButton>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default EditUserDialog;
