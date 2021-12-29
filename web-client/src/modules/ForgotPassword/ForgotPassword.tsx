import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import { client } from "../../shared/api/client";
import { formatErrorsToFormik } from "../../shared/util/errorsToFormik";

import UserRegistrationForm from "./UserPasswordResetForm";
import RegistrationSuccessDialog from "./ResetSuccessDialog";

const validationSchema = yup.object().shape({
	token: yup.string().required("Token is required"),
	password: yup.string().required("Password is required"),
	passwordConfirmation: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
});

const ForgotPasswordScreen = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

	useEffect(() => {
		if (!id || id === "") {
			navigate("/");
		}
	}, [id, navigate]);

	const formik = useFormik({
		initialValues: {
			token: id as string,
			password: "",
			passwordConfirmation: "",
		},
		validationSchema,
		onSubmit: (values, { setSubmitting, setErrors }) => {
			const { passwordConfirmation, ...rest } = values;
			const payload = {
				...rest,
			};

			client
				.post("/Users/ResetPassword/WithToken", payload)
				.then((res) => {
					if (res.status === 400) {
						setErrors(formatErrorsToFormik(res.data.errors));
					}

					if (res.status === 200) {
						setShowRegistrationSuccess(true);
					}
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setSubmitting(false);
				});
		},
	});

	return (
		<>
			<RegistrationSuccessDialog open={showRegistrationSuccess} />
			<UserRegistrationForm formik={formik} />
		</>
	);
};

export default ForgotPasswordScreen;
