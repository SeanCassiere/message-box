import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSnackbar } from "notistack";

import UserRegistrationForm from "./UserRegistrationForm";
import RegistrationSuccessDialog from "./RegisterSuccessDialog";

import { client } from "../../shared/api/client";
import { formatErrorsToFormik } from "../../shared/util/errorsToFormik";
import { MESSAGES } from "../../shared/util/messages";

const validationSchema = yup.object().shape({
  clientName: yup.string().required("Company name is required"),
  email: yup.string().email("Must be a valid email").required("Username is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  password: yup.string().required("Password is required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm your new password"),
});

const RegisterScreen = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      clientName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      const { clientName, passwordConfirmation, ...rest } = values;
      const currentHost = window.location.protocol + "//" + window.location.host;
      const confirmationPath = "/confirm-account/";
      const payload = {
        client: {
          clientName,
        },
        user: {
          ...rest,
        },
        host: currentHost,
        path: confirmationPath,
      };

      client
        .post("/Clients", payload)
        .then((res) => {
          if (res.status === 400) {
            enqueueSnackbar(MESSAGES.INPUT_VALIDATION, { variant: "warning" });
            setErrors(formatErrorsToFormik(res.data.errors));
          }

          if (res.status === 200) {
            setShowRegistrationSuccess(true);
          }
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
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

export default RegisterScreen;
